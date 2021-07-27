'use strict';

/*
Reviewed 2020-01-23 (MHV) to ensure it complies with our error handling scheme
See CalRun.js for details

Added Unit Tests 2020-01-24 (MHV)
*/

/**
 * To access the help object in ../sbSerialWidget/serverObject.js
 * send a call to help in WidgetCommunications
 * You can get simple help like so:
 * WidgetCommunications.help();
 * This will return a list of help topics and display them in the console
 * Or you can get more specific help like so:
 * WidgetCommunications.help('sendCommand')
 * This will give you specific help about a command
 */

// NOTE: This is the ES5 standard for defining classes
// Per this article, this is the better option if we can't use ES6 classes
// https://www.sitepoint.com/javascript-object-creation-patterns-best-practises/

/**
 * For managing communication with the Node.js SerialWidget
 * This is primarily a pass=through that talks to the serial widget
 * @param {string} applicationName 
 */
function WidgetCommunications (applicationName)
{
	let self = this;
	
	//variable for controlling the logging level
	self.logLevel = 'error';
	
	//connect up listeners
	self.listener = new SBListener();
	self.on = self.listener.on;
	self.emit = self.listener.emit;
	
	self.connected = false;
	self.applicationNameSet = false;
	
	//!Should this parameter be externally configurable?
	let wakeDelaySeconds = 8; //delay before giving up on wake up

	/**
		 * Check the socket connection and send application name when connected
		 * Also connects listeners to the socket
		 */
	self.initialize = function ()
	{
		try
		{
			//need to connect to the loacal socket
			//this is how we connect to the serial widget
			self.socket = io.connect('http://localhost:8080');
		}
		catch (err) 
		{
			self.onError(err);
			return;
		}

		//from here on are simply attachments to socket events.
		//These all call functions that are defined further down in the class
		self.socket.on('connect', function (err)
		{
			self.processConnection(err);
		});

		self.socket.on('disconnect', function(parameters)
		{
			self.processDisconnect();
		});
		self.socket.on('serialPortList', function (parameters)
		{
			self.setSerialPortList(parameters);
		});
		self.socket.on('dataReceived', function (parameters)
		{
			self.setDataReceived(parameters);
		});
		self.socket.on('portConfigured', function (parameters)
		{
			self.setPortConfigured(parameters);
		});
		self.socket.on('awake', function(parameters)
		{
			self.emit('awake', parameters);
		});
	
		self.socket.on('publish', function(parameters)
		{
			//for this, we are going to end up copying files from the local drive to the network
			console.log('publish: ' + parameters);
		});
	
		self.socket.on('clientUserName', function(userName)
		{
			self.emit('clientUserName', userName);
		});
	
		self.socket.on('pcName', function(computerName)
		{
			self.emit('pcName', computerName);
		});
	
		self.socket.on('portClosed', function(portName)
		{
			self.emit('portClosed', portName);
		});
	
		self.socket.on('serialPortState', function(parameters)
		{
			self.emit('serialPortState', parameters);
		});
	
		self.socket.on('err', function(parameters)
		{
			self.emit('error', parameters);
		});

		self.socket.on('help', function(parameters)
		{
			console.log(parameters);
		});
	};

	self.help = function(parameter)
	{
		if(typeof(parameter !== 'undefined'))
		{
			self.socket.emit('help', parameter);
		}
		else
		{
			self.socket.emit('help');
		}
	};

	/**
	 * All errors get funneled through this function
	 * and then passed on to whatever upper level class has created this instance
	 */
	self.onError = function(err)
	{
		err.name = 'Error';
		self.emit('error', err);
	};

	/**
	 * When the serial widget loses connection
	 * this just throws an exception to let the user know
	 */
	self.processDisconnect = function()
	{
		try
		{
			self.applicationNameSet = false;
			throw new Error('Serial Widget has stopped! Check that the Serial Widget is running');
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * when the serial widget is connected
	 * This will only be hit if the widget has been disconnected and reconnected
	 * In normal operations, if the widget is already started
	 * this will not be triggered
	 */
	self.processConnection = function(err)
	{
		//if there is a connection error, let the user know
		if(err)
		{
			self.onError(err);
			return;
		}

		try
		{
			//if there is no error, then set the widget initial values
			if(self.applicationNameSet === false)
			{
				//set the application name and logging level
				//then log a debug message

				self.socket.emit('setApplicationName', {applicationName:applicationName, socketID:self.socket.id});
				self.socket.emit('setLogLevel', self.logLevel);
				self.logEvent('debug', 'WidgetCommunications', 'initialize', 'application name set');
				self.applicationNameSet = true;
				self.connected = true;
				self.emit('connect', 'Serial Widget is connected.');
			}
		}
		catch(err)
		{
			self.onError(err);
		}

	};
	
	/**
	 * When the system requests the list of ports
	 * Ask the widget
	 * Then proccess them to the callback when the widget returns the list
	 * @param {function} callback = function to be called when the port list is returned
	 */
	self.getSerialPortList = function (callback)
	{
		self.on('serialPortList', callback);
		self.socket.emit('getSerialPortList');
	};
	
	/**
	 * When the system requests to wake a device
	 * build the wake parameters and request the widget wake the device
	 * @param {string} portName - the name of the serial port to use
	 */
	self.wakeDevice = function(portName)
	{
		try
		{
			if(!portName)
			{
				throw new Error('Port name is missing! Please provide port name');
			}
			var parameters = {seconds: wakeDelaySeconds};
			self.socket.emit('wakeInstrument', {portName:portName, parameters: parameters});
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When the system asks the port to be configured
	 * Convert the values to something widget can understand
	 * and then send it
	 * @param {string} portName - the name of the port to be used
	 * @param {integer} baudRate
	 * @param {integer} dataBits
	 * @param {string} parity - E (even), O (odd) or N (none)
	 * @param {integer} stopBits - Typically 1
	 */
	self.configurePort = function (portName, baudRate, dataBits, parity, stopBits)
	{
		try
		{
			if(!portName || !baudRate || !dataBits || !parity || !stopBits)
			{
				throw new Error('Missing parameter. You must supply port name, baud rate, data bits, parity bits and stop bits');
			}

			if(isNaN(baudRate) || isNaN(dataBits) || isNaN(stopBits))
			{
				throw new Error('Invalid parameter, must be a number. Baud rate, data bits and stop bits must all be numbers\nEG: calRun.widgetCommunications.configurePort("COM25",19200,8,"N",1);');
			}
			//build the port object required by the widget
			let portObject = [{baudRate:Number(baudRate), dataBits:Number(dataBits), stopBits:Number(stopBits)}, {portName:portName}];
			switch(parity.toUpperCase())
			{
			case 'N':
				portObject[0].parity = 'none';
				break;
			case 'E':
				portObject[0].parity = 'even';
				break;
			case 'O':
				portObject[0].parity = 'odd';
				break;
			default:
				throw new Error('Invalid parity. Must be "N", "E" or "O".');
			}
		
			self.socket.emit('configurePort', portObject);
		}
		catch(err)
		{
			self.onError(err);
		}

	};
	
	/**
	 * Send a command out a specific port
	 * @param {string} portName - the name of the serial port
	 * @param {string} command - the command to be sent
	 * @param {boolean} sendCRLF - should a carriage return and line feed be attached to the command?
	 */
	self.sendCommand = function (portName, command, sendCRLF)
	{  
		try
		{
			if(!portName || !command)			
			{
				console.log(portName);
				console.log(command);
				console.log(sendCRLF);
				throw new Error('Invalid parameter. Port name and command must be passed in');
			}

			//build the object required by the serial widget
			let commandObject = {portName:portName, commandText:command, sendCRLF:sendCRLF}; 
			self.socket.emit('sendCommand', commandObject);
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Let the widget know about the device attached to a specific serial port
	 * This is primarily used for logging on the local machine
	 * @param {string} portName - the name of the port being used
	 * @param {string} modelNumber - The model of the device
	 * @param {string} serialNumber - This is typically numeric but could potentially contain alphanumerics
	 * @param {integer} position - The position within the calibration system. Just set to zero or 1 for all non-calibration purposes
	 */
	self.notifyDeviceType = function(portName, modelNumber, serialNumber, position, reference)
	{
		try
		{
			if(!portName || !modelNumber || !serialNumber)
			{
				throw new Error('Missing parameter. You must provice port name, model number and serial number');
			}

			if(isNaN(position) || parseInt(position) < 1 || position === '' || position === null)
			{
				throw new Error('Invalid parameter. Position must be a positive integer');
			}

			//build the object required by the widget
			let deviceObject = {portName: portName, modelNumber: modelNumber, serialNumber: serialNumber, position: position, reference: reference};
			self.socket.emit('setDeviceInfo', deviceObject);
		}
		catch(err)
		{
			self.onError(err);
		}

	};

	/*
	The rest of these functions are just pass throughs to the serial widget with no manipulation beforehand
	*/
	self.setPortConfigured = function (parameters)
	{
		self.emit('portConfigured', parameters);
	};

	/**
	 * Enable or disable logging timestamps
	 * @param {bool} enable 
	 */
	self.enableLoggingTimestamps = function(enable)
	{
		self.socket.emit('enableLoggingTimestamps', enable);
	};

	self.setSerialPortList = function (parameters)
	{
		self.emit('serialPortList', parameters);
	};
	
	self.setDataReceived = function (parameters)
	{
		self.emit('dataReceived', parameters);
	};
	
	self.closePort = function(portName)
	{
		self.socket.emit('closePort', portName);
	};
	
	self.getUserName = function()
	{
		self.socket.emit('getUserName');
	};
	
	self.getComputerName = function()
	{
		self.socket.emit('getPcName');
	};
	
	self.logSystem = function(systemName, message)
	{
		self.socket.emit('logSystem', systemName, message);
	};
	
	self.logEvent = function(loggingLevel, className, methodName, message)
	{
		self.socket.emit('logEvent', loggingLevel, className, methodName, message);
	};
	
	self.setLogLevel = function(logLevel)
	{
		self.socket.emit('setLogLevel', logLevel);
	};
	
	self.setServerLogLevel = function(logLevel)
	{
		self.socket.emit('setServerLogLevel', logLevel);
	};
	
	self.getSerialPortState = function(portName)
	{
		self.socket.emit('getSerialPortState', portName);
	};
	
	self.initialize();
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
	module.exports = 
    {
    	WidgetCommunications:WidgetCommunications
    };
}
