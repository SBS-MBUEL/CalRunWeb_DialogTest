'use strict';

/*For error handling, we are moving to this model:
	CalRunFrontEnd.js will be used to display the error messages
	Any error that occurs in CalRunFrontEnd will be funneled through CalRun for processing
	Each function in CalRunFrontEnd will have a try/catch which will call the CalRun.onError function
	
	CalRun.js will process any errors that occur
	Each function will have a try/catch which will call the CalRun.onError function
	The CalRun.onError function will take an exception and pass it to sbGlobal for parsing and processing
	The CalRun.onError function will then notify CalRunFrontEnd that an error should be displayed

	All other modules, we will remove all try/catch handling of errors
	This is to preserve the full stack trace
	Instead of internal .onError functions, each module will simply throw new errors
	which will be caught by CalRun.js and processed by sbGlobal
	This allows us to know exactly where in the code an error occurred
	If we use internal try/catch functions, we loose this data

	When we refactor the code, we will keep this model in mind
*/
//TODO: Need to be able to run code without having an actual device or reference. Maybe a mock reference and mock device? Or a simulator?
//! pump control code is located at svn://svn.seabird.com/Bitnami/repos/Rnd/Cal/SNTLFixtureV2
//let debugFlag = false; // force use of the test database when set to true. This can be handy when working on a production computer

let deviceTypes = 
{
	Device: 1,
	Reference: 2,
	Control: 3
};

Object.freeze(deviceTypes);

/**
 * CalRun is now an object
 */
function CalRun(isDebug)
{
	let self = this;

	self.errorCount = 0;
	self.logLevel = statusLevel.Info; //default logging level for CalRun

	self.softwareName = 'CalRun';
	self.versionNumber = 'V12.0.0 beta 1.34';
	
	//contains the possible options that can be displayed on the screen
	self.calibrationOptions = null;

	//hook up the event handlers
	self.listener = new SBListener();
	self.coefficientLoaders = [];
	self.on = self.listener.on;
	self.emit = self.listener.emit;
	self.defaultSampleWindowSize = 7;  //default window size
	self.sampleWindowSize = self.defaultSampleWindowSize;
	self.portList = [];
	self.deviceList = [];
	self.referenceList = [];
	self.controlList = [];
	self.dataPointList = [];
	self.autoConnectSettings = null;
	self.maxDevices = 1;
	self.calibrationID = 0;
	self.currentDataPoint = -1;
	self.calibrationStarted = false;
	self.takingDataPoints = false;
	self.runningReference = false;
	self.userName = '';
	self.computerName = '';
	self.systemName = 'Not Set';
	self.systemID = 0;
	self.configurationID = 0;
	self.keithleyBusy = false;
	self.pumpControllerConfigured = false;
	self.fillCompleted = false;
	self.drainCompleted = false;
	self.additionalWaitTimeOnceStable = 0;
	self.timeWaitedOnceStable = 0;
	self.dataPointTimeout = 0;
	self.timeAtDataPoint = 0;
	self.referenceSensorTimeout = 0;
	self.timeWaitedReferenceSensor = 0;
	self.deviceUnderTestTimeout = 0;
	self.timeWaitedDevice = 0;
	self.measurandCOV = [];
	
	self.widgetCommunications = null;
	self.debugFlag = (isDebug === true);
	self.keithley = null;

	self.iterations = 1; //how many sequential calibrations
	self.coefficientCounter = 0;

	self.configurationManager = new ConfigurationManager(self.debugFlag);
	self.configurationManager.applicationName = 'CalRun';

	self.initialize = function(callback)
	{
		try
		{
	
			self.widgetCommunications = new WidgetCommunications('CalRun');

			self.emit('notifyDebug', self.debugFlag);

			self.widgetCommunications.on('awake', function(parameters)
			{
				self.deviceList.forEach(function(device)
				{
					device.awake(parameters);
				});

				self.referenceList.forEach(function(device)
				{
					device.awake(parameters);
				});
			});

			self.widgetCommunications.on('portConfigured', function(parameters)
			{
				self.emit('portConfigured', parameters);
			});

			self.widgetCommunications.on('dataReceived', function(parameters)
			{
				self.deviceList.forEach(function(device)
				{
					device.dataReceived(parameters);
				});
				self.referenceList.forEach(function(device)
				{
					device.dataReceived(parameters);
				});

				if(self.keithley && self.keithley.portName === parameters.portName)
				{
					self.keithley.dataReceived(parameters.data);
				}
	
			});

			self.widgetCommunications.on('clientUserName', function(clientUserName)
			{
				self.userName = clientUserName;
				self.configurationManager.userName = clientUserName;
			});

			self.widgetCommunications.on('pcName', function(pcName)
			{
				self.computerName = pcName;
				self.configurationManager.pcName = pcName;
			});

			self.widgetCommunications.on('error', function(parameters)
			{
				try
				{
					
					if(parameters.message.indexOf('Access denied') > -1)
					{
						let notifiedError = false;
						self.deviceList.forEach(function(device)
						{
							if(!notifiedError && device.discovering === true)
							{
								notifiedError = true;
								throw new Error('Unable to access comm port, ending calibration');
							}
							device.discovering = false;
						});
					}
					
					self.onError(parameters);
	
				}
				catch(err)
				{
					self.onError(err);
				}
			});

			self.widgetCommunications.on('connect', function(data)
			{
				self.logEvent(statusLevel.Success, data, false);
			});

			self.widgetCommunications.on('serialPortState', function(parameters)
			{
				if(parameters.usedByCurrentApplication === true && parameters.isPortOpen === true)
				{
					self.emit('serialPortState', {portName: parameters.portName, isOpen: true});
					return;
				}
				self.emit('serialPortState', {portName: parameters.portName, isOpen: false});
			});

			self.configurationManager.on('configurationSetAsCurrent', function(data)
			{
				self.configurationManager.getConfigurationSettings(self.systemID, data.ConfigurationID);
			});

			self.configurationManager.on('configurationSaved', function(data)
			{
				//nothing to do here unless we want to debug
				//console.log(data);
			});

			self.getAutoConnectSettings();
			self.getDeviceTypesWithCOV();

			let interval = setInterval(function()
			{
				if(self.widgetCommunications.connected === true)
				{
					self.widgetCommunications.getUserName();
					self.widgetCommunications.getComputerName();
					self.widgetCommunications.getSerialPortList(self.displayPorts);
					//TODO: Hard coded value, should come from the database configuration
                    self.widgetCommunications.enableLoggingTimestamps(true);
					clearInterval(interval);
				}
			}, 100);

			let interval2 = setInterval(function()
			{
				if(self.calibrationOptions !== null &&
					self.systemID > 0 &&
					self.userName &&
					self.computerName)
				{
					clearInterval(interval2);
					self.configurationManager.on('settingsRetrieved', callback);
					self.configurationManager.on('settingsRetrieved', function()
					{
						self.emit('settingsRetrieved');
					});
					self.configurationManager.on('configurationsRetrieved', self.recallConfigurationSettings);
					self.configurationManager.recallConfigurations(self.systemID);
				}
			}, 100);

			self.emit('initializationComplete', 'null');
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	//FLOW
	self.activateFlowPump = function(activate)
	{
		try
		{
			let flow = self.getRelayActivationConfiguration();
			self.activateRelay(flow.portName, flow['Flow relay'], activate);
			self.emit('flowPumpActivated', activate);
		}
		catch(err)
		{
			self.onError(err);
		}
	};
	//FLOW

	self.fillRequired = function(dataPointIndex)
	{
		for(let i = 0; i < self.dataPointList[dataPointIndex].deviceList.length; i++)
		{
			if(self.dataPointList[dataPointIndex].deviceList[i].Fill === 'yes')
			{
				return true;
			}
		}
		return false;
	};

	self.drainRequired = function(dataPointIndex)
	{
		for(let i = 0; i < self.dataPointList[dataPointIndex].deviceList.length; i++)
		{
			if(self.dataPointList[dataPointIndex].deviceList[i].Drain === 'yes')
			{
				return true;
			}
		}
		return false;
	};

	//DRAIN
	self.drain = function()
	{
		self.drainCompleted = false;
		let drainValve = self.getRelayActivationConfiguration();
		
		if(drainValve.portName !== false && drainValve['Drain relay'].toLowerCase() !== 'not set' && drainValve['Drain time (sec)'].toLowerCase() !== 'not set')
		{
			self.activateRelay(drainValve.portName, drainValve['Drain relay'], true);
			self.emit('drainValveActivated', true);
			let drainTime = parseInt(drainValve['Drain time (sec)']) * 1000; //convert to ms
			setTimeout(function()
			{

				self.activateRelay(drainValve.portName, drainValve['Drain relay'], false);
				self.drainCompleted = true;
				self.emit('drainValveActivated', false);
			}, drainTime);
			return true;
		}
		return false;
	};
	//DRAIN

	//FILL
	self.fill = function()
	{
		self.fillCompleted = false;
		let fillValve = self.getRelayActivationConfiguration();
		
		if(fillValve.portName !== false && fillValve['Fill relay'].toLowerCase() !== 'not set' && fillValve['Fill time (sec)'].toLowerCase() !== 'not set')
		{
			self.activateRelay(fillValve.portName, fillValve['Fill relay'], true);
			self.emit('fillValveActivated', true);
			let fillTime = parseInt(fillValve['Fill time (sec)']) * 1000; //convert to ms
			setTimeout(function()
			{
				self.activateRelay(fillValve.portName, fillValve['Fill relay'], false);
				setTimeout(function()
				{
					self.fillCompleted = true;
				}, 500);
				self.emit('fillValveActivated', false);
			}, fillTime);
			return true;
		}
		return false;
	};
	//FILL

	self.endCalibration = function(success, manualStop)
	{
		if(manualStop === true)
		{
			self.logEvent(statusLevel.Error, 'Calibration stopped by user', false);
		}

		if(success === true)
		{
			self.stopAllDevices();
			self.endCalibrationInDatabase();
		}
		
		self.calibrationStarted = false;

		//DRAIN
		//FLOW

		//don't turn off the flow pump unless drain is completed
		let checkDrain = setInterval(function()
		{
			if(self.drainCompleted === true)
			{
				clearInterval(checkDrain);
				//once drain is completed, need to wait a bit before turning off
				//the flow pump and calling the cal done
				setTimeout(function()
				{
					self.activateFlowPump(false);
					self.emit('calibrationEnded', success);
				}, 1000);
			}
		}, 500);

		//DRAIN
		//FLOW
	};




	/**
	 * Saves settings and notifies the system that one device has been processed
	 * @param {object} device - Device object from sbGlobals
	 */
	self.saveDarkCounts = function(device)
	{
		try
		{
			let dict = 
			{
				'CHL-470': 'Chlorophyll',
				'CHL-440': 'Chlorophyll',
				'Backscattering-700': 'Backscatter',
				'Backscattering-470': 'Backscatter',
				'Backscattering-530': 'Backscatter',
				'FDOM': 'FDOM'
			};
			for (let i = 0; i < device.darkCountInfo.length; i++) 
			{
				for (let j = 0; j < device.darkCountInfo[i].DarkCounts.length; j++) 
				{
					//save settings locally
					let modelNumberID = 
					calRun.calibrationOptions['modelNumbers'].find(function (modelNumberID) 
					{
						return modelNumberID.ModelNumber == 'ECOV2';
					}).ModelNumberID;
					let serialNumber = device.serialNumber.replace(/^0+/, '');
					let key = dict[device.darkCountInfo[i].Measurand];
					key = 'Darkcounts_' + key.toUpperCase();
					let value = device.darkCountInfo[i].DarkCounts[j].Value;
					//This is a mess, but it gets all the information into the database.  CalCertWeb currently has no way of distinguishing between "Backscattering-700" & "Backscattering-470", or Min / Max / Ave dark counts.  This needs to be refactored so it's handled better, but for expediency and keeping CalCertWeb working with CalRunWeb for ECO V2, this will work sort of.
					//2020-09-12 daveg modified this to be a JSON object so it'll be easier to extract the data when querying by using JSON.parse to turn it into an object that contains the rest of the missing data.
					let comments = JSON.stringify(
						{
							Measurand: device.darkCountInfo[i].Measurand,
							Type: device.darkCountInfo[i].DarkCounts[j].Name,
							Gain: device.darkCountInfo[i].Gain,
							Software: calRun.softwareName,
							Version: calRun.versionNumber 
						});
					//save settings to the database
					let parameters = {
						dostuff: 'saveDarkCounts',
						debug: self.debugFlag,
						modelNumberID: modelNumberID,
						serialNumber: serialNumber,
						key: key,
						value: value,
						comments: comments
					};
					self.emit('dark counts saved', device.index);
					//console.log(parameters);
					ProcessDatabaseRequest(parameters, function(data)
					{
						if(data.length < 1)
						{
							self.logEvent(statusLevel.Error, 'saveDarkCounts: Error saving dark counts: ' + data);
						}
					});
				}			
			}
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * This function connects the measurands to their individual coefficients of variation (COV) values out of the database & appends them to the deviceList or referenceList objects for each device.
	*/
	self.matchCOVtoMeasurand = function()
	{
		//a couple of arrays to hold the reference (ref) and target (tar) measurands.  As there can be multiples of each we need to accommodate more than one of each which is the current case for ECO V2
		
		let devices = [];		

		for(let a = 0; a < self.referenceList.length; a++)
		{
			devices.push(self.referenceList[a]);
		}
		for(let b = 0; b < self.deviceList.length; b++)
		{
			devices.push(self.deviceList[b]);
		}

		for(let i = 0; i < devices.length; i++)
		{
			let measurands = [];
			let selectedMeasurands = devices[i].measurands;

			for (let j = 0; j < selectedMeasurands.length; j++)
			{
				measurands.push(selectedMeasurands[j].id)
			}
			matchToDevice(devices[i], measurands);
		}

		// for(let k = 0; k < devices.length; k++)
		// {
		// 	let selectedMeasurand = devices[k].measurands;
		// 	for(let i = 0; i < devices.length; i++)
		// 	{
		// 		for(let j = 0; j < selectedMeasurand.length; j++)
		// 		{
		// 			measurands.push(selectedMeasurand[j].id);
		// 		}
		// 		matchToDevice(devices[i], measurands);
		// 	}
		// }
		
		
		
		
		
		// let ref = [];
		// let tar = [];

		// for(let i = 0; i < self.referenceList.length; i++)
		// {
		// 	let refObj = self.referenceList[i].measurands;
		// 	for(let j = 0; j < refObj.length; j++)
		// 	{
		// 		ref.push(refObj[j].id);
		// 	}
		// 	matchToDevice(self.referenceList[i], ref);
		// }

		// for (let k=0; k < self.deviceList.length; k++)
		// {
		// 	let tarObj = self.deviceList[k].measurands;	
		// 	for(let l = 0; l < tarObj.length; l++)
		// 	{
		// 		tar.push(tarObj[l].id);
		// 	}
		// 	matchToDevice(self.deviceList[k], tar);
		// }

		function matchToDevice(device, measurands)
		{
			let parameters = {
				dostuff: 'matchMeasurandToCov',
				debug: self.debugFlag,
				measurands: measurands
			}

			ProcessDatabaseRequest(parameters, function(data)
			{
				let covData = JSON.parse(data);
				let sortedMeasurands = [];
				for(let m = 0; m < device.measurands.length; m++)
				{
					sortedMeasurands.push(device.measurands[m].id);
				}
				sortedMeasurands = sortedMeasurands.sort();

				for(let n = 0; n < sortedMeasurands.length; n++)
				{
					device.measurands[n].cov = covData.filter(a => a.measurementsubtype === device.measurands[n].id)[0].COV;
				}				

				if(data.length < 1)
				{
					self.logEvent(statusLevel.Error, 'matchMeasurandsToCOV: Error matching measurands to COV values: ' + data);
				}
			});
		}
	}

	self.endCalibrationInDatabase = function()
	{
		let parameters = {
			dostuff: 'endCalibration',
			calibrationID: self.calibrationID,
			debug: self.debugFlag
		};

		ProcessDatabaseRequest(parameters, function(data)
		{
			console.warn(data);
		});
	};

	self.displayPorts = function(values)
	{
		values.unshift('Not Set');
		self.portList = values;
		self.GetCalibrationValues();
	};

	
	//This function filters to the reference coefficient object in the self.systemSettings object, and returns that object to be used in processing the reference coefficients
	self.getReferenceCoefficientObject = function(modelNumber, serialNumber)
	{
		let test = self.configurationManager.getConfigurationByParameters('reference', 'Coefficients');
		// let test = self.systemSettings.filter(function(e) 
		// {
		// 	return e.ConfigurationArea === 'reference' && e.ItemName === 'Coefficients';
		// });
		return test;
	};

	self.validateStartParameters = function()
	{
		if(self.referenceList.length === 0)
		{
			self.logEvent(statusLevel.Error, 'No reference sensor configured, calibration aborted. Please configure a reference sensor', false);
			return false;
		}

		let subTypes = self.configurationManager.getConfigurationByParameters('reference', 'Measurand Sub-Type');

		//sub type needs to be set for all measurands
		for (let i = 0; i < subTypes.length; i++)
		{
			if(subTypes[i].ItemValue === 'Not Set')
			{
				self.logEvent(statusLevel.Error, 'Reference Measurand Sub-Type detected as "Not Set", please check the Reference configuration and ensure all Measurand Sub-Types have been set', false);
				return false;
			}
		}

		//make sure there is a device to be calibrated
		if(!self.checkSomethingSelected())
		{
			self.logEvent(statusLevel.Error, 'No devices selected, calibration aborted. Please select at least one device in order to perform a calibration. Make sure Port and Format are set to real values.  This error can occur if Node.js is not running.', false);

			return false;
		}

		if(self.dataPointList.length === 0)
		{
			self.logEvent(statusLevel.Error, 'No data points configured. Please use the "Points" configuration dialog to configure some data points', false);
			return false;
		}

		//Ensure that system settings are all filled out correctly
		//This list can be expanded later if desired.
		let systemItems = [
			'Calibration System Type', 
			'Calibration System Location', 
			'Number of sequential calibrations', 
			'Samples to average', 
			'Additional Wait Time Once Stable (ms)',
			'Data Point Timeout',
			'Device Under Test Timeout',
			'Reference Sensor Timeout'
		];

		for(let i = 0; i < systemItems.length; i++)
		{
			let systemValue = self.configurationManager.getConfigurationByParameters('system', systemItems[i]);
			if(systemValue.length === 0 || systemValue[0].ItemValue === 'Not Set' || systemValue[0].ItemValue === '')
			{
				self.logEvent(statusLevel.Error, 'System value "' + systemItems[i] + '" not set correctly. Please enter the System dialog and set this value before beginning a calibration', false);
				return false;
			}
		}

		return true;
	};
	
	/**
	 * This is what happens when you click the start button
	 * This is how the calibration starts
	 */
	self.startCalibration = function()
	{
		try
		{
			self.errorCount = 0;
			self.calibrationID = 0;
			self.currentDataPoint = 0;
			self.calibrationStarted = true;
			self.takingDataPoints = false;
			self.runningReference = false;
			self.ignoreErrors = true;			
			if(self.validateStartParameters() === false)
			{
				return;
			}

			self.getSystemSettings();
	
			//notify any U/I about this
			self.emit('calibrationStarted', 'null');
			
			//try to talk to any devices that may be connected
			//once the devices are connected, run the actual calibration
			self.discoverDevices();

			self.connectSystemDevices(self.controlList, self.referenceList);

			//when the device has been discovered, then stop it
			self.on('deviceDiscovered', function(index)
			{
				console.log('device discovered');
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};
	
	/**
	 * Opens ports for system devices
	 * If it's a reference, attempts to wake the device
	 * 
	 * @param {object list} systemObjects - pass in each list of devices as a separate argument, any number of arguments
	 */
	self.connectSystemDevices = function()
	{
		try
		{

			let listCounter = 0;
			let deviceCounter = 0;
			let deviceLists = arguments;

			if(arguments.length === 0)
			{
				throw new ReferenceError('No system devices found');
			}

			let connectInterval = setInterval(function()
			{
				try
				{

					//iterate through the device lists and pick the correct one
					let deviceList = deviceLists[listCounter];
				
					if(deviceCounter >= deviceList.length)
					{
						deviceCounter = 0;
						listCounter++;
						if(listCounter >= deviceLists.length)
						{
							clearInterval(connectInterval);
						}
					}
					else
					{
						let device = deviceList[deviceCounter];

						//open the port
						self.openPort(device.portName, device.baudRate, device.parityBit + ',' + device.dataBits);

						device.doingStatus = false;
						device.ready = true;

						if(device.isReference === true)
						{
							//We need to wait until we think the port is really open.
							//Since we don't know when that will be, we are going to assume 1/2 second
							setTimeout(function()
							{

								device.initializing = true;
								device.discovering = true;
								//Send the wakeup command to the device after the port is opened with a bit of a delay
								self.widgetCommunications.wakeDevice(device.portName);

							}, 1000);


						}
						deviceCounter++;
					}
				}
				catch(err)
				{
					self.onError(err);
				}
			}, 500); //? Could this timing be shortended? Do we care?
		}
		catch(err)
		{
			self.onError(err);
		}
	};


	/**
	 * Retrieves the stop commands from the database
	 * If the stop commands are successfully retrieved, they are then sent
	 * to the device
	 * 
	 * ? What should we do if no stop commands are found for the device
	 * 
	 * @param {object} device - and instance of Device.js from sbGlobal
	 * @param {function} callback - a function to be called when this is completed successfully
	 */
	self.retrieveStopCommands = function(device, callback)
	{
		try
		{
			if(typeof device.modelNumber === 'undefined')
			{
				throw new ReferenceError('Device is invalid');
			}
			var parameters = {
				dostuff: 'GetStopCommands',
				debug: String(self.debugFlag)
			};
		
			ProcessDatabaseRequest(parameters, function(data)
			{

				if(data.indexOf('Error:') > -1)
				{
					throw new ReferenceError('Error getting stop commands from database.');
				}
				if(callback && typeof callback === 'function')
				{
					callback(device, data);
				}
			});
		}
		catch(err)
		{
			self.onError(err);
		}

	};

	/**
	 * Iterate through all devices and references and stop them
	 */
	self.stopAllDevices = function()
	{
		try
		{
			//Iterate through the device list
			self.deviceList.forEach(function(device)
			{
				//only want to stop the devices that are selected
				//!This will not work if the devices do not accept a stop command
				if(device.selected === true)
				{
					self.stopDevice(device);
				}
			});
	
			//iterate through the reference list
			//we will stop all references
			//!This will not work if the devices do not accept a stop command
			self.referenceList.forEach(function(reference)
			{
				self.stopDevice(reference);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.stopDevice = function(device)
	{
		try
		{
			if(typeof device.modelNumber === 'undefined')
			{
				throw new ReferenceError('Device is invalid');
			}

			var parameters = 
			{
				dostuff: 'GetStopCommands',
				debug: self.debugFlag
			};

			ProcessDatabaseRequest(parameters, function(data)
			{
				device.ignoreErrors = true;
				device.running = false;
				let parsedCommands = JSON.parse(data);
				let commands = [];
				parsedCommands.forEach(function(command) 
				{
					commands.push(
						command.StopCommandText != null ? command.StopCommandText : String.fromCharCode(command.StopCommandValue)
					);
				});
				device.stop(commands);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.tryRunCalibration = function()
	{
		try
		{
			if(self.calibrationStarted === false)
			{
				return;
			}
	
			for(let i = 0; i < self.referenceList.length; i++)
			{
				if(self.referenceList[i].initializing === true)
				{
					return;
				}
			}
	
			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].initializing === true)
				{
					return;
				}
			}

			if(self.checkValidDevices() === false)
			{
				self.endCalibration(false);
				return;
			}
	
			if(self.validateMeasurands() === false)
			{
				self.endCalibration(false);
				return;
			}
			

			self.runCalibration();
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.validateMeasurands = function()
	{
		try
		{
			//validate measurands.
			//This could probably be a sub-function
			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].selected === true)
				{
					for(let j = 0; j < self.referenceList.length; j++)
					{
						let foundOne = false;
						let dutMeasurands = '';
						let referenceMeasurands = '';
						for(let k = 0; k < self.deviceList[i].measurands.length; k++)
						{
							if(dutMeasurands !== '')
							{
								dutMeasurands += '\r\n';
							}
							dutMeasurands += self.deviceList[i].measurands[k].id;
							referenceMeasurands = '';
							for (let l = 0; l < self.referenceList[j].measurands.length; l++)
							{
								if(referenceMeasurands !== '')
								{
									referenceMeasurands += '\r\n';
								}
								referenceMeasurands += self.referenceList[j].measurands[l].id;
								if(self.deviceList[i].measurands[k].id === self.referenceList[j].measurands[l].id)
								{
									foundOne = true;
								}
							}
		
						}
						if(foundOne === false)
						{
							self.endCalibration(false);
							let message = 'Current reference is not capable of calibrating ';
							message += 'Device # ' + (i + 1) + ': ' + self.deviceList[i].modelNumber + '-' + self.deviceList[i].serialNumber;
							message += ' on port ' + self.deviceList[i].portName + '\r\n';
							message += 'Please choose a different reference';
	
							self.logEvent(statusLevel.Error, message, false);
							return false;
	
						}

					}
	
				}
			}
			return true;

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.checkValidDevices = function()
	{

		try
		{
		//validate device types
			let systemType = calRun.configurationManager.getConfigurationByParameters('system', 'Calibration System Type');
			if(systemType.length === 0)
			{
				self.logEvent(statusLevel.Error, 'Calibration System Type is not set. Unable to continue calibration. Please set Calibration System Type in the "System" dialog', false);
				return false;
			}

			let systemTypeText = systemType[0].ItemValue;

			let models = self.calibrationOptions.modelBySystemType.filter(function(item)
			{
				return item.CalibrationSystemType === systemTypeText;
			});

			if(models.length === 0)
			{
				self.logEvent(statusLevel.Error, 'No models are configured for use with this sytem. Unable to continue calibration. Please set usable devices in the "System" dialog', false);
				return false;
			}

			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].selected === true)
				{
					let foundIt = false;
					for(let j = 0; j < models.length; j++)
					{
						if(models[j].ModelNumber === self.deviceList[i].modelNumber)
						{
							foundIt = true;
						}
					}

					if(foundIt === false)
					{
						let message = 'Device # ' + (i + 1) + ' on port ' + self.deviceList[i].portName + ' is a ' + self.deviceList[i].modelNumber + '\r\n';
						message += 'Unable to calibrate ' + self.deviceList[i].modelNumber + ' in this system.';
						self.logEvent(statusLevel.Error, message, false);
						return false;
					}
				}
			}
			return true;

		}
		catch(err)
		{
			self.onError(err);
		}
	};
	
	self.runCalibration = function()
	{
		//match up measurands with their respective coefficients of variation (COV).
		self.matchCOVtoMeasurand();

		self.emit('systemBusy', false);
		//FLOW
		self.activateFlowPump(true);
		//FLOW
		self.startCalibrationInDatabase(self.configureDevices);
	};

	/**
	 * configureDevices - first makes sure that all of the selected devices were successfully connected - if this fails it escapes
	 * If the code path finds all devices selected are connected, it continues to run the devices through setup.
	 */
	self.configureDevices = function()
	{
		let needSCPI = false;
		for(let i = 0; i < self.deviceList.length; i++)
		{
			//TODO: There should be an initialization routine for the device when the calibration is started
			self.deviceList[i].sampleWindow = self.sampleWindowSize;
			if (self.deviceList[i].selected === true 
				&& (self.deviceList[i].connectionSuccess === false || self.deviceList[i].ignoreErrors === true))
			{
				return;
			}
		}
		self.emit('systemBusy', true);

		//TODO: Replace with database configuration which indicates needing the SCPI interface
		for(let i = 0; i < self.deviceList.length; i++)
		{
			if(self.deviceList[i].selected === true)
			{
				if(self.deviceList[i].modelNumber === 'SNTL' || self.deviceList[i].deviceType === 'SNTL')
				{
					needSCPI = true;
				}
			}
		}


		if(needSCPI)
		{
			self.initializeSCPI(self.sendConfigToDevices);
		}
		else
		{
			self.sendConfigToDevices();
		}
	};

	self.initializeSCPI = function(callback)
	{	
		try
		{
			//!For now, we are assuming that the first item is the one we want. 
			//TODO: need to potentially initialize a bunch of SCPI devices.
			//TODO: Make sure all the settings make sense. Maybe unit test this?
			let settings = self.getSCPISettings();
			if (settings.length === 0)
			{
				console.warn('self.keithley initializeSCPI(): calibration stopped.');
	
				self.calibrationStarted = false;
				self.emit('systemBusy', false);
				throw new RangeError('Keithley multimeter not configured. Please configure in the Control configurator. Calibration halted.');
			}
	
			self.keithley = new SCPI(settings[0].Port);
			if (self.keithley.modelNumber === 'mockSCPI')
			{
				self.keithley.setValue(1, '7.954169E-06');
			}
		
			self.keithley.on('requestSendCommand', function(data)
			{
				self.widgetCommunications.sendCommand(data.portName, data.command, true);
			});
	
			self.keithley.on('dataReceived', function(data)
			{
				//TODO: Stuff this in the device list object
				self.processSCPISample(data);
			});
	
			self.keithley.init();
			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].selected === true && (self.deviceList[i].modelNumber === 'SNTL' || self.deviceList[i].deviceType === 'SNTL'))
				{
					//! This is hard coded for PHE. Needs to be fixed.
					self.keithley.addDevice(i + 1, self.deviceList[i].deviceType, self.deviceList[i].serialNumber, 'Phenanthrene', 11, self.getModelID(self.deviceList[i].deviceType));
				}
			}
			let scpiTimeoutCounter = 0;
	
			let scpiChecker = setInterval(function()
			{
				scpiTimeoutCounter++;
				if(scpiTimeoutCounter >= 100)
				{
					clearInterval(scpiChecker);
					self.endCalibration(false);
					self.logEvent(statusLevel.Error, 'Unable to initialize keithley multimeter, is it turned on?', false);
					self.emit('systemBusy', false);
					self.calibrationStarted = false;
					throw new TypeError('Unable to initialize keithley multimeter, is it turned on?');
				}
	

				if(self.keithley !== null && self.keithley.initialized === true)
				{
					clearInterval(scpiChecker);
					if(callback && typeof callback === 'function')
					{
						callback();
					}
				}
			}, 200);
		}
		catch(err)
		{
			console.warn('calibration stopped.');
	
			self.calibrationStarted = false;
			self.emit('systemBusy', false);
			self.onError(err);
		}
	
	};

	/**
	 * retrieves list of commands to be sent for a specific step - this should can be controlled by a for loop, to send to each activated port.
	 * @param {string} model selected model
	 * @param {string} firmware selected
	 * @param {string} test set of commands to retrieve, ex 'Service Check-In'
	 * @param {number} deviceID
	 * @param {function} callback1 function to call after retrieving data asynchronously
	 */
	self.retrieveCommands = function(device, test, callback)
	{
		if(!self.calibrationStarted)
		{
			return;
		}
	
		//console.log(model, firmware, test, deviceID, callback);
		// TEST in Console: retrieveCommands('ECOV2', '1.0.0', 'Calibration Setup', 'PORT_1');
		// console.warn(device);
		// setup params
		var parameters = {
			dostuff: 'GetCommands',
			model: device.modelNumber,
			firmware: device.firmwareVersion,
			test: test,
			debug: self.debugFlag
		};
	
		// Call XHR to retrieve commands
		ProcessDatabaseRequest(parameters, function(commands)
		{
			//console.log(parameters, commands);
			try
			{
				if(callback && typeof(callback) === 'function')
				{
					commands = JSON.parse(commands)[0];	// Parse commands array object

					//the commands get wiped out as they're used, so extract them before use so you can see what they were before they were used.
					//console.log(JSON.parse(JSON.stringify(commands)));
					
					// Launch callback to send commands
					// console.warn(commands, commands.length);
					if (commands.length > 0)
					{
						callback(device, commands); // Production code should call sendCommands
					}
					else
					{
						throw 'unable to retrieve commands from database. This could happen from a firmware change or a new device.';
					}
				}
				else
				{
					//the commands get wiped out as they're used, so extract them before use so you can see what they were before they were used.
					// console.log(JSON.parse(JSON.stringify(commands)));
				}
			}
			catch(err)
			{
				self.onError(err);
				console.warn('ProcessDatabaseRequest(): calibration stopped.');
	
				self.calibrationStarted = false;
				self.emit('allowUserInput', true);
				self.emit('systemBusy', false);
			}
		});
	
	
	};

	/**
	 * initialize sample variables in deviceList and referenceList objects
	 */
	self.initDevicesAndReferences = function()
	{
		self.timeWaitedOnceStable = 0;
		self.timeAtDataPoint = 0;
		self.timeWaitedReferenceSensor = 0;
		self.timeWaitedDevice = 0;
		self.emit('countdown', 'Moving to set point');

		for (let i = 0; i < self.deviceList.length; i++) 
		{
			self.deviceList[i].analogSamples = [];
			self.deviceList[i].samples = [];
			self.deviceList[i].sampleResults = '';
			self.deviceList[i].deviceStable = false;
			self.deviceList[i].sampleCounter = 0;
			self.deviceList[i].resetTimeouts();
		}	
		for (let i = 0; i < self.referenceList.length; i++) 
		{
			self.referenceList[i].analogSamples = [];
			self.referenceList[i].samples = [];
			self.referenceList[i].sampleResults = '';
			self.referenceList[i].deviceStable = false;
			self.referenceList[i].sampleCounter = 0;
			self.referenceList[i].resetTimeouts();
		}	
	};


	/**
 * runs data point at data point index
 * @param {number} dataPointIndex 
 */
	self.runDataPoint = function(dataPointIndex)
	{
		self.takingDataPoints = true;
		if (dataPointIndex < self.dataPointList.length)
		{
			self.logEvent(statusLevel.Info, '<BR>--------------------------------<BR>STARTING DATA POINT: ' + (dataPointIndex + 1) + '<BR>--------------------------------<BR>', false);
			self.emit('changingDataPoint', (dataPointIndex + 1));
			if(!self.calibrationStarted)
			{
				return;
			}
		
			//FILL
			self.fillCompleted = false;

			if(self.fillRequired(dataPointIndex) === true)
			{
				if(!self.fill())
				{
					self.endCalibration(false);
				}
			}
			else
			{
				self.fillCompleted = true;
			}

			//need to wait for the fill to complete before moving forward in the set point
			let fillInterval = setInterval(function()
			{
				if(self.fillCompleted === true)
				{
					clearInterval(fillInterval);

					//once fill is complete, then we can inject
					
					//INJECT
					setTimeout(function()
					{
						let pumpController = self.getRelayDataPointConfiguration(dataPointIndex);
						if(pumpController !== false && !isNaN(pumpController.pump) && !isNaN(pumpController.rate && !isNaN(pumpController.volume)))
						{
							self.timedRelay(pumpController.portName, pumpController.pump, pumpController.rate, pumpController.volume);
						}
						self.checkDevicesDoneSampling();
					}, 1000);
					//INJECT

					self.initDevicesAndReferences();
				}
			}, 100);
			//FILL

			self.emit('systemBusy', false);
		}
		else
		{
		// self.emit('calibrationEnded', true);
			self.logEvent(statusLevel.Info, 'CALIBRATION COMPLETE', false);
			self.endCalibration(true);
			if(self.valuesCalculatedAfter() === true)
			{
				self.programCoefficients();
			}
		}
	};




	self.GetCalibrationValues = function()
	{
		let parameters = {
			dostuff: 'GetCalibrationSystem',
			debug: String(self.debugFlag),
			computername: self.computerName

		};
		ProcessDatabaseRequest(parameters, function(data)
		{
			try 
			{
				if(isJson(data))
				{
					let systemInfo = JSON.parse(data);
					if(systemInfo.length > 0)
					{
						self.systemName = systemInfo[0].SystemName;
						self.emit('systemName', self.systemName);
						self.systemID = systemInfo[0].CalibrationSystemID;
						self.getCalibrationOptions(self.systemName);
					}
					else
					{
						self.emit('systemName', false);
					}
				}
			}
			catch(err)
			{
				self.onError(err);
			}
		});
	};


	self.openPort = function(portName, baudRate, commSettings, deviceID)
	{
		let parityBit = commSettings.substring(0, commSettings.indexOf(','));
		let dataBits = commSettings.substring(commSettings.indexOf(',') + 1, commSettings.indexOf(',') + 2);
		self.widgetCommunications.configurePort(portName, baudRate, dataBits, parityBit, 1);
		if(typeof deviceID !== 'undefined' && deviceID > -1)
		{
			self.deviceList[deviceID].portName = portName;
		}

	};
	
	self.sendConfigToDevices = function()
	{
		for(let i = 0; i < self.deviceList.length; i++)
		{
			if(self.deviceList[i].selected === true)
			{
				let test = 'Calibration Setup';
				self.logEvent(statusLevel.Info, 'Configuring devices for calibration', false);
				self.deviceList[i].beingConfigured = true;
				self.retrieveCommands(self.deviceList[i], test, self.processCommands);
			}
		}

		//TODO: Get these from the database?
		for(let i = 0; i < self.referenceList.length; i++)
		{
			let cmdList = [];
			//TODO: Need to change our start routine to be more database driven
			//TODO: These commands should come from the database somehow
			//TODO: The start command should also come from the database in a separate call
			if(self.referenceList[i].outStrForCalibration)
			{
				cmdList.push({Command: 'outstr=' + self.referenceList[i].outStrForCalibration});
			}
			cmdList.push({Command:'autorun=n'});
			cmdList.push({Command:'dataratehz=1'});
			cmdList.push({Command:'startnow'});
			self.referenceList[i].beingConfigured = true;
			self.processCommands(self.referenceList[i], cmdList);
		}

		let checkConfig = setInterval(function()
		{
			let configStillRunning = false;
			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].selected === true && self.deviceList[i].beingConfigured === true)
				{
					configStillRunning = true;
				}
			}

			for(let i = 0; i < self.referenceList.length; i++)
			{
				if(self.referenceList[i].beingConfigured === true)
				{
					configStillRunning = true;
				}
			}
			if(!configStillRunning)
			{
				clearInterval(checkConfig);
				self.currentDataPoint = 0;
		
				self.runDataPoint(self.currentDataPoint);
			}
		}, 200);


	};

	/**
	 * Iterates through all devices trying to discover them
	 * @param {function} callback - function to be called when discovery is complete
	 */
	self.discoverDevices = function()
	{
		try
		{

			//get just the selected devices
			let selectedDevices = self.deviceList.filter(function(device)
			{
				return device.selected === true;
			});

			if(selectedDevices.length === 0)
			{
				throw new RangeError('No devices selected');
			}

			//discover each device
			selectedDevices.forEach(function(selectedDevice)
			{
				self.logEvent(statusLevel.Info, 'Attempting to connect to device ' + (selectedDevice.index + 1), false);
				selectedDevice.autoConnectSettings = self.autoConnectSettings;
				selectedDevice.initializing = true;
				selectedDevice.discover();
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.checkStartCalibrationStatusCheck = function()
	{
		let checkStartCalibration = setInterval(function()
		{
			console.warn(self.calibrationStarted);
		}, 1000);
	};

	self.testError = function(message)
	{
		try
		{

			throw new Error(message);
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * For logging error messages
	 */
	self.onError = function(err)
	{
		let message = parseError(err);
		self.logEvent(statusLevel.Error, message.displayMessage, false);
	};

	/**
	 * Checks to make sure all sent status commands have been processed
	 * TODO: Need to figure out how to know which commands should have been sent
	 * TODO: Need to figure out which properties of the Device object to check based on commands sent
	 * @param {function} callback - function to be called when all devices have finished processing
	 */
	self.checkDeviceStatusProcessed = function(callback)
	{
		try
		{
			let deviceCheckCounter = 0; // for tracking timeout

			//periodically check to see if status messages have been processed
			let deviceCheck = setInterval(function()
			{

				//this is a timeout, set to 10 seconds (500 ms * 20 = 10 seconds)
				if(deviceCheckCounter >= 120)
				{
					clearInterval(deviceCheck);
					self.logEvent(statusLevel.Error, 'Timed out waiting for outstr to process', false);
					return;
				}

				//see if any devices are actually selected
				let selectedDevices = self.deviceList.filter(function(device)
				{
					return device.selected === true;
				});

				//if no devices are selected, we shouldn't even be here so this is an error
				if(selectedDevices.length === 0)
				{
					clearInterval(deviceCheck);
					self.logEvent(statusLevel.Error, 'No devices selected', false);
					return;
				}

				//check to see how many are processed
				let processedCount = 0;
				for(let i = 0; i < selectedDevices.length; i++)
				{
					//TODO: What if we don't send OUTSTR ?? Then this won't work
					//TODO: Need to figure out how to be certain that the device is parsed
					if(typeof selectedDevices[i].measurementTypes !== 'undefined' && typeof selectedDevices[i].outStrForCalibration !== 'undefined')
					{
						processedCount++;
					}
				}

				//if all selected devices have been processed, then we can move on
				if(processedCount === selectedDevices.length)
				{
					clearInterval(deviceCheck);
					if(callback && typeof callback === 'function')
					{
						callback();
					}
				}

				deviceCheckCounter++;
			}, 500);
		}
		catch(err)
		{
			self.onError(err);
		}
	};


	/**
	 * Lets the system know that settings have been changed and
	 * Updates the system settings object to reflect this
	 * 
	 * @param {object} device - one of the devices in the device list
	 * @param {string} baudRate - the baud rate changing to
	 * @param {string} setting - N,8    O,7    E,7
	 */
	self.connectionSettingsChanged = function(device, baudRate, settings)
	{
		try
		{
			if(!device || !baudRate || !settings)
			{
				throw new TypeError('Missing device, baud rate or settings');
			}

			if(settings.length !== 3 && settings.substring(1, 2) !== ',' )
			{
				throw new SyntaxError('Settings must be N,8   O,7   or   E,7   received ' + settings);
			}

			//change settings in the device object itself
			device.baudRate = baudRate;
			device.dataBits = settings.substring(2, 3);
			device.parityBit = settings.substring(0, 1);
	
			//change system settings
			self.configurationManager.saveConfiguration([{ConfigurationArea:'device', OptionIndex:device.index, ParameterIndex:-1, ItemName:'Baud', ItemValue:baudRate}]);
			self.configurationManager.saveConfiguration([{ConfigurationArea:'device', OptionIndex:device.index, ParameterIndex:-1, ItemName:'Settings', ItemValue:settings}]);
	
			self.emit('connectionSettingsChanged', {deviceID: device.index, baudRate: baudRate, settings: settings});
		}
		catch(err)
		{
			self.onError(err);
		}
	};


	self.sendCommand = function(portName, command, sendCrlf)
	{
		self.widgetCommunications.sendCommand(portName, command, sendCrlf);
	};

	self.convertToDeviceItem = function(itemName)
	{
		switch(itemName)
		{
		case 'device':
			return 'modelNumber';
		case 'baud':
			return 'baudRate';
		case 'port':
			return 'portName';
		case 'sn':
			return 'serialNumber';
		default:
			return itemName;	
		}
	};

	self.setUpDataPointList = function()
	{
		let dataPointList = [];
		let dataPoints = self.configurationManager.getConfigurationByArea('dataPoint');

		for(let i = 0; i < dataPoints.length; i++)
		{
			let optionIndex = dataPoints[i].OptionIndex;
			let parameterIndex = dataPoints[i].ParameterIndex;
			let itemName = dataPoints[i].ItemName;
			let itemValue = dataPoints[i].ItemValue;
			if(parseInt(optionIndex) >= dataPointList.length)
			{
				dataPointList.push({deviceList:[]});
			}
			if(parameterIndex > -1)
			{
				if(parameterIndex >= dataPointList[optionIndex].deviceList.length)
				{
					dataPointList[optionIndex].deviceList.push({});
				}
	
				dataPointList[optionIndex].deviceList[parameterIndex][itemName] = itemValue;
			}
			else
			{
				dataPointList[optionIndex][itemName] = itemValue;
			}

		}

		return dataPointList;
	};

	self.getMeasurementTypeID = function(measurand)
	{
		for(let i = 0; i < self.calibrationOptions.measurands.length; i++)
		{
			if(self.calibrationOptions.measurands[i].MeasurementType === measurand)
			{
				//return self.calibrationOptions.measurands[i].MeasurementSubTypeID;
				let measurementTypeID = self.calibrationOptions.measurands[i].MeasurementSubTypeID;
				return measurementTypeID;

			}
		}
	};

	self.setUpDeviceObject = function(deviceType)
	{
		
		let devList = self.configurationManager.getConfigurationByArea(deviceType);
		
		let deviceList = [];
		for(let i = 0; i < devList.length; i++)
		{
			let optionIndex = parseInt(devList[i].OptionIndex);
			let parameterIndex = parseInt(devList[i].ParameterIndex);
			let itemName = self.convertToDeviceItem(toCamelCase(devList[i].ItemName));
			let itemValue = devList[i].ItemValue;

			if(optionIndex >= deviceList.length)
			{
				//The reference object has more parameters so we'll use this for both references and controllers
				let newDevice = self.getNewDevice(i, deviceType.toLowerCase() === 'reference');

				deviceList.push(newDevice); 
			}

			//!This was removed 2020-01-06 (MHV)
			//!We decided to let references self-identify coefficients
			//!If they were able to do so
			//!This will need to be re-implemented with some adjustments
			//!Once we start using sensors such as the SBE3
			//!Which has no microprocessor and only outputs a frequency or voltage
			// if(parameterIndex > -1)
			// {
			// 	if(parameterIndex >= deviceList[optionIndex].measurandList.length)
			// 	{
			// 		deviceList[optionIndex].measurandList.push({});
			// 	}
			// 	deviceList[optionIndex].measurandList[parameterIndex][itemName] = self.processCoefficients(itemName, itemValue);

			// 	if(itemName === 'measurand')
			// 	{
			// 		deviceList[optionIndex].measurandList[parameterIndex].MeasurementTypeID = self.getMeasurementTypeID(itemValue);
			// 	}
			// }

			if(parameterIndex === -1)
			{
				deviceList[optionIndex][itemName] = itemValue;
				if(itemName === 'settings')
				{
					deviceList[optionIndex].dataBits = itemValue.substring(itemValue.indexOf(',') + 1).trim();
					deviceList[optionIndex].parityBit = itemValue.substring(0, 1);
				}
			}
		}

		return deviceList;
	};

	/**
	 * Takes any coefficient text and converts it to an object
	 * If an item is passed in that is not a coefficient, it just passes through
	 * If an item is passed in that IS a coefficient, then it is converted to an object
	 * Example data: 'slope = 1.234\nintercept = 2.345
	 * @param {string} itemName - the name of the item from the dialog. 
	 * @param {string} itemValue - the value of the item from the dialog.
	 */
	self.processCoefficients = function(itemName, itemValue)
	{
		try
		{
			if(!itemName || !itemValue)
			{
				throw new TypeError('item name and/or item value cannot be blank');
			}
			
			//check to see if the itemName is actually coefficients
			if(itemName.toLowerCase() === 'coefficients')
			{
				//check to see if they've not been set EG: "Not Set" which is the default
				if(itemValue.toLowerCase() === 'not set' || itemValue.indexOf('=') === -1)
				{
					return;
				}

				//first split on new lines
				let coeffList = itemValue.split('\n');
				let coefficients = {};	

				coeffList.forEach(function(coefficient)
				{
					//then split on equals
					let coeff = coefficient.split('=');


					if(!coeff[0].trim())
					{
						throw new SyntaxError('missing coefficient name information');
					}

					if(coeff.length < 2)
					{
						throw new SyntaxError('could not find coefficient value for ' + coeff[0].trim());
					}
					if(isNaN(coeff[1].trim()))
					{
						throw new SyntaxError('coefficient ' + coeff[0].trim() + ' is not a number: ' + coeff[1].trim());
					}
					
					//!This is one potential way to handle the coefficients. We chose the other way
					//coefficients.push({itemName:coeff[0].trim(), itemValue:coeff[1].trim()});
					coefficients[coeff[0].toLowerCase().trim()] = coeff[1].trim();
				});
	
				return coefficients;
			}
	
			return itemValue;
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Gets the model number ID based on the model number passed in.
	 * @param {string} modelNumber - Model number that is stored in the database
	 * @returns {int} - model number ID from the database
	 */
	self.getModelID = function(modelNumber)
	{
		let oneRecord = self.calibrationOptions['modelNumbers'].filter(function(item)
		{
			return item.ModelNumber.replace(' ', '') == modelNumber && parseInt(item.canBeCalibrated) === 1;
		});
		if(oneRecord.length > 0)
		{
			return oneRecord[0].ModelNumberID;
		}
		return -1;
	};

	/**
	 * Checks to see if a port is in use by some other part of the program
	 * This way we don't assign the same port to multiple devices
	 * 
	 * @param {string} configurationArea - the configuration area in which the item checking the port exists
	 * @param {integer} optionIndex - the index of the configuration. This way we don't check the item itself
	 * @param {string} portName - the port in question
	 * @returns {boolean} is the port in use?
	 */
	self.portInUse = function(configurationArea, optionIndex, portName)
	{
		try
		{
			if(!configurationArea || !portName || isNaN(optionIndex) || isNaN(parseInt(optionIndex)))
			{
				self.logEvent(statusLevel.Error, 'portInUse: Missing parameter, must provide configuration area, option index and port name');
				return null;
			}
			//this is not an error condition. We want users to be able to select Not Set
			if(portName.toLowerCase() === 'not set')
			{
				return false;
			}
	
			//Look through the settings to see if the port is already listed
			//TODO: Possibly move this check into the configurationManager, but I'm not sure what that would look like
			for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
			{
				let item = self.configurationManager.configurationSettings[i];
				if(item.ItemName === 'Port' && item.ItemValue.toLowerCase() !== 'not set')
				{
					if(item.ItemValue === portName)
					{
						if(item.ConfigurationArea !== configurationArea || (item.ConfigurationArea === configurationArea && parseInt(item.OptionIndex) !== parseInt(optionIndex)))
						{
							return true;
						}
					}
				}
			}
			return false;
	
		}
		catch(err)
		{
			self.onError(err);
			return null;
		}
	};

	//TODO: Need to combine reference and device list creation so we don't have duplication of code
	self.setUpDeviceList = function(numberDevices)
	{
		if(numberDevices > self.deviceList.length)
		{
			for(let i = self.deviceList.length; i < numberDevices; i++)
			{
				let newDevice = self.getNewDevice(i, false);

				self.deviceList.push(newDevice);
			}
		}

		if(numberDevices < self.deviceList.length)
		{
			for(let i = self.deviceList.length; i > numberDevices; i--)
			{
				self.deviceList.pop();
			}
		}

		self.maxDevices = numberDevices;
		self.emit('maxDevicesChanged', numberDevices);

		let deviceSettings = self.configurationManager.getConfigurationByArea('device');

		deviceSettings.forEach(function(setting)
		{
			if(setting.OptionIndex < self.deviceList.length)
			{
				//TODO: Database columns should match what is stored in the database, that would remove the need for this switch statement
				switch(setting.ItemName)
				{
				case 'Select':
					self.deviceList[setting.OptionIndex].selected = setting.ItemValue === '1' || setting.ItemValue === 1;
					break;
				case 'Port':
					self.deviceList[setting.OptionIndex].portName = setting.ItemValue;
					break;
				case 'Device':
					self.deviceList[setting.OptionIndex].modelNumber = setting.ItemValue;
					self.deviceList[setting.OptionIndex].deviceType = setting.ItemValue;
					break;
				case 'SN':
					self.deviceList[setting.OptionIndex].serialNumber = setting.ItemValue;
					break;
				case 'Firmware':
					self.deviceList[setting.OptionIndex].firmwareVersion = setting.ItemValue;
					break;
				case 'ID':
					// Not being used yet
					break;
				case 'Baud':
					self.deviceList[setting.OptionIndex].baudRate = setting.ItemValue;
					break;
				case 'Settings':
					self.deviceList[setting.OptionIndex].parityBit = setting.ItemValue.substring(0, 1);
					self.deviceList[setting.OptionIndex].dataBits = setting.ItemValue.substring(2, 3); 
					break;
				case 'Format':
					self.deviceList[setting.OptionIndex].format = setting.ItemValue;
					break;
				default:
				}
			}
		});

	};

	self.setDevicePort = function(deviceID, portName)
	{
		if(self.deviceList.length > deviceID)
		{
			self.deviceList[deviceID].portName = portName;
		}
	};

	self.getSystemLocations = function()
	{
		let systemLocations = [];
		for(let i = 0; i < self.calibrationOptions.locations.length; i++)
		{
			systemLocations.push(self.calibrationOptions.locations[i].CalibrationLocation);
		}
		systemLocations.splice(0, 0, 'Not Set');
		return systemLocations;
	};

	//!This is very ECO / SNTL specific. Refactor to support other products
	self.getMeasurandFromSubType = function(subType)
	{
		for(let i = 0; i < self.calibrationOptions.measurands.length; i++)
		{
			let measurand = self.calibrationOptions.measurands[i];
			if(measurand.MeasurementSubType === subType)
			{
				return measurand.MeasurementType;
			}
		}
		return null;
	};

	self.getMeasurands = function()
	{
		let measurands = [];
		for(let i = 0; i < self.calibrationOptions.measurands.length; i++)
		{
			let measurementType = self.calibrationOptions.measurands[i].MeasurementType;
			if(measurands.indexOf(measurementType) === -1)
			{
				measurands.push(measurementType);
			}
		}
		measurands.sort();
		measurands.splice(0, 0, 'Not Set');
		return measurands;
	};

	self.getMeasurandSubTypes = function(measurand)
	{
		let subTypes = [];
		for(let i = 0; i < self.calibrationOptions.measurands.length; i++)
		{
			let measurementType = self.calibrationOptions.measurands[i].MeasurementType;
			if(measurand === measurementType)
			{
				let subType = self.calibrationOptions.measurands[i].MeasurementSubType;
				if(subTypes.indexOf(subType) === -1)
				{
					subTypes.push(subType);
				}
			}
		}

		subTypes.sort();
		subTypes.splice(0, 0, 'Not Set');
		return subTypes;
	};

	self.getCalibrationOptions = function(sysName)
	{
		let parameters = {
			debug: String(self.debugFlag), 
			dostuff:'getCalibrationOptions', 
			systemName:sysName
		};
		ProcessDatabaseRequest(parameters, function(data)
		{
			self.calibrationOptions = JSON.parse(data);
			self.emit('optionsRetrieved', 'null');
		});
	};
	/**
	 * Gets measurement types and subtypes with their associated Coefficient of Variation values (COV)
	 * Example URL:  http://localhost/sbGlobal/sbDatabaseFunctions_V2.php?dostuff=GetCalibrationDeviceTypes
	 */
	self.getDeviceTypesWithCOV = function()
	{
		let parameters = {
			debug: String(self.debugFlag),
			dostuff: 'GetCalibrationDeviceTypes'
		};

		ProcessDatabaseRequest_V2(parameters, function(data)
		{
			//console.log( JSON.parse(data));
			self.emit('updateStatus', 'Loading Coefficients', JSON.parse(data));

			self.measurandCOV = JSON.parse(data);
		});
		//return results;
	}

	self.getBaudRates = function()
	{
		return self.getCalibrationOptionList('baudRates', 'baudrate');
	};

	self.getSnForDataPoints = function(deviceType, modelNumber)
	{
		let sns = [];
		if(deviceType && modelNumber !== 'Not Set')
		{
			let ConfigurationArea = 'reference';
			if(deviceType.toLowerCase() === 'system')
			{
				ConfigurationArea = 'control';
			}

			let modelLocations = [];
			for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
			{
				if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea && self.configurationManager.configurationSettings[i].ItemName === 'Device' && self.configurationManager.configurationSettings[i].ItemValue === modelNumber)
				{
					let location = {OptionIndex:self.configurationManager.configurationSettings[i].OptionIndex, ParameterIndex: self.configurationManager.configurationSettings[i].ParameterIndex};
					modelLocations.push(location);
				}
			}

			for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
			{
				for(let j = 0; j < modelLocations.length; j++)
				{
					if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea 
						&& self.configurationManager.configurationSettings[i].ItemName === 'SN' 
						&& self.configurationManager.configurationSettings[i].OptionIndex === modelLocations[j].OptionIndex
						&& self.configurationManager.configurationSettings[i].ParameterIndex === modelLocations[j].ParameterIndex)
					{
						sns.push(self.configurationManager.configurationSettings[i].ItemValue);
					}
				}
			}
			sns.sort();
			sns.splice(0, 0, 'Not Set');
		}
		return sns;
	};

	self.getModelsForDataPoints = function(devicePurpose)
	{
		if(devicePurpose && devicePurpose.toLowerCase() !== 'reference' && devicePurpose.toLowerCase() !== 'system')
		{
			throw new TypeError('Device Purpose must be "reference" or "system", you passed in ' + devicePurpose);
		}

		let modelNames = [];
		if(self.configurationManager.configurationSettings)
		{
			let ConfigurationArea = 'reference';
			if(devicePurpose.toLowerCase() === 'system')
			{
				ConfigurationArea = 'control';
			}
			for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
			{
				if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea && self.configurationManager.configurationSettings[i].ItemName === 'Device')
				{
					if(modelNames.indexOf(self.configurationManager.configurationSettings[i].ItemValue) === -1)
					{
						modelNames.push(self.configurationManager.configurationSettings[i].ItemValue);
					}
				}
			}
			modelNames.sort();
			modelNames.splice(0, 0, 'Not Set');

		}
		return modelNames;
	};

	self.getDeviceMeasurands = function(modelNumber)
	{
		let measurands = [];
		self.calibrationOptions.measurementTypeByModel.forEach(function(measurementType)
		{
			if(measurementType.ModelNumber.replace(' ', '') === modelNumber.replace(' ', ''))
			{
				let measurand = {
					measurand: measurementType.MeasurementType,
					measurementTypeID: measurementType.MeasurementSubTypeID
				};

				measurands.push(measurand);
			}
		});
		return measurands;
	};

	/**
	 * Takes the model list and give just the desired model names
	 * @param {enum} devicePurpose - deviceTypes enum value
	 * @returns {Array} list of model numbers
	 */
	self.getJustModelNames = function(devicePurpose, allModels)
	{
	
		let modelNames = [];

		if(self.calibrationOptions)
		{
			let modelType = 'modelNumbers';
			if(allModels === true)
			{
				modelType = 'allModels';
			}

			for(let i = 0; i < self.calibrationOptions[modelType].length; i++)
			{
				if(self.isModelCorrectForPurpose(self.calibrationOptions[modelType][i], devicePurpose) 
				&& modelNames.indexOf(self.calibrationOptions[modelType][i].ModelNumber.replace(/\s/g, '')) === -1)
				{
					modelNames.push(self.calibrationOptions[modelType][i].ModelNumber.replace(/\s/g, ''));
				}
			}
			modelNames.sort();
			modelNames.splice(0, 0, 'Not Set');
		}
		return modelNames;
	};

	self.isModelCorrectForPurpose = function(modelInfo, devicePurpose)
	{
		switch(devicePurpose)
		{
		case deviceTypes.Device:
			return parseInt(modelInfo.canBeCalibrated) === 1;
		case deviceTypes.Reference:
			return parseInt(modelInfo.canBeReference) === 1;
		case deviceTypes.Control:
			return parseInt(modelInfo.canBeSystemController) === 1;
		}
		return true;
	};

	self.getCalibrationOptionList = function(optionName, optionSubName)
	{
		let returnValues = [];
		if(self.calibrationOptions)
		{
			for(let i = 0; i < self.calibrationOptions[optionName].length; i++)
			{
				returnValues.push(self.calibrationOptions[optionName][i][optionSubName]);
			}
			returnValues.sort();
			returnValues.splice(0, 0, 'Not Set');
		}
		return returnValues;
		
	};

	self.getMeasurandSubTypesForDataPoints = function(modelNumber, serialNumber, measurand)
	{
		let optionIndex = self.lookUpDevice('reference', modelNumber, serialNumber);
		if(optionIndex > -1)
		{
			let measurands = self.configurationManager.configurationSettings.filter(function(item)
			{
				return parseInt(item.OptionIndex) === parseInt(optionIndex) 
				&& item.ItemName === 'Measurand' 
				&& item.ItemValue === measurand
				&& item.ConfigurationArea === 'reference';
			});

			let subTypes = [];
			for(let i = 0; i < measurands.length; i++)
			{
				let parameterIndex = parseInt(measurands[i].ParameterIndex);
				let subTypeFilter = self.configurationManager.configurationSettings.filter(function(item)
				{
					return parseInt(item.OptionIndex) === parseInt(optionIndex)
					&& item.ItemName === 'Measurand Sub-Type'
					&& item.ConfigurationArea === 'reference'
					&& parseInt(item.ParameterIndex) === parseInt(parameterIndex)
					&& item.ItemValue !== 'Not Set';
				});

				if(subTypeFilter.length > 0)
				{
					if(subTypes.indexOf(subTypeFilter[0].ItemValue) === -1)
					{
						subTypes.push(subTypeFilter[0].ItemValue);
					}
				}

			}
			subTypes.sort();
			subTypes.splice(0, 0, 'Not Set');
			return subTypes;
		}
		return 'Not Set';
	};

	self.getMeasurandsForDataPoints = function(deviceType, modelNumber, serialNumber)
	{
		if(deviceType && modelNumber && serialNumber)
		{
			return self.lookUpMeasurands(deviceType, modelNumber, serialNumber);
		}
		return 'Not Set';
	};

	self.lookUpMeasurands = function(deviceType, modelNumber, serialNumber)
	{
		let measurands = [];
		let ConfigurationArea = deviceType.toLowerCase();
		if(ConfigurationArea === 'system')
		{
			ConfigurationArea = 'control';
		}

		let OptionIndex = self.lookUpDevice(ConfigurationArea, modelNumber, serialNumber);

		for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
		{
			if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea 
				&& self.configurationManager.configurationSettings[i].ItemName === 'Measurand'
				&& self.configurationManager.configurationSettings[i].OptionIndex === OptionIndex)
			{
				if(measurands.indexOf(self.configurationManager.configurationSettings[i].ItemValue) === -1)
				{
					measurands.push(self.configurationManager.configurationSettings[i].ItemValue);
				}
			}
		}

		measurands.sort();
		measurands.splice(0, 0, 'Not Set');
		
		return measurands;
	};

	self.lookUpDevice = function(ConfigurationArea, modelNumber, serialNumber)
	{
		let configItems = [];
		for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
		{
			if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea 
				&& self.configurationManager.configurationSettings[i].ItemName === 'Device' 
				&& self.configurationManager.configurationSettings[i].ItemValue === modelNumber)
			{
				configItems.push(self.configurationManager.configurationSettings[i].OptionIndex);
			}
		}

		for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
		{
			if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea 
				&& self.configurationManager.configurationSettings[i].ItemName === 'SN' 
				&& self.configurationManager.configurationSettings[i].ItemValue === serialNumber)
			{
				return self.configurationManager.configurationSettings[i].OptionIndex;
			}
		}

		return -1;
	};

	self.lookUpOption = function(ConfigurationArea, OptionIndex, ParameterIndex)
	{
		let option = [];
		// console.log(ParameterIndex);
		for(let i = 0; i < self.configurationManager.configurationSettings.length; i++)
		{
			if(self.configurationManager.configurationSettings[i].ConfigurationArea === ConfigurationArea 
				&& parseInt(self.configurationManager.configurationSettings[i].OptionIndex) === parseInt(OptionIndex) 
				&& parseInt(self.configurationManager.configurationSettings[i].ParameterIndex) === parseInt(ParameterIndex))
			{
				option.push(self.configurationManager.configurationSettings[i]);
			}
		}

		return option;
	};

	self.getMaxDevices = function()
	{
		let devicesList = self.configurationManager.getConfigurationByParameters('system', 'Number of Devices to Calibrate');
		if(devicesList.length === 0)
		{
			return -1;
		}
		let maxDevices = devicesList[0].ItemValue;
		return maxDevices;

	};

	self.getCurrentLocationID = function()
	{
		let systemLocationList = self.configurationManager.getConfigurationByParameters('system', 'Calibration System Location');
		if(systemLocationList.length === 0)
		{
			return -1;
		}
		let systemLocation = systemLocationList[0].ItemValue;

		let systemLocationIDFinder = self.calibrationOptions.locations.filter(function(item)
		{
			return item.CalibrationLocation === systemLocation;
		});
		if(systemLocationIDFinder.length === 0)
		{
			return -1;
		}
		return systemLocationIDFinder[0].CalibrationLocationID;
	};

	self.getCurrentSystemTypeID = function()
	{
		let systemTypeList = self.configurationManager.getConfigurationByParameters('system', 'Calibration System Type');
		if(systemTypeList.length === 0)
		{
			return -1;
		}
		let systemType = systemTypeList[0].ItemValue;

		let systemTypeIDFinder = self.calibrationOptions.systemTypes.filter(function(item)
		{
			return item.CalibrationSystemType === systemType;
		});
		if(systemTypeIDFinder.length === 0)
		{
			return -1;
		}
		return systemTypeIDFinder[0].CalibrationSystemTypeID;
	};

	self.getSystemTypes = function()
	{
		return self.getCalibrationOptionList('systemTypes', 'CalibrationSystemType');
	};
	
	self.getCalibrationLocations = function()
	{
		return self.getCalibrationOptionList('locations', 'CalibrationLocation');
	};

	self.recallConfigurationSettings = function()
	{
		self.configurationManager.getConfigurationAreas();
		self.configurationManager.getConfigurationSettings(self.systemID, self.configurationManager.currentConfiguration, self.updateSettings);
	};


	self.closePort = function(portName, deviceID)
	{
		self.widgetCommunications.closePort(portName);
		self.emit('portClosed', {deviceID:deviceID});
	};

	self.wakeDevice = function(index)
	{
		self.widgetCommunications.wakeDevice(self.deviceList[index].portName);
	};

	/**
	 * Let the serial widget know about device changes
	 * @param {int} deviceID 
	 * @param {string} portName 
	 * @param {string} modelNumber 
	 * @param {string} serialNumber 
	 * @param {bool} reference //is this device 
	 */
	self.setDeviceType = function(deviceID, portName, modelNumber, serialNumber, reference)
	{
		if(portName !== 'Not Set' && modelNumber !== 'Not Set' && serialNumber != 'Not Set')
		{
			self.widgetCommunications.notifyDeviceType(portName, modelNumber, serialNumber, deviceID + 1, reference);
		}
	
	};

	self.getNewDevice = function(index, reference)
	{
		let device = new Device();
		device.isReference = reference;

		device.timeOutDelay = 12000; //covers the five second sample interval
		device.index = index;
		device.sampleWindow = self.sampleWindowSize;

		device.on('connected', function(data)
		{
			if(data === true)
			{
				if(device.isReference === false)
				{
					self.processDeviceDiscovered(device);
				}
				self.stopDevice(device);

			}
			if(data === false)
			{
				if(device.isReference === false)
				{
					self.logEvent(statusLevel.Error, 'Auto-discover device ' + (device.index + 1) + ': Unable to determine connection settings.', false);
				}
				self.endCalibration(false);
			}
		});

		device.on('requestSendCommand', function(data)
		{

			self.widgetCommunications.sendCommand(data.portName, data.command, true);
		});

		device.on('commandsSent', function()
		{
			device.commandList = [];

			if(device.doingStatus === true)
			{
				self.logEvent(statusLevel.Success, 'Retrieved status for ' + device.modelNumber + '-' + device.serialNumber, false);
				device.doingStatus = false;
				device.initializing = false;
				self.tryRunCalibration();
			}
			else if(device.doingStatus === false)
			{
				console.log('sent commands, should be logging');
			}

			if(device.isReference === true && self.runningReference === true)
			{
				self.logEvent(statusLevel.Success, 'Reference started successfully ' + device.modelNumber + '-' + device.serialNumber, false);
				device.running = true;
				device.buffer = '';
			};


		});

		device.on('dataError', function(data)
		{
			self.logEvent(statusLevel.Error, 'Data Error on ' + device.modelNumber + '-' + device.serialNumber + ': ' + data.errorType + ' ' + data.buffer, false);
		});

		device.on('stopped', function()
		{
			let msg = 'Stopped ';
			if(device.isReference === true)
			{
				msg += ' Reference ';
			}
			msg += device.modelNumber + '-' + device.serialNumber;
			self.logEvent(statusLevel.Success, msg, false);
			if(self.calibrationStarted === true)
			{
				self.logEvent(statusLevel.Info, 'Getting status for ' + device.modelNumber + '-' + device.serialNumber, false);
				self.getStatus(device);
			}
			if(device.isReference === true && self.runningReference === true)
			{
				device.commandList = ['sampleinterval=5', 'startnow'];
				self.logEvent(statusLevel.Info, 'Running reference ' + device.modelNumber + '-' + device.serialNumber, false);
				device.processCommand(0);
			}
			
		});

		/**
		 * When device information changes
		 * @param {object} data // contains model number, serial number, firmware version and index for the device
		 */
		device.on('hardwareDataUpdated', function(data)
		{
			if(device.isReference === false)
			{
				self.saveDeviceSettings({optionName:'Device', optionValue:data.modelNumber, id:data.index});
				self.saveDeviceSettings({optionName:'SN', optionValue:data.serialNumber, id:data.index});
				self.saveDeviceSettings({optionName:'Firmware', optionValue:data.firmwareVersion, id:data.index});
			}
			self.setDeviceType(data.index, data.portName, data.modelNumber, data.serialNumber, device.isReference);
			device.measurementTypes = self.getDeviceMeasurands(data.modelNumber);
		});

		if(device.isReference === false)
		{
			device.on('connectionSettingsChanged', function(data)
			{
				//notify the program about it
				self.connectionSettingsChanged(device, data.baudRate, data.parityBit + ',' + data.dataBits);
				
				//send off to the serial port
				self.openPort(data.port, data.baudRate, data.parityBit + ',' + data.dataBits);

			});
	
			device.on('dataReceived', function(data)
			{
				if(device.isReference === false)
				{
					self.emit('dataReceived', {index: device.index, data: data});
				}
			});

		}

		device.on('parsedGetOt', function(data)
		{
			if(device.isReference === true)
			{
				let parameters = [];
				data.forEach(function(oneData)
				{

					parameters.push(oneData.id);

				});
				self.emit('referenceParametersChanged', parameters);
			}
		});

		device.on('timedOut', function(data)
		{
			if(device.doingStatus === true)
			{
				device.doingStatus = false;
				self.logEvent(statusLevel.Error, 'Timed out getting status from device ' + (device.index + 1), false);
				self.endCalibration(false);
			}
		});

		device.on('requestWakeDevice', function(data)
		{
			self.widgetCommunications.wakeDevice(data);
		});

		device.on('sampleReady', function(data)
		{
			device.stable = self.deviceStable(data) && device.sampleCounter >= parseInt(self.sampleWindowSize);

			{
				self.emit('deviceInfo', {deviceID:device.index, Stable:device.stable});
			}

			if(device.isReference === true)
			{
				for(let i = 0; i < data.length; i++)
				{

					//TODO: This is for ECOV2 only, need to implement this for other products
					//this filters on only keys that contain the substring 'gain' to prevent out of index errors or null data points
					if(data[i].key.toLowerCase().includes('gain'))
					{					
						//50k counts on HiGain is when to transition from HiGain to LoGain (amplified to non-amplified)
						let hiLoTransitionPoint = 50000;
						let results = {};
						if(data[i].averageRaw < hiLoTransitionPoint && data[i].key === 'HiGain')
						{
							results = 
							{
								parameter: data[i].id,
								units: data[i].uom,
								converted: data[i].lastSampleConverted,
								cov: data[i].covMedianConverted,
								raw: data[i].lastSampleRaw,
								stable: device.stable,
								key: data[i].key
							};
							self.emit('referenceUpdate', results);
						}
						if(data[i].averageRaw > hiLoTransitionPoint && data[i].key === 'HiGain')
						{
							results = 
							{
								parameter: data[i].id,
								units: data[i].uom,
								converted: data[i].lastSampleConverted,
								cov: data[i].covMedianConverted,
								raw: data[i].lastSampleRaw,
								stable: device.stable,
								key: data[i].key
							};
							self.emit('referenceUpdate', results);
						}						
					}
				}
			}
		});

		device.on('outStrProcessed', function()
		{
		});

		device.on('error', function(err)
		{
			if(device.isReference === true)
			{
				self.endCalibration(false);
			}
			self.onError(err);
		});


		return device;
	};

	self.checkDevicesDoneSampling = function()
	{
		let sampleInterval = setInterval(function()
		{
			try
			{
				let devicesStable = true;
				let referencesStable = true;
				
	
				self.timeAtDataPoint += 500;
				for(let i = 0; i < self.deviceList.length; i++)
				{
					if(self.deviceList[i].selected === true && self.deviceList[i].stable === false)
					{
						devicesStable = false;
					}
				};
	
				for(let j = 0; j < self.referenceList.length; j++)
				{
					
					if(self.referenceList[j].stable === false)
					{
						referencesStable = false;
					}
				};
	
				if(devicesStable === true && referencesStable === true)
				{
					let remaining = parseInt(self.additionalWaitTimeOnceStable) - parseInt(self.timeWaitedOnceStable);
					if(remaining < 0)
					{
						remaining = 0;
					}
					remaining = remaining / 1000;
					self.emit('countdown', remaining + ' seconds');
					//additional wait time at data point once stable
					if(self.timeWaitedOnceStable >= self.additionalWaitTimeOnceStable)
					{
	
						clearInterval(sampleInterval);
						self.saveDataPoint();

						//DRAIN
						if(self.drainRequired(self.currentDataPoint) === true)
						{
							if(!self.drain())
							{
								self.endCalibration(false);
							}
						}
						else
						{
							self.drainCompleted = true;
						}

						//DRAIN

					}
					self.timeWaitedOnceStable += 500;
				}
				else
				{
					self.emit('countdown', 'Not Stable');
				}
	
				//if the devices don't stabilize, then the point needs to time out
				//This needs to be greater than:
				//additional wait time + (sample interval * sample window)
				if(devicesStable === false && referencesStable === false && self.timeAtDataPoint >= self.dataPointTimeout)
				{
					self.logEvent(statusLevel.Error, 'Time out at data point', false);
					self.emit('countdown', 'Timed Out');
					clearInterval(sampleInterval);
					self.saveDataPoint();

				};

	
			}
			catch(err)
			{
				self.onError(err);
			}

		}, 500);
	};

	self.deviceStable = function(sample)
	{
		if(parseInt(sample[0].sampleCount) >= parseInt(self.sampleWindowSize))
		{
			let currentMeasurandSubType = calRun.dataPointList[calRun.currentDataPoint].deviceList[0]["Measurand Sub-Type"];

			let stabilitySpec = self.referenceList[0].measurands.filter(a => a.id == currentMeasurandSubType)[0].cov;

			let allStable = true;

			for(let i = 0; i < sample.length; i++)
			{
				if(sample[i].key.toLowerCase().includes('gain'))
				{
					//50k counts on HiGain is when to transition from HiGain to LoGain (amplified to non-amplified)
					let hiLoTransitionPoint = 50000;
					let cov = sample[i].covMedian;
					if(sample[i].covConverted !== null)
					{
						if(sample[i].averageRaw < hiLoTransitionPoint && sample[i].key === 'HiGain')
						{
							cov = sample[i].covConverted;
						}

						if(sample[i].averageConverted > hiLoTransitionPoint && sample[i].key === 'LoGain')
						{
							cov = sample[i].covConverted;
						}
					}
					//if(Math.abs(cov) > stabilitySpec.coefficientOfVariation)
					if(Math.abs(cov) > stabilitySpec)
					{
						allStable = false;
					}	
				}
			}
			return allStable;
		}
		return false;
	};
	
	self.getDeviceStatusByIndex = function(index)
	{
		self.getStatus(self.deviceList[index]);
	};

	self.getStatus = function(device)
	{
		if(device.doingStatus === false)
		{
			device.doingStatus = true;
			device.ignoreErrors = false;

			//TODO: Need to change to just get HD or DS and not this whole list of things
			device.commandList.push('gethd', 'getot', 'outstr', 'getdarkcounts');
			if(device.isReference === true)
			{
				device.commandList.push('getcc');
			}

			device.processCommand(0);
		}
	};


	/**
	 * For logging anything that happens except communications
	 * @param {statusLevel} loggingLevel - must be of the statusLevel object
	 * @param {object} message - {message: 'some text', className: 'some class', methodName: 'some method', lineNumber: 1234}
	 * @param {boolean} consoleOnly - Should this be only displayed in the console?
	 */
	self.logEvent = function(loggingLevel, message, consoleOnly)
	{
		let msg = message;
		if(msg.errorType)
		{
			msg = message.displayMessage;
		}
		if(message.message)
		{
			msg = message.message;
		}

		if(loggingLevel === statusLevel.Error)
		{
			self.errorCount++;
		}

		self.emit('eventOccurred', {message: msg, level: loggingLevel, consoleOnly: consoleOnly});
		
		if(typeof self.widgetCommunications !== 'undefined')
		{
			if(loggingLevel === statusLevel.Success || loggingLevel === statusLevel.Info)
			{
				self.widgetCommunications.logSystem(self.systemName, msg);
			}

			if(loggingLevel !== statusLevel.Success)
			{
				self.widgetCommunications.logEvent(loggingLevel, message.className, message.methodName, msg);
			}
		}
	};


	self.updateSystemName = function(newName)
	{
		let sysName = newName;
		let newSystemName = sysName.replace('\n', '');
		if(!newSystemName)
		{
			self.emit('systemName', self.systemName);
			return;
		}
		self.setCalibrationSystem(newSystemName);
	};

	/**
	 * When a user changs the system name on the screen, this is what updates the database
	 * Also gets the systemID and configurationID
	 * @param {string} sysName 
	 */
	self.setCalibrationSystem = function(sysName)
	{
		let parameters = {
			dostuff: 'SetCalibrationSystem',
			debug: String(self.debugFlag),
			systemname: sysName,
			systemTypeID: self.getCurrentSystemTypeID(),
			systemLocationID: self.getCurrentLocationID(),
			maxDevices: self.getMaxDevices(),
			computername: self.computerName
		};
		ProcessDatabaseRequest(parameters, function(data)
		{
			if(data.indexOf('System already in use') > -1)
			{
				self.logEvent(statusLevel.Error, data.replace('"', '').replace('"', ''), false);
			}
			else
			{
				// console.log(data);
				let systemUpdate = JSON.parse(data);
				self.systemID = systemUpdate.systemID;
				self.configurationID = systemUpdate.configurationID;
				self.systemName = sysName;
			}
			self.emit('systemName', self.systemName);

		});
	};


	/**
	 * Saves changes to device settings
	 * 
	 * @param {object} parameters - parameters in the format of {id:xxxx, optionName:yyyy, optionValue:zzzz [deviceID:aaaa]}
	 * 
	 */
	self.saveDeviceSettings = function(parameters)
	{
		try
		{
			if(!parameters)
			{
				self.logEvent(statusLevel.Error, 'saveDeviceSettings: No parameters passed in', false);
				return false;
			}
			let expectedKeys = ['id', 'optionName', 'optionValue'];
			for(let i = 0; i < expectedKeys.length; i++)
			{
				if(!parameters.hasOwnProperty(expectedKeys[i]))
				{
					self.logEvent(statusLevel.Error, 'saveDeviceSettings: parameter missing property ' + expectedKeys[i]);
					return false;
				}
			}
			
			let deviceSettings = 
			[{
				ConfigurationArea: 'device',
				OptionIndex: parameters.id,
				ParameterIndex: -1,
				ItemName: parameters.optionName,
				ItemValue: parameters.optionValue
			}];
			if(parameters.hasOwnProperty('id'))
			{
				deviceSettings.OptionIndex = parameters.id;
				parameters.deviceID = parameters.id;
			}
			else if(parameters.hasOwnProperty('deviceID'))
			{
				deviceSettings.OptionIndex = parameters.deviceID;
			}
	
			self.emit('deviceSettingChanged', parameters);
			self.configurationManager.saveConfiguration(deviceSettings, self.updateSettings);
	
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}

	};

	/**
	 * For updating the calRun settings objects
	 * @param {object} data - this is the result coming back from the database. Not really useful except to make sure the database was updated
	 */
	self.updateSettings = function(data)
	{
		//what if data is an empty array? This means saving didn't work
		//An error should already have been triggered at that point
		if(self.calibrationStarted === false)
		{

			self.referenceList = self.setUpDeviceObject('reference');
			self.controlList = self.setUpDeviceObject('control');
			self.dataPointList = self.setUpDataPointList();
	
			self.updateModelNumberList();
			self.updateDeviceList();
			self.setSampleWindowSize();
		}

	};

	/**
	 * pulls the sample window size out of the settings
	 */
	self.setSampleWindowSize = function()
	{
		try
		{
			let swItems = self.configurationManager.getConfigurationByParameters('system', 'Samples to average');

			//if the sample window size has not been set, use the default.
			if(swItems.length === 0)
			{
				self.sampleWindowSize = self.defaultSampleWindowSize;
				return true;
			}
			let swSize = parseInt(swItems[0].ItemValue);
			//can't be NaN and can't be less than one. No way to do a cal on -1 samples or even zero samples
			if(swItems.length > 0 && String(swItems[0].ItemValue).toLowerCase() !== 'not set')
			{
				if(isNaN(swSize) || swSize < 1)
				{
					self.logEvent(statusLevel.Error, 'setSampleWindowSize: Samples to average is not valid, must be a positive integer greater than zero, value entered is ' + swItems[0].ItemValue);
					return false;
				}
				self.sampleWindowSize = Number(swItems[0].ItemValue);
			}
			return true;
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};

	/**
	 * To be used after the configuration settings have been saved. Updates the system with the correct number of devices in the device list
	 * 
	 */
	self.updateDeviceList = function()
	{
		try
		{
			//get the number of devices to be calibrated
			let numDevices = self.configurationManager.getConfigurationByParameters('system', 'Number of devices to calibrate');
			if(numDevices.length > 0 && String(numDevices[0].ItemValue).toLowerCase() !== 'not set')
			{
				let numberDevices = parseInt(numDevices[0].ItemValue);

				//can't be NaN and can't be less than one. No way to do a cal on -1 devices or even zero devices
				if(isNaN(numberDevices) || numberDevices < 1)
				{
					self.logEvent(statusLevel.Error, 'updateDeviceList: Number of devices to calibrate is not valid, must be a positive integer greater than zero, value entered is ' + numDevices[0].ItemValue);
					return false;
				}
	
				//set up the device list
				self.setUpDeviceList(numberDevices);
			}
			return true;
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};

	/**
	 * Updates the calibrationOptions['modelNumbers'] object with any newly added devices
	 */
	self.updateModelNumberList = function()
	{
		try
		{
			//remove items from the list that are not references or system control devices
			let nonDUT = self.calibrationOptions['modelNumbers'].filter(function(model)
			{
				return parseInt(model.canBeCalibrated) === 0 || (parseInt(model.canBeCalibrated) === 1 && (parseInt(model.canBeReference) === 1 || parseInt(model.canBeSystemController) === 1));
			});

			//mark everything as non-calibratable
			nonDUT.forEach(function(non)
			{
				non.canBeCalibrated = 0;
			});

			let DUT = self.configurationManager.getConfigurationByParameters('system', 'Device');
			//mark any newly added devices as calibratable
			for(let i = 0; i < DUT.length; i++)
			{
				let foundIt = false;

				//the device could already be in the list as a reference or control device
				for(let j = 0; j < nonDUT.length; j++)
				{
					if(DUT[i].ItemValue === nonDUT[j].ModelNumber)
					{
						foundIt = true;
						nonDUT[i].canBeCalibrated = 1;
					}
				}

				//if not in the list, it needs to be added
				if(!foundIt)
				{
					nonDUT.push(
						{
							ModelNumber:DUT[i].ItemValue,
							canBeCalibrated:1,
							canBeReference:0,
							canBeSystemController:0
						}
					);

				}
			}

			//now push the list back to the object
			self.calibrationOptions['modelNumbers'] = nonDUT;
			
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};

	/**
	 * This is just a pass through to the configuration manager
	 * @param {array} settings - an array of valid setting objects
	 */
	self.saveSettings = function(settings)
	{
		try
		{
			self.configurationManager.saveConfiguration(settings, self.updateSettings);
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};



	self.processSCPISample = function(data)
	{
		//TODO: Refactor this to store samples where everything else stores samples
		let deviceID = data.channel - 1;

		if(self.deviceList[deviceID].analogSamples.length >= self.sampleWindowSize)
		{
			self.deviceList[deviceID].analogSamples.shift();
		}
		self.deviceList[deviceID].analogSamples.push((data.data * 1000)); // !SNTL hack to convert to mV for cal sheet
		self.keithleyBusy = false;
	};

	/**
	 * Returns an array of the configured SCPI devices
	 * !Right now is looking for Keithley or SCPI. Needs to only be SCPI Device
	 */
	self.getSCPISettings = function()
	{
		let controlSettings = self.configurationManager.getConfigurationByArea('control');

		let scpiLocations = [];

		controlSettings.forEach(function(value)
		{
			if(value.ItemName === 'Device' && (value.ItemValue === 'Keithley' || value.ItemValue === 'SCPI'))
			{
				scpiLocations.push(value.OptionIndex);
			}
		});

		let scpiValues = [];
		scpiLocations.forEach(function(value)
		{
			let unScpi = {};
			let oneScpi = controlSettings.filter(function(scpi)
			{
				return scpi.OptionIndex === value;
			});

			oneScpi.forEach(function(theScpi)
			{
				unScpi[theScpi.ItemName] = theScpi.ItemValue;
			});
			scpiValues.push(unScpi);
		});
		
		return scpiValues;
	};

	self.setDeviceSelected = function(deviceID, selected)
	{
		self.deviceList[deviceID].selected = selected;
	};


	/**
	 * Simple function to see if any devices have been selected
	 */
	self.checkSomethingSelected = function()
	{
		try
		{
			return self.deviceList.filter(function(item)
			{
				return item.selected === true;
			}).length > 0;
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Retrieves a list of baud rates, data bits, and parity from the database
	 * Stores it in memory for use in the autoDiscovery routines
	 * Data is received in order from most common to least common usage
	 * 
	 * @param {function} callback - (optional) function to be called when data arrives, used for unit testing
	 */
	self.getAutoConnectSettings = function(callback)
	{
		try
		{
			let parameters = {
				dostuff: 'GetAutoConnectSettings',
				debug: String(self.debugFlag),
				username: self.userName,
				pcname: self.computerName
			};
		
			//this function is located in sbGlobalFunctions.js
			ProcessDatabaseRequest(parameters, function(data)
			{
				if(data.indexOf('Error:') > -1)
				{
					notifyStatus('Error retrieving auto connect settings.  Is your VPN connected and the serial widget running?', false);
					self.logEvent(statusLevel.Error, '<BR/><H2>ERROR:  Is your VPN connected and the serial widget running?</H2>', false);
					throw new ReferenceError('Error retrieving autoconnect settings, check VPN & serial widget status.');
				}
				self.autoConnectSettings = JSON.parse(data);
				if(callback && typeof callback === 'function')
				{
					callback();
				}
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};
	

	/**
	 * Saves settings and notifies the system that one device has been processed
	 * @param {object} device - Device object from sbGlobals
	 */
	self.processDeviceDiscovered = function(device)
	{
		try
		{
			//display a message to the user
			self.logEvent(statusLevel.Success, 'Successfully connected to device ' + (device.index + 1), false);

			//save settings locally
			let baudRate = device.baudRate;
			let stopBit = '1';
			let parity = device.parityBit;
			let databits = device.dataBits;

			self.saveDeviceSettings({optionName:'Baud', optionValue:baudRate, id:device.index});
			self.saveDeviceSettings({optionName:'Settings', optionValue:parity + ',' + databits, id:device.index});

			//save settings to the database
			let commsParameters = {
				dostuff: 'SaveAutoConnectSettings',
				debug: String(self.debugFlag),
				username: self.userName,
				pcname: self.computerName,
				baudrate: baudRate,
				parity: parity,
				stopbit: stopBit,
				databits: databits
			};
			self.emit('deviceDiscovered', device.index);

			ProcessDatabaseRequest(commsParameters, function(data)
			{
				if(data.indexOf('NETWORK ERROR') > -1)
				{
					self.logEvent(statusLevel.Error, 'processDeviceDiscovered: Error saving connection settings: ' + data);
				}
			});

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.runPumpController = function(pumpNumber, volume, rate)
	{

		
		let portName = self.getRelayPortNumber();

		self.timedRelay(portName, pumpNumber, volume, rate);

	};

	/**
	 * Retrieves pump control port number
	 * 
	 * @returns {string} port number
	 */
	self.getRelayPortNumber = function()
	{
		try
		{
			let pumpControlArea = self.configurationManager.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea === 'control' && setting.ItemName === 'Device' && (setting.ItemValue === 'SKR-Mini');
			});
	

			if(pumpControlArea.length === 0)
			{
				return false;
			}
			let pumpControllerID = pumpControlArea[0].OptionIndex;
			let pumpControl = self.configurationManager.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea === 'control' && setting.OptionIndex === pumpControllerID && setting.ItemName === 'Port';
			});
			if(pumpControl.length === 0)
			{
				return false;
			}
			return pumpControl[0].ItemValue;
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Retrieves pump control specific information from the system settings
	 * 
	 * @returns {object} pump control settings
	 */
	self.getRelayActivationConfiguration = function()
	{
		let portName = self.getRelayPortNumber();
		let pumpControl = self.configurationManager.configurationSettings.filter(function(setting)
		{
			return setting.ConfigurationArea === 'system' && (setting.ItemName.indexOf('Flow') === 0 || setting.ItemName.indexOf('Drain') === 0 || setting.ItemName.indexOf('Fill') === 0);
		});

		let pumpControllerSettings = {};
		pumpControllerSettings.portName = portName;
		pumpControl.forEach(function(setting)
		{
			pumpControllerSettings[setting.ItemName] = setting.ItemValue;
		});
		return pumpControllerSettings;
	};

	/**
	 * Retrieves pump control specific information from the system settings
	 * If no pump control is configured, throws an error
	 * TODO: Currently has "SKR-Mini" hard-coded. Need to do something about this.
	 * 
	 * @param {integer} dataPointIndex - the zero based index of the set point in the set point array
	 */
	self.getRelayDataPointConfiguration = function(dataPointIndex)
	{
		try
		{
			if(dataPointIndex < 0)
			{
				throw new ReferenceError('set point must be greater than zero');
			}
			let pumpControllerSettings = {};
	
			pumpControllerSettings.portName = self.getRelayPortNumber();

			let pumpControllerDataPoint = self.configurationManager.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea === 'dataPoint' && setting.ItemName === 'Model' && (setting.ItemValue === 'SKR-Mini') && parseInt(setting.OptionIndex) === parseInt(dataPointIndex);
			});
	
			if(pumpControllerDataPoint.length === 0)
			{
				return false;
			};
	
			let pumpControllerDataPointInfo = self.configurationManager.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea === 'dataPoint' &&
				parseInt(setting.OptionIndex) === parseInt(dataPointIndex) &&
				parseInt(setting.ParameterIndex) === parseInt(pumpControllerDataPoint[0].ParameterIndex) &&
				(setting.ItemName === 'Peristaltic Pump Number' || setting.ItemName === 'Pump Rate' || setting.ItemName === 'Injection Volume');
			});
	
			pumpControllerDataPointInfo.forEach(function(asp)
			{
				if(asp.ItemName === 'Peristaltic Pump Number')
				{
					pumpControllerSettings.pump = asp.ItemValue.trim();
				}

				if(asp.ItemName === 'Pump Rate')
				{
					pumpControllerSettings.rate = asp.ItemValue.trim();
				}

				if(asp.ItemName === 'Injection Volume')
				{
					pumpControllerSettings.volume = asp.ItemValue.trim();
				}
			});
			
			return pumpControllerSettings;
	
		}
		catch(err)
		{
			self.onError(err);
		}

	};

	self.getPumpControlSettings = function()
	{
		let pumpControlArea = self.configurationManager.configurationSettings.filter(function(setting)
		{
			return setting.ConfigurationArea === 'control' && setting.ItemName === 'Device' && (setting.ItemValue === 'SKR-Mini');
		});

		if(pumpControlArea.length === 0)
		{
			self.logEvent(statusLevel.Error, 'getPumpControlSettings: No pump controller Configured', false);
			return false;
		}

		let pumpControlIndex = pumpControlArea[0].OptionIndex;
		let pumpControllerSettings = self.configurationManager.configurationSettings.filter(function(setting)
		{
			return setting.ConfigurationArea === 'control' && setting.OptionIndex === pumpControlIndex;
		});

		let pumpController = [];
		for(let i = 0; i < pumpControllerSettings.length; i++)
		{
			pumpController[pumpControllerSettings[i].ItemName] = pumpControllerSettings[i].ItemValue;
		}
		return pumpController;
	};

	self.configurePumpController = function()
	{
		if(self.pumpControllerConfigured === false)
		{
			let pumpControllerSettings = self.getPumpControlSettings();
			self.openPort(pumpControllerSettings.Port, pumpControllerSettings.Baud, pumpControllerSettings.Settings);
			self.pumpControllerConfigured = true;
		}
	};

	/**
	 * Activates a relay through the pump control board. the relay number tells the controller which peristaltic pump to run at what rate and the volume to pump.
	 * @param {string} portName - The name of the port (i.e. Com1)
	 * @param {integer} relayNumber - between 1 and 4
	 * @param {integer} rate - rate in ml/min for pump to run
	 * @param {integer} volume - the amount to pump
	 */
	self.timedRelay = function(portName, relayNumber, rate, volume)
	{
		try 
		{
			// console.log(portName);
			// console.log(relayNumber);
			// console.log(rate);
			if(!portName || !relayNumber || !rate || !volume)
			{
				throw new SyntaxError('missing information, must include port name, relay number, rate and volume.');
			}
			// if(isNaN(relayNumber) || isNaN(rate) || parseInt(relayNumber) < 1 || parseInt(relayNumber) > 6 || parseInt(rate) < 1)
			// {
			// 	throw new TypeError('Invalid parameter: Relay number and rate must be positive integers. relay number must be between 1 and 6');
			// }

			self.emit('relayActivated', {relayNumber: relayNumber, rate: rate, volume: volume});

			//select the pump using it's ordinal index by subtracting 1 from it's number.
			//All G-code commands must be capitalized.
			self.widgetCommunications.sendCommand(portName, 'T' + (relayNumber - 1), true);
			
			//give the pump selection command time to complete
			//!This should be event driven by looking for the returning "ok".
			setTimeout(function() 
			{
				//send command to run the peristalic pump for the volume to be sent.
				self.widgetCommunications.sendCommand(portName, 'G1 E' + volume + 'F' + rate, true);
			}, 100);
			
			//self.widgetCommunications.sendCommand(portName, 's ' + relayNumber + ' ' + rate, true);
		}
		catch (err) 
		{
			self.onError(err);
		}
	};

	/**
	 * Activates or deactivates relay. This is a constant on or constant off
	 * @param {string} portName - The name of the port (i.e. COM1)
	 * @param {integer} relayNumber - varies, see comments below
	 * @param {boolean} active - true = activate relay (closed), false = deactivate relay (open)
	 */
	self.activateRelay = function(portName, relayNumber, active)
	{
		try
		{
			if(!portName || !relayNumber)
			{
				throw new SyntaxError('missing information, must include port name and relay number');
			}
			//2020-05-05 Happy Cinco de Mayo! Tacos for everyone!
			//daveg removed this check because it no long applies, the relay numbers changed quite a bit between Arduino & SKR-Mini controllers.
			// if(isNaN(relayNumber) || parseInt(relayNumber) < 1 || parseInt(relayNumber) > 6)
			// {

			// 	throw new TypeError('invalid parameter: relay number must be a positive integer between 1 and 6');
			// }

			if(active !== true && active !== false)
			{
				throw new TypeError('invalid parameter: relay must be activated or deactivated. "active" is a boolean variable and must receive true or false.');
			}
			/*There are currently three available relays (ECO V2 rig):
				Fill valve: 8
				Drain valve: 40
				Circulation Pump: 41
				The string M42 is identical G-code for each relay.  See: https://marlinfw.org/docs/gcode/M042.html  P identifies the pin to turn on or off, and S indicates the state of that pin.  0 is off or closed, and 255 is on or open.
				EG: M42P41S255 will turn on the circulation pump & M42P41S0 turns it off
				The fill and drain valves work the same way.
				Important:  All G-code commands must use ALL CAPS, no lower case commands.
			*/

			if(active === true)
			{
				//concatenate a command string to turn on or open a valve or pump relay
				self.widgetCommunications.sendCommand(portName, 'M42P' + relayNumber + 'S255', true);
			}

			if(active === false)
			{
				//concatenate a command string to turn off or close a valve or pump relay
				self.widgetCommunications.sendCommand(portName, 'M42P' + relayNumber + 'S0', true);
			}
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Replaces "retrievePort"
	 * determines which device is being referenced based on the serial port it
	 * is attached to
	 * @param {string} portName - The system name of the port
	 */
	self.determineActiveDevice = function(portName)
	{
		try
		{
			if(!portName)
			{
				throw new ReferenceError('Port name must be provided');
			}

			//look in the device list first
			for(let i = 0; i < self.deviceList.length; i++)
			{
				if(self.deviceList[i].portName === portName)
				{
					return self.deviceList[i];
				}
			}

			//then look in the reference list
			for(let i = 0; i < self.referenceList.length; i++)
			{
				if(self.referenceList[i].portName === portName)
				{
					return self.referenceList[i];
				}
			}

			//if we can't find it, return a null
			return null;
		}
		catch(err)
		{
			self.onError(err);
		}
	};
	
	/**
	 * This code checks all devices in the deviceList and makes sure they all have unique serial numbers
	 * Modified from: https://stackoverflow.com/questions/30735465/how-can-i-check-if-the-array-of-objects-have-duplicate-property-values?noredirect=1&lq=1
	 * @param {array} devices - An array containing all the device serial numbers
	 */
	self.checkForDuplicates = function(devices)
	{
		try
		{
			//2019-10-21 daveg added this to prevent duplicate serial numbers
			//use the 'devices' array created in startCalibrationInDatabase, and maps the serial numbers
			var deviceArray = devices.map(function(device)
			{
				//return the array of serial numbers from all of the devices
				return device.serialNumber; 
			});
			//check to see if there are duplicate serial numbers
			var isDuplicate = deviceArray.some(function(device, idx)
			{ 
				//return a boolean, true means stop the calibration, false means go ahead.
				return deviceArray.indexOf(device, idx + 1) !== -1;
			});
			
			//check the boolean, if it's true send a message to the user, and stop the calibration, if not, do nothing and allow the calibration to proceed.
			if(isDuplicate)
			{
				self.endCalibration(false);
				throw new RangeError('Duplicate serial numbers found, calibration cannot proceed.');
			}
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Updates the database with all the information required at the start of a calibration
	 * @param {function} callback - a function to be run when the database has been updated successfully
	 */
	self.startCalibrationInDatabase = function(callback)
	{
		try
		{
			let devices = [];
			self.deviceList.forEach(function(device)
			{
				if(device.selected === true)
				{
					let currentDevice = {
						modelNumberID: self.getModelID(device.modelNumber),
						serialNumber: device.serialNumber,
						position: device.index + 1
					};
					devices.push(currentDevice);
				}
			});

			//check to see if there are any duplicate serial numbers
			self.checkForDuplicates(devices);

			let reference = self.referenceList[0];

			// let references = [
			// 	{
			// 		'modelNumber': reference.getccResponse.CalibrationCoefficients['@attributes'].DeviceType,
			// 		'serialNumber': reference.getccResponse.CalibrationCoefficients['@attributes'].SerialNumber,
			// 		'measurands': [
			// 			{
			// 				'id': reference.getccResponse.CalibrationCoefficients.Calibration[0]['@attributes'].id,
			// 				'calibrationDate': reference.getccResponse.CalibrationCoefficients.Calibration[0].CalDate,
			// 				'coefficients': [
			// 					{
			// 						'ItemName': 'OFFSET',
			// 						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[0].OFFSET
			// 					},
			// 					{
			// 						'ItemName': 'SLOPE',
			// 						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[0].SLOPE
			// 					}
			// 				]
			// 			},
			// 			{
			// 				'id': reference.getccResponse.CalibrationCoefficients.Calibration[2]['@attributes'].id,
			// 				'calibrationDate': reference.getccResponse.CalibrationCoefficients.Calibration[2].CalDate,
		
			// 				'coefficients': [
			// 					{
			// 						'ItemName': 'OFFSET',
			// 						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[2].OFFSET
			// 					},
			// 					{
			// 						'ItemName': 'SLOPE',
			// 						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[2].SLOPE
			// 					}
			// 				]
			// 			}
			// 		]
			// 	}
			// ];

			let references = [];
			let referenceDevice = {};
			referenceDevice.modelNumber = reference.getccResponse.CalibrationCoefficients['@attributes'].DeviceType;
			referenceDevice.serialNumber = reference.getccResponse.CalibrationCoefficients['@attributes'].SerialNumber;
			referenceDevice.measurands = [];

			
			for(let i = 0; i < reference.getccResponse.CalibrationCoefficients.Calibration.length; i ++)
			{
				let test = {};
				test.id = reference.getccResponse.CalibrationCoefficients.Calibration[i]['@attributes'].id;
				test.gain = reference.getccResponse.CalibrationCoefficients.Calibration[i]['@attributes'].gain;
				test.calibrationDate = reference.getccResponse.CalibrationCoefficients.Calibration[i].CalDate;				
				test.coefficients =						
					[{
						'ItemName': 'OFFSET',
						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[i].OFFSET
					},
					{
						'ItemName': 'SLOPE',
						'ItemValue': reference.getccResponse.CalibrationCoefficients.Calibration[i].SLOPE
					}];

				referenceDevice.measurands.push(test);
			}			

			references.push(referenceDevice);
			
			// console.log(references);
			// for(let i = 0; i < self.referenceList.length; i++)
			// {
			// 	let reference = self.referenceList[i];
			// 	let measurands = [];

			// 	for (let j = 0; j < reference.measurands.length; j++)
			// 	{
			// 		let measurand = reference.measurands[j];
			// 		let coefficients = reference.coefficients[j];
					
			// 		let currentMeasurand = {
			// 			id:measurand.id,
			// 			calibrationDate: coefficients.CalDate,
			// 			coefficients:coefficients.coefficients

			// 		};

			// 		measurands.push(currentMeasurand);
			// 	}
			// 	let currentReference = {
			// 		modelNumber: reference.modelNumber,
			// 		serialNumber: reference.serialNumber,
			// 		measurands: measurands
			// 	};

			// 	references.push(currentReference);

			// }

			// //!Start Sine Max hack
			//!Need to re-enable this
			// let calcList = self.dataPointList.filter(function(point)
			// {
			// 	return point['Calculate After'] === 'Sine Max';
			// });

			// let sineMax = calcList.length > 0;
			// //!End Sine Max hack
			
			let parameters = {
				dostuff: 'saveCalibrationStart',
				debug: self.debugFlag,
				configurationID: self.configurationManager.currentConfiguration,
				computername: self.computerName,
				username: self.userName,
				notes: 'none',
				softwarename: self.softwareName,
				softwareversion: self.versionNumber,
				systemid: self.systemID,
				devices: devices,
				references: references,
			}; 
			// console.log(parameters);
			//!Need to re-enable this
			// if(sineMax === true)
			// {
			// 	parameters.notes = 'SineMax';
			// }

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.parseCalibrationIDs(JSON.parse(data), callback);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Once the database has been updated at the start of a calibration
	 * This adds the returned ID values to the objects
	 * 
	 * @param {object} parameters - Parameters returned by the database
	 * @param {function} callback - function to be called when this routine is done
	 */
	self.parseCalibrationIDs = function(parameters, callback)
	{
		try
		{
			self.calibrationID = parameters.calibrationID;
			for(let i = 0; i < self.deviceList.length; i++)
			{
				for(let j = 0; j < parameters.devices.length; j++)
				{
					if(parseInt(parameters.devices[j].modelNumberID) === parseInt(self.getModelID(self.deviceList[i].modelNumber)) && parameters.devices[j].serialNumber === self.deviceList[i].serialNumber)
					{
						self.deviceList[i].instrumentListID = parameters.devices[j].instrumentListID;
						break;
					}
				}
			}

			for(let i = 0; i < self.referenceList.length; i++)
			{
				for(let j = 0; j < parameters.references.length; j++)
				{
					if(self.referenceList[i].modelNumber === parameters.references[j].modelNumber
						&& self.referenceList[i].serialNumber === parameters.references[j].serialNumber)
					{
						self.referenceList[i].CalibrationDeviceID = parameters.references[j].CalibrationDeviceID;
						//!NOTE: This part is very Sentinel / ECO specific. This WILL NOT WORK for other devices
						for(let k = 0; k < self.referenceList[i].measurands.length; k++)
						{
							for(let l = 0; l < parameters.references[j].measurands.length; l++)
							{
								if(self.referenceList[i].measurands[k].id === parameters.references[j].measurands[l].id)
								{
									self.referenceList[i].measurands[k].calibrationDeviceCalibrationID = parameters.references[j].measurands[l].calibrationDeviceCalibrationID;
									self.referenceList[i].measurands[k].referenceListID = parameters.references[j].measurands[l].referenceListID;
								}
							}
						}
					}
				}
			}


			if(callback && typeof callback === 'function')
			{
				callback();
			}
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.getReferenceListID = function(reference, measurand)
	{
		try
		{
			for(let i = 0; i < reference.measurands.length; i++)
			{
				if(reference.measurands[i].id === measurand)
				{
					return reference.measurands[i].referenceListID;
				}
			}
			return -1;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.getDataPointReference = function(dataPointIndex)
	{
		for(let i = 0; i < self.dataPointList[dataPointIndex].deviceList.length; i++)
		{
			if(self.dataPointList[dataPointIndex].deviceList[i]['Device Type'] === 'Reference')
			{
				return self.dataPointList[dataPointIndex].deviceList[i];
			}
		}
	
	};

	self.valuesCalculatedAfter = function()
	{
		let calcValues = self.dataPointList.filter(function(point)
		{
			return point['Calculate After'].toLowerCase() !== 'not set';
		});

		return calcValues.length > 0;
	};

	self.calculatePostDataPoint = function()
	{
		let postPointCalculation = self.dataPointList[self.currentDataPoint]['Calculate After'];
		switch(postPointCalculation)
		{
		case 'Sine Max':
			self.sineMax();
			break;
		case 'Sentinel Offset':
			self.sentinelOffset();
			break;
		}
	};

	/**
	 * Stores values in the database
	 * !Currently refers to the first reference in the list for getting the measurementtypeid for the DUT
	 */
	self.saveDataPoint = function()
	{
		//!Re-enable this for Sine Max
		// self.calculatePostDataPoint();

		let measurands = [];
		
		let dataPoint = self.dataPointList[self.currentDataPoint];
		for(let i = 0; i < dataPoint.deviceList.length; i++)
		{
			let pointDevice = dataPoint.deviceList[i];
			if(pointDevice['Device Type'] === 'Reference')
			{
				let measurand = {
					measurand:pointDevice.Measurand,
					measurandSubType:pointDevice['Measurand Sub-Type'],
					//2021-05-15 daveg added this ternary to account for the missing targetValue being passed into saveDataPoint's subsequent PHP code.  This problem was likely introduced with the nomenclature changes at Philomath's request.   See SVN: 8041.  However, I'm not convinced this is the actual problem, because the "Target Value" I changed was in the Set Point UI where "Target Value" changed to "Injection Volume", and I don't think it's the same Target Value since the change I made was to the Controller object for the peristaltic pumps which have nothing to do with the Reference object.  For the time being I'm inserting this potential hack as a means to move forward with the transition from HiGain to LoGain
					targetValue:pointDevice['Target Value'] === undefined ? 'Not Set' : pointDevice['Target Value']
				};
				measurands.push(measurand);
			}
		}

		let devices = [];
		for(let i = 0; i < self.deviceList.length; i++)
		{
			let currentDevice = self.deviceList[i];
			if(currentDevice.selected === true)
			{
				let device = {};
				let deviceData = {
					instrumentListID:currentDevice.instrumentListID,
					numberOfSamplesUsed:currentDevice.sampleWindow
				};

				device.deviceData = deviceData;

				let deviceSensorData = [];

				//!NOTE: getMeasurandFromSubType is ECO and SNTL specific and will need to be refactored
				currentDevice.lastSample.forEach(function(sensor)
				{
					if(sensor.key.toLowerCase().includes('gain'))
					{
						let useIt = false;
						measurands.forEach(function(meas)
						{
							if(meas.measurandSubType === sensor.id)
							{
								useIt = true;
							}
						});
						if(useIt === true)
						{
							let sensorSample = {
								measurand:self.getMeasurandFromSubType(sensor.id),
								measurandSubType:sensor.id,
								averagedRawData:sensor.averageRaw,
								standardDeviation:sensor.stdDevRaw,
								slope:0,	//!Need to enable slope
								cov:sensor.covRaw,
								sse:sensor.sseRaw,
								gain:sensor.key
							};
							// console.log(sensorSample);
							deviceSensorData.push(sensorSample);
						}
					}
				});

				device.deviceSensorData = deviceSensorData;

				devices.push(device);
			}
		}

		let references = [];

		for(let i = 0; i < self.referenceList.length; i++)
		{
			let currentReference = self.referenceList[i];
			let referenceSensorData = [];

			currentReference.lastSample.forEach(function(sensor)
			{
				if(sensor.key.toLowerCase().includes('gain'))
				{
					let useIt = false;
					measurands.forEach(function(meas)
					{
						if(meas.measurandSubType === sensor.id)
						{
							useIt = true;
						}
					});

					if(useIt === true)
					{
						let referenceSample = {
							referenceListID:self.getReferenceListID(currentReference, sensor.id),
							numberOfSamplesUsed:sensor.sampleCount,
							measurand:self.getMeasurandFromSubType(sensor.id),
							measurandSubType:sensor.id,
							averagedRawData:sensor.averageRaw,
							averagedCalculatedData:sensor.averageConverted,
							standardDeviation:sensor.stdDevConverted,
							slope:'0',
							cov:sensor.covConverted,
							sse:sensor.sseConverted,
							gain:sensor.key
						};
						referenceSensorData.push(referenceSample);
					}
				}
			});

			references.push(referenceSensorData);
			//console.log(currentReference);

		}

		let parameters = {
			dostuff:'saveDataPoint',
			debug: self.debugFlag,
			calibrationID:self.calibrationID,
			pointNumber:(self.currentDataPoint + 1),
			measurands:measurands,
			devices:devices,
			referenceSensors:references
		};
		 //console.log(parameters);
		ProcessDatabaseRequest(parameters, function(data)
		{
			//console.log(data);
			self.runDataPoint(++self.currentDataPoint);
		});
	};

	//!Need to give a way to indicate which reference to start. We are currently assuming only one exists
	self.startReference = function()
	{
		self.runningReference = true;
		self.logEvent(statusLevel.Info, 'Starting reference sensor(s)', false);
		self.connectSystemDevices(self.referenceList);
	};

	self.doneStartingReference = function(device)
	{
		device.running = true;
		device.buffer = '';
	};

	self.getSystemStatusValues = function()
	{
		let systemStatusValues = self.configurationManager.getConfigurationByArea('pump');
		return systemStatusValues;
	};

	/**
	 * Returns the specifications you have asked for
	 * Removes spaces and values in brackets
	 * Camel cases spec
	 */
	self.getCalibrationSpecifications = function(specificationItems)
	{
		try
		{
			if(!specificationItems)
			{
				self.logEvent(statusLevel.Error, 'getCalibrationSpecifications: Missing parameters, must pass in both specification key and specification item', false);
				return false;
			}

			if(!Array.isArray(specificationItems))
			{
				self.logEvent(statusLevel.Error, 'getCalibrationSpecifications: Specification items must be an array', false);
				return false;
			}
			let specifications = {};

			for(let i = 0; i < specificationItems.length; i++)
			{
				let filteredConfig = self.configurationManager.getConfigurationByParameters('system', specificationItems[i]);
				let specificationName = self.trimSpecificationName(specificationItems[i]);
				let val = 'Not Set';
				if(filteredConfig.length > 0)
				{
					val = filteredConfig[0].ItemValue;
					if(!isNaN(val))
					{
						val = Number(val);
					}
				}
				
				specifications[specificationName] = val;
			}
	
			return specifications;
	
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};


	self.trimSpecificationName = function(specificationName)
	{
		let parensRemoved = removeParentheses(specificationName);
		let camelCase = toCamelCase(parensRemoved);
		return camelCase;
	};

	//!This is a hard-coded Sentinel hack. Needs to be refactored
	self.sineMax = function()
	{
		try
		{
			let referenceConcentration = self.referenceList[0].convertedSampleHistory[self.referenceList[0].convertedSampleHistory.length - 1];
			let targetSlope = self.configurationManager.getConfigurationByParameters('system', 'Sine Max target slope')[0].ItemValue;
			
			self.deviceList.forEach(function(device)
			{
				let deviceZeroReading = device.analogSampleHistory[device.analogSampleHistory.length - 2];
				let deviceConcentrationReading = device.analogSampleHistory[device.analogSampleHistory.length - 1];
				let currentSineMax = device.getSetting('mxledsinemax');
				currentSineMax = currentSineMax.substring(currentSineMax.indexOf(',') + 1);
				let newSineMax = Math.sineMax(referenceConcentration, deviceZeroReading, deviceConcentrationReading, targetSlope, currentSineMax);
				device.newSineMax = newSineMax;
			});

			console.log('Sine Max calculated');
		}
		catch(err)
		{
			self.onError(err);
			return null;
		}
	};

	self.sentinelOffset = function()
	{
		try
		{
			let desiredOutput = self.configurationManager.getConfigurationByParameters('system', 'Sentinel target offset')[0].ItemValue;
			self.deviceList.forEach(function(device)
			{
				let deviceOutput = device.analogSampleHistory[device.analogSampleHistory.length - 1];
				let initialOffset = device.getSetting('mxsampleoffset');
				initialOffset = initialOffset.substring(initialOffset.indexOf(',') + 1);
				let newOffset = Math.sentinelOffset(desiredOutput, deviceOutput, initialOffset);
				device.newOffset = newOffset;
			});
			
		}
		catch(err)
		{
			self.onError(err);
			return null;
		}
	};

	self.validateSineMax = function(device)
	{

		let calcList = self.dataPointList.filter(function(point)
		{
			return point['Calculate After'] === 'Sine Max';
		});

		if(device.sineMax && device.offset && calcList.length === 0)
		{
			if(parseInt(device.sineMax) === 2000 || parseInt(device.sineMax) === 4000)
			{
				self.logEvent(statusLevel.Error, 'validateSineMax: Sine Max is set to default for Sentinel SN: ' + device.serialNumber, false);
				self.endCalibration(false);
			}

			if(parseInt(device.offset) === 0)
			{
				self.logEvent(statusLevel.Error, 'validateSineMax: Offset is set to default for Sentinel ' + device.serialNumber, false);
				self.endCalibration(false);
			}
		}
	};

	self.programCoefficients = function()
	{
		self.coefficientCounter = 0;
		let selectedDevices = self.deviceList.filter(function(device)
		{
			return device.selected === true;
		});

		selectedDevices.forEach(function(device)
		//self.deviceList.forEach(function(device)
		{
			self.emit('updateStatus', 'Loading Coefficients');

			let coeffLoader = new CoefficientLoader(device);
			coeffLoader.on('requestSendCommand', function(data)
			{
				self.widgetCommunications.sendCommand(data.portName, data.command, true);
			});

			coeffLoader.on('commandsSent', function()
			{
				console.log('coefficients programmed');
				self.coefficientCounter++;
				if(self.coefficientCounter >= selectedDevices.length)
				{
					self.emit('updateStatus', 'Coefficients Programmed');
				}
			});

			coeffLoader.on('timedOut', function(serialNumber)
			{
				self.logEvent(statusLevel.Error, 'Coefficient loading timed out SN ' + serialNumber, false);
			});
			self.coefficientLoaders.push(coeffLoader);

			//Temporary. Remove when dealing with an error
			let sm = device.newSineMax;
			if(typeof sm === 'undefined')
			{
				sm = 2000;
			}
			self.coefficientLoaders[self.coefficientLoaders.length - 1].programCoefficients(['factorymode=1', 'mxledsinemax=1,' + sm, 'mxsampleoffset=1,' + device.newOffset, 'getsettings', 'factorymode=0']);
		});
	};

	self.on('calibrationEnded', function(success)
	{
		//!WTF is fred?
		if(success !== 'fred')
		// if(success === true)
		{
			let calcList = self.dataPointList.filter(function(point)
			{
				return point['Calculate After'] === 'Sine Max';
			});

			if(calcList.length > 0)
			{
				self.emit('updateStatus', 'Loading coefficients');
			}
			
		}
	});

	self.processCommands = function(device, commandList)
	{
		if(commandList && commandList.length > 0)
		{
			let cmds = [];
			commandList.forEach(function(command)
			{
				let oneCmd = command.Command;
				if(command.CommandParameter && command.CommandParameter !== null)
				{
					oneCmd += command.CommandParameter;
				}
				cmds.push(oneCmd);
			});
			device.commandList = cmds;
			device.processCommand(0);
		}
	};

	self.getModelBySystemType = function(systemType)
	{
		let returnValues = [];
		let filteredModels = self.calibrationOptions.modelBySystemType.filter(function(item)
		{
			return item.CalibrationSystemType === systemType;
		});
		
		filteredModels.forEach(function(model)
		{
			returnValues.push(model.ModelNumber);
		});

		return returnValues;
	};

	self.getSerialPortState = function(portName)
	{
		self.widgetCommunications.getSerialPortState(portName);
	};

	self.getSystemSettings = function()
	{
		try
		{
			let settingsList = [
				'Additional Wait Time Once Stable (ms)',
				'Data Point Timeout',
				'Reference Sensor Timeout',
				'Device Under Test Timeout'
			];

			settingsList.forEach(function(item)
			{
				let setting = self.configurationManager.getConfigurationByParameters('system', item);
				if(setting.length > 0)
				{
					let parensRemoved = removeParentheses(setting[0].ItemName);
					let itemName = toCamelCase(parensRemoved);
					self[itemName] = setting[0].ItemValue;
				}
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.getConfigurationValue = function(configurationArea, parameterName)
	{
		try
		{
			let returnItem = self.configurationManager.getConfigurationByParameters(configurationArea, parameterName);
			if(returnItem.length === 1)
			{
				return returnItem[0].ItemValue;
			}
			return null;
		}
		catch(err)
		{
			self.onError(err);
		}


	};

	/**
	 * For developer use only, not intended for use by other code
	 * Allows a developer to enable or disable debug logging
	 * @param {boolean} enable 
	 */
	self.setLogDebug = function(enable)
	{
		try
		{
			if(enable === true)
			{
				self.widgetCommunications.socket.emit('setLogLevel', 'debug');
				return;
			}
			self.widgetCommunications.socket.emit('setLogLevel', 'error');
		}
		catch(err)
		{
			self.onError(err);
		}
	};
}

/**
 * TODO: Currently not being used. Needs to be re-implemented
 * This function calculates whether an instrument is in a valid calibration date range.  The default range of less than 365 days is a valid calibration, if it's got less than 30 days left, warn the user, if it's over a year, stop the calibration.  A custom duration can be passed in, which is still checked against a year.
 * @param {Date} calibrationDate the calibration date gotten from the GETCC command, must be either a properly formatted JS Date, or (preferably) formatted using Moment.js, see: https://momentjs.com/guides/#/warnings/js-date/
 * @param {int} daysToWarn <optional> a custom number of days to check for instead of the default 30 days.
 */
function isCalibrationDateValid(calibrationDate, daysToWarn)
{
	var validDaysSpan = 365;  //number of days a calibration is valid for
	var validDaysToWarn = 335; //the number of days left in a calibration year where we warn the calibration tech

	//if daysToWarn is passed in, use it instead of the default 30 days
	if(daysToWarn > 0)
	{
		validDaysToWarn = validDaysSpan - daysToWarn;
	}
	//now calculate how many days are left depending on whether daysToWarn was passed in, or not.
	var daysLeft = validDaysSpan - validDaysToWarn;

	//determine if the calibration date is withing a year from today's data
	var boolYear = moment(calibrationDate).isBetween(moment().subtract(validDaysSpan, 'days'), moment());

	//determine if the calibration date falls into the 'warn the user' date range
	var boolMonth = moment(calibrationDate).isBetween(moment().subtract(validDaysSpan, 'days'), moment().subtract(validDaysToWarn, 'days'));

	//if boolMonth is true, warn the user that they have a short time to get another calibrated sensor in place, or recalibrate this one.  Place the warn string into notifyStatus() box to warn the calibration tech each time they run a calibration.
	if(boolMonth)
	{
		//returning -1 causes the color of notifyStatus() text to be "check engine orange", to warn the tech that the calibration is only valid for a short time
		return {result: statusLevel.Warn, action: 'warn', reason: 'This reference instrument\'s calibration will expire in ' + daysLeft + ' days or less.'};
	}
	//else, if it falls within the past year, but has more days left than daysLeft, return true, and the reason can be ignored.
	else if(boolYear)
	{
		//returning true causes the color of notifyStatus() text to be green indicating the calibration is valid.
		return {
			result: statusLevel.Success, 
			action: 'proceed', 
			reason: 'This reference instrument\'s calibration is valid.'
		};
	}
	//if the calibration date is more than a year old, return false, and block further calibration processes.
	else
	{
		//returning false causes the color of notifyStatus() text to be red, indicating an out of calibration sensor, and also sets the boolean 'startingCalibration' to false to block the cal from moving forward.
		return {result: statusLevel.Error, action: 'block', reason: 'This reference instrument\'s calibration is more than a year out of date, calibration cannot proceed.'};
	}

}


/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
	module.exports =
    {
    	CalRun:CalRun
    };
}




