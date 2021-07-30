'use strict';

//Reviewed 2020-01-21 (MHV) to ensure it complies with our error handling scheme
//See CalRun.js for details

//User interface elements
//when present, we can process them
//then make them go away
let deviceSelectorGroup = null;
let terminalWindowGroup = null;
let referenceConfigurator = null;
let systemConfigurator = null;
let controllerConfigurator = null;
let dataPointConfigurator = null;
let showingActionDialog = false;
let systemStatus = null;
let pumpControl = null;
let configControl = null;

//calRun object. This is the magic that does all the work
let calRun = null;

//These are possible settings that will be displayed to the user
//?: Is this where we want them?
let settingsList = ['Not Set', 'N,8', 'E,7', 'O,7'];
let formatList = ['Not Set', 'RS-232', 'RS-485', 'IM'];

//Event listeners that are attached at the time the page is loaded
//No try/catch here because the error handler is not yet loaded at this time
document.addEventListener('DOMContentLoaded', function(event)
{
	//When a user clicks on the form somewhere, need to remove the action dialog box
	window.addEventListener('click', function()
	{
		removeActionDialog();
	});

	//This prevents a user from leaving the form without acknowledging that data may be lost
	window.addEventListener('beforeunload', function(event)
	{
		event.preventDefault();

		//This line allows Chrome to work
		//Chrome will ignore anything in the return value but it is required
		//Per MDN https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
		event.returnValue = '';
	});
});

/**
 * Starts up calRun
 * This is called from index.html
 * When the form loads, it loads global objects
 * And then runs this code
 * No try/catch here because the error handler isn't loaded
 */
function initializeCalRun()
{	
	enableButtons(false);
	loadDependencies();
}

/**
 * Loads all required dependencies into the header of the file
 * which also gets them read into memory
 * No try/catch here because the error handler isn't loaded
 */
function loadDependencies()
{
	//LazyLoader updates the header of the file
	let lazyLoad = new LazyLoader();
	lazyLoad.load([
		'js/controlObjects.js',
		'js/configurationManager.js',
		// 'js/calibrationConfigurationFunctions.js',
		// 'js/calibrationParameter.js',
		// 'js/calibrationOption.js',
		// 'js/calibrationConfigurator.js',
		'js/calRun.js',
		'js/widgetCommunications.js',
		// 'js/PumpControl.js',
		'js/SystemStatus.js',
		// 'js/ConfigurationManagerDialog.js',
		// 'js/CoefficientLoader.js',
		// 'js/SCPI.js'
		// 'mocks/SCPI_Mock.js'
	], continueCalRunInitialization);
}

/**
 * Once the dependencies are loaded, then we can create the calRun object and use it
 * Unusual try/catch here because the error handler isn't loaded
 */
function continueCalRunInitialization()
{
	try
	{
		displayEvent({message: 'Initializing CalRun', level: statusLevel.Info, consoleOnly: false});

		//load the calrun object
		calRun = new CalRun(getIsDebug());

		//set the version
		document.title = calRun.softwareName + ' ' + calRun.versionNumber;
	
		addListeners();
	
		//run the initialization routine
		calRun.initialize();

		//this is the part at the top of the form
		//that shows the system status
		//really not useful until calRun is loaded
		placeSystemStatusIndicator();
	}
	catch(err)
	{
		//normally we would call calRun.onError
		//however, in this case, calRun isn't loaded so all we can do is display the error
		displayEvent({message:err.message, level:statusLevel.Error, consoleOnly:false});
	}


}

/**
 * shows a message to the user
 * @param {objcet} msg {message:'xyz', level:statusLevel.xyz, consoleOnly:[true/false]}
 */
function displayEvent(msg)
{
	//notify status is located in sbGlobal
	renderGrowl('growl', msg.message, msg.level, undefined, undefined, msg.consoleOnly)
	if(msg.level === statusLevel.Error && systemStatus !== null)
	{
		//if the system status box is loaded, then display the error count
		//!If error occurs before the cal has started, then the error count will still be incremented
		//!This could give an incorrect indication of errors during cal
		//!One example is that we will always receive a serial widget error when refreshing the page
		systemStatus.setValue('status', 'Errors', null, calRun.errorCount);
	}

}

function showConfigurationPopup(title, width, height)
{
	try
	{
		enableButtons(false);
		let pu = new sbPopUp(title, width, height);
		console.log(pu);
		pu.on('closed', function()
		{
			enableButtons(true);
		});
		pu.show();
		pu.id = title.split(' ').join('-');
		return pu;
	}
	catch(err)
	{
		onError(err);
	}
}

// FIXED: this doesn't disable the menu bar, allowing the background pop up to be displayed again over the config screen
function showConfigurationDialog()
{
	let popUp = showConfigurationPopup('Calibration Configuration', '60%', '95%');

	// Make sure latest bits are reflected in fields
	// TODO: this was being updated when making changes in the setup fields. This was causing issues in test, the test wasn't able to find the variables.
	//TODO: replace local storage call with database call
	localSettings = getLocalStorage(`${systemName}-Settings`);
	localConfig = getLocalStorage(`${systemName}-Config`);

	renderConfig(popUp.contentArea.id, databaseTabs, localSettings, localConfig);
}

/**
 * Retrieves the debug flag from the URL
 * Example: http://sbedb01:88/calrun/index.html?debug=true
 * !Must use index.html. If you try http://sbedb01:88/calrun?debug=true it will not work!
 */
function getIsDebug()
{
	try
	{
		//if using localhost, force debug
		//because this will indicate we are in development
		if(window.location.href.indexOf('localhost') > -1)
		{
			return true;
		}
		
		//returns everything from the ? onwards
		let search = window.location.search;

		//not in debug yet
		let debug = false;

		//in some browsers, it returns the question mark
		//in others it does not
		//so we need to remove the leading question mark
		if(search && search.indexOf('?') === 0)
		{
			search = search.substring(1);
		}

		//then split on any ampersand (&) characters
		//each ampersand is a search term in the URL
		let splitSearch = search.split('&');
		for(let i = 0; i < splitSearch.length; i++)
		{
			//the search term must be in the form of debug=true
			//if not, then we don't care about it
			if(splitSearch[i].indexOf('=') > -1)
			{
				//check to see if the item on the left is "debug"
				//only care if the item on the right is "true"
				//anything other than "true" on the right will return false
				let item = splitSearch[i].split('=');
				if(item[0].toLowerCase() === 'debug' && item[1].toLowerCase() === 'true')
				{
					debug = true;
				}
			}
		}
		return debug;
	}
	catch(err)
	{
		//normally we would call calRun.onError
		//however, in this case, calRun isn't loaded so all we can do is diplay the error
		displayEvent({message:err.message, level:statusLevel.Error, consoleOnly:false});
	}

}

/**
 * System status is the interface at the top of the page that shows
 * the status of the calibration system, as the name says
 */
function placeSystemStatusIndicator()
{
	try
	{
		//systemStatusObjects come from controlObjects.js
		systemStatus = new SystemStatus('systemStatusDiv', systemStatusObjects);

		//when a user clicks an item, try to process that item
		systemStatus.on('click', function(parameters)
		{
			processSystemStatusClick(parameters);
		});
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Fills the system status area with the system start values
 * These come from the configuration
 * These can potentially change over the span of the calibration
 */
function displayStartingSystemValues()
{
	try
	{
		//get the values from the configuration
		let systemStatusValues = calRun.getSystemStatusValues();

		//handle pump values
		//if not set, then set to defaults
		if(systemStatusValues.length > 0)
		{
			systemStatusValues.forEach(function(value)
			{
				switch(value.ItemName)
				{
				case 'pumpNumber':
					systemStatus.setValue('control', 'Pump Number', null, value.ItemValue);
					break;
				case 'pumpRate':
					systemStatus.setValue('control', 'Pump Rate', null, value.ItemValue);
					break;
				case 'pumpVolume':
					systemStatus.setValue('control', 'Pump Volume', null, value.ItemValue);
					break;

				}
			});
		}
		else
		{
			systemStatus.setValue('control', 'Pump Number', null, 1);
			systemStatus.setValue('control', 'Pump Rate', null, 20);
			systemStatus.setValue('control', 'Pump Volume', null, 1);
		}

		//everything else is handled here
		//!possibly we don't have enough values in here.
		//!We could potentially add Countdown, CalibrationCycles and WaitTime
		systemStatus.setValue('control', 'Flow Pump', null, 'OFF');
		systemStatus.setValue('control', 'Drain Valve', null, 'CLOSED');
		systemStatus.setValue('control', 'Fill Valve', null, 'CLOSED');
		systemStatus.setValue('control', 'Pump Running', null, 'FALSE');
		systemStatus.setValue('status', 'Configuration', null, calRun.configurationManager.currentConfigurationName);
		systemStatus.setValue('status', 'Data Point', null, 'Not started');
		systemStatus.setValue('status', 'Errors', null, 'None');
		systemStatus.setValue('status', 'Status', null, 'Waiting to start');
		systemStatus.setValue('status', 'Samples to Average', null, calRun.getConfigurationValue('system', 'Samples to average'));
		systemStatus.setValue('status', 'Wait Time', null, calRun.getConfigurationValue('system', 'Additional Wait Time Once Stable (ms)'));
		systemStatus.setValue('status', 'Calibration Cycles', null, calRun.getConfigurationValue('system', 'Number of sequential calibrations'));
		systemStatus.setValue('status', 'Countdown', null, 'Not Started');
				
	
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Display the results of the autoconnect routine
 * @param {integer} deviceID 
 * @param {integer} baudRate 
 * @param {string} settings 
 */
function displayConnectionSettings(parameters)
{
	try
	{
		deviceSelectorGroup.setValue(parameters.deviceID, 'Baud', parameters.baudRate);
		deviceSelectorGroup.setValue(parameters.deviceID, 'Settings', parameters.settings);
		if(terminalWindowGroup !== null)
		{
			terminalWindowGroup.setValue(parameters.deviceID, 'Baud', parameters.baudRate);
			terminalWindowGroup.setValue(parameters.deviceID, 'Settings', parameters.settings);
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Displays the data in the terminal window
 * blinks the green light in the device selector
 * @param {object} parameters - {index:xxxx, data:yyyy}
 */
function displayReceivedData(parameters)
{
	try
	{
		if(terminalWindowGroup !== null)
		{
			terminalWindowGroup.setDataReceived(parameters.index, parameters.data);
		}
		deviceSelectorGroup.setValue(parameters.index, 'Activity', 'good');
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Takes the configuration information and displays it in the device selector group
 * This gets filled when the program loads or when the configuration changes
 * @param {object} parameters - the big blob of all configuration data
 */
function displayDeviceInformation(parameters)
{
	try
	{
		// data should only be null if this is a new system
		if(parameters === null)
		{
			return;
		}

		for(let i = 0; i < parameters.length; i++)
		{
			if(parameters[i].ConfigurationArea === 'device')
			{
				if(parameters[i].OptionIndex < deviceSelectorGroup.quantity)
				{
					if(parameters[i].ItemName.trim() !== '')
					{
						deviceSelectorGroup.setValue(parameters[i].OptionIndex, parameters[i].ItemName, parameters[i].ItemValue);
					}
				}
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Shows the terminal window to the screen
 * The TerminalWindowGroup object lives in sbGlobalFunctions.js
 */
function displayTerminals()
{
	try
	{

		displayTerminalWindow();
		populateTerminals();
		connectTerminalEvents();
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Shows the terminal window
 */
function displayTerminalWindow()
{
	try
	{
		showPopUpDialog('Multi-Port Terminal');
		terminalWindowGroup = new TerminalWindowGroup(calRun.deviceList.length, 'containerDiv');
		terminalWindowGroup.setDeviceList(calRun.getJustModelNames(deviceTypes.Device));
		terminalWindowGroup.setPortList(calRun.portList);
		terminalWindowGroup.setBaudRates(calRun.getBaudRates());
	
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Connect events to the terminal window
 */
function connectTerminalEvents()
{
	try
	{
		if(terminalWindowGroup !== null)
		{
			terminalWindowGroup.on('keypress', function(parameters)
			{
				terminalKeyPress(parameters);
			});
			terminalWindowGroup.on('buttonclick', function(parameters)
			{
				terminalButtonClick(parameters);
			});
			terminalWindowGroup.on('valuechanged', function(parameters)
			{
				terminalValueChanged(parameters);
				parameters.id = parameters.deviceID;
				calRun.saveDeviceSettings(parameters);
			});
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}


/**
 * Copy information from the device selector group into the terminal windows
 */
function populateTerminals()
{
	try
	{
		for(let i = 0; i < deviceSelectorGroup.quantity; i++)
		{
			let portName = deviceSelectorGroup.getValue(i, 'Port');
			terminalWindowGroup.setValue(i, 'Port', portName);
			terminalWindowGroup.setValue(i, 'Device', deviceSelectorGroup.getValue(i, 'Device'));
			terminalWindowGroup.setValue(i, 'SN', deviceSelectorGroup.getValue(i, 'SN'));
			terminalWindowGroup.setValue(i, 'Firmware', deviceSelectorGroup.getValue(i, 'Firmware'));
			terminalWindowGroup.setValue(i, 'ID', deviceSelectorGroup.getValue(i, 'ID'));
			terminalWindowGroup.setValue(i, 'Baud', deviceSelectorGroup.getValue(i, 'Baud'));
			terminalWindowGroup.setValue(i, 'Settings', deviceSelectorGroup.getValue(i, 'Settings'));
			terminalWindowGroup.setValue(i, 'Format', deviceSelectorGroup.getValue(i, 'Format'));

			//check if the port is open so we can set the buttons accordingly
			if(portName !== 'Not Set')
			{
				calRun.getSerialPortState(portName);
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * hanldes the terminal button clicking
 * @param {object} parameters - information about what button was clicked
 */
function terminalButtonClick(parameters)
{
	try
	{
		if(parameters.button === 'open')
		{
			calRun.openPort(terminalWindowGroup.getValue(parameters.windowID, 'Port'), terminalWindowGroup.getValue(parameters.windowID, 'Baud'), terminalWindowGroup.getValue(parameters.windowID, 'Settings'), parameters.windowID);
		}
		if(parameters.button === 'close')
		{
			calRun.closePort(terminalWindowGroup.getValue(parameters.windowID, 'Port'), parameters.windowID);
		}
		if(parameters.button === 'wake')
		{
			calRun.wakeDevice(parameters.windowID);
		}
		if(parameters.button === 'status')
		{
			calRun.getStatus(parameters.windowID);
		}
		if(parameters.button === 'discover')
		{
			showSpinny(true);
			calRun.autoDetect(parameters.windowID);
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Puts the spinny on the screen when desired
 */
function getSpinnyDiv()
{
	try
	{
		//load the spinny
		let div = document.createElement('div');
		div.className = 'spinny';
		div.id = 'spinnyDiv';
	
		let img = document.createElement('img');
		img.src = 'images/logo-transparent.gif';
		img.style.width = '100%';
		div.appendChild(img);
	
		return div;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Displays a spinning Sea-Bird logo while long processes are occurring
 * @param {boolean} visible - true = display spinny, false = remove spinny
 */
function showSpinny(visible)
{
	try
	{
		if(visible)
		{
			//if visible = true
			//add the spinny
			document.body.appendChild(getSpinnyDiv());
		}
		else
		{
			//if visible = false
			//remove the spinny, if it is displayed
			let spinnyDiv = document.getElementById('spinnyDiv');
			if(spinnyDiv !== null)
			{
				spinnyDiv.parentElement.removeChild(spinnyDiv);
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}


/**
 * Enable or disable buttons
 * By default, this keeps the bug, calcert and stop buttons enabled
 * to disable those buttons, you need to pass the allButtons parameter
 * @param {boolean} enable
 * @param {boolean} allButtons 
 */
function enableButtons(enable, allButtons)
{
	try
	{
		document.getElementById('btnStart').disabled = !enable;
		document.getElementById('btnNext').disabled = !enable;
		document.getElementById('btnTerminal').disabled = !enable;
		// document.getElementById('btnSystem').disabled = !enable;
		// document.getElementById('btnDataPoint').disabled = !enable;
		// document.getElementById('btnReferences').disabled = !enable;
		// document.getElementById('btnControl').disabled = !enable;
		document.getElementById('btnAction').disabled = !enable;
		document.getElementById('btnConfigure').disabled = !enable;
		document.getElementById('btnClearLocalStorage').disabled = !enable;

		//when enabling buttons, always enable all buttons
		if(enable === true)
		{
			document.getElementById('btnBug').disabled = !enable;
			document.getElementById('btnCalCert').disabled = !enable;
			document.getElementById('btnStop').disabled = !enable;
		}

		//when disabling buttons, look at the allButtons parameter to
		//decide if these three buttons should be disabled
		if(enable === false && allButtons === true)
		{
			document.getElementById('btnBug').disabled = !enable;
			document.getElementById('btnCalCert').disabled = !enable;
			document.getElementById('btnStop').disabled = !enable;
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Puts the device selector group on the screen
 * @param {integer} numberDevices 
 */
function placeDeviceSelectorGroup(numberDevices)
{
	try
	{
		deviceSelectorGroup = new DeviceSelectorGroup(numberDevices);

		let deviceDiv = document.getElementById('deviceDiv');
		deviceDiv.innerHTML = '';
		deviceDiv.appendChild(deviceSelectorGroup.DeviceSelectorGroup);
		deviceSelectorGroup.setBaudList(calRun.getBaudRates());
		deviceSelectorGroup.setDeviceList(calRun.getJustModelNames(deviceTypes.Device));
		deviceSelectorGroup.setPortList(calRun.portList);
		displayDeviceInformation(calRun.configurationManager.configurationSettings);
	
		deviceSelectorGroup.on('valueChanged', function(parameters)
		{
			processDeviceSelectorGroupChanges(parameters);
		});
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Do something with the data coming from the device selector
 * @param {object} parameters - the information that has changed in the device selector
 */
function processDeviceSelectorGroupChanges(parameters)
{
	try
	{
		//prevent user from checking the 'select' checkbox if a port has not been selected
		if(parameters.optionName === 'Select' && (deviceSelectorGroup.getValue(parameters.id, 'Port') === 'Not Set' || deviceSelectorGroup.getValue(parameters.id, 'Format') == 'Not Set'))
		{
			deviceSelectorGroup.setValue(parameters.id, 'Select', false);
			calRun.logEvent(statusLevel.Warn, 'Must set both Port and Format before selecting a device', false);

			//make sure this change gets saved into the database 
			parameters.optionValue = false;
		}

		if(parameters.optionName === 'Select')
		{
			calRun.setDeviceSelected(parameters.id, parameters.optionValue);
		}
		
		//check if the port is being used by another device
		if(parameters.optionName === 'Port')
		{
			if(calRun.portInUse('device', parameters.id, parameters.optionValue))
			{
				deviceSelectorGroup.setValue(parameters.id, 'Port', 'Not Set');
				throw new Error('Port already in use: ' + parameters.optionValue);
			}
		}
		//Set the port in the device list
		if(parameters.optionName === 'Port')
		{
			calRun.setDevicePort(parameters.id, parameters.optionValue);
		}
	
		//save the changes
		calRun.saveDeviceSettings(parameters);
	
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Shows the reference configuration dialog
 */
function displayReferenceConfiguration()
{
	try
	{
		showPopUpDialog('Reference Configuration');
	
		referenceConfigurator = new CalibrationConfigurator('containerDiv', referenceObjects);
		referenceConfigurator.setListItems('Port', calRun.portList);
		referenceConfigurator.setListItems('Baud', calRun.getBaudRates());
		referenceConfigurator.setListItems('Settings', settingsList);
		referenceConfigurator.setListItems('Format', formatList);
		referenceConfigurator.setListItems('Device', calRun.getJustModelNames('ref'));
		referenceConfigurator.setListItems('Measurand', calRun.getMeasurands(), true);

		referenceConfigurator.on('valueChanged', function(parameters)
		{
			//make sure someone can't configure a port that's already in use
			if(parameters.optionName === 'Port')
			{
				if(calRun.portInUse('reference', parameters.OptionIndex, parameters.optionValue))
				{
					referenceConfigurator.setValue(parameters.OptionIndex, -1, 'Port', 'Not Set');
					throw new Error('Port already in use: ' + parameters.optionValue);
				}
			}

			//if the measurand changes, then change the sub types that are available
			if(parameters.optionName === 'Measurand')
			{
				let subTypes = calRun.getMeasurandSubTypes(parameters.optionValue);
				referenceConfigurator.setSpecificListItems(parameters.OptionIndex, parameters.ParameterIndex, 'Measurand Sub-Type', subTypes);
			}
		});

		//when the user clicks the retrieve coefficients button
		//only for use with sensors that don't respond to a DC, DCAL or GETCC command
		referenceConfigurator.on('buttonClick', function(parameters)
		{
			calRun.retrieveCoefficients(parameters.OptionIndex, 'reference');
		});

		//Load values into the configurator
		populateConfigurator(referenceConfigurator, calRun.configurationManager.configurationSettings, 'reference');
	
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Shows the controller configuration dialog
 * !This loads ALL measurands into the drop down for measurand
 * !We should possibly limit this to the measurands that are actually possible for the selected device
 */
function displayControllerConfiguration()
{
	try
	{
		showPopUpDialog('Controller Configuration');
		controllerConfigurator = new CalibrationConfigurator('containerDiv', controllerObjects);
		controllerConfigurator.setListItems('Port', calRun.portList);
		controllerConfigurator.setListItems('Baud', calRun.getBaudRates());
		controllerConfigurator.setListItems('Settings', settingsList);
		controllerConfigurator.setListItems('Format', formatList);
		controllerConfigurator.setListItems('Measurand', calRun.getMeasurands(), true);
		controllerConfigurator.setListItems('Device', calRun.getJustModelNames('ctrl'));
		controllerConfigurator.on('valueChanged', function(parameters)
		{
			//ensure someone cannot select a port that is already in use somewhere else
			if(parameters.optionName === 'Port')
			{
				if(calRun.portInUse('control', parameters.OptionIndex, parameters.optionValue))
				{
					controllerConfigurator.setValue(parameters.OptionIndex, -1, 'Port', 'Not Set');
					throw new Error('Port already in use: ' + parameters.optionValue);
				}
			}
		});

		//load values into the configurator
		populateConfigurator(controllerConfigurator, calRun.configurationManager.configurationSettings, 'control');
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * When the user clicks the Action button, a drop down menu is displayed
 * This will remove that drop-down
 */
function removeActionDialog()
{
	try
	{
		let actionDialog = document.getElementById('sbactiondiv');
		if(actionDialog !== null && showingActionDialog === false)
		{
			actionDialog.parentNode.removeChild(actionDialog);
		}
		if(showingActionDialog)
		{
			showingActionDialog = false;
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Displays a drop down list of action items relative to the button the user clicked
 * @param {*} button - This is the button the user clicked
 */
function displayActionDialog(button)
{
	try
	{
		//need to remove any existing dialog before we show it again
		removeActionDialog();
		showingActionDialog = true;

		let actionDiv = document.createElement('div');
		let bounds = button.getBoundingClientRect();
	
		actionDiv.id = 'sbactiondiv';
		actionDiv.className = 'actionDialog';
		//This places the dialog in relation to the button
		actionDiv.style.top = bounds.bottom + 'px';
		actionDiv.style.left = bounds.left + 'px';
	
		//!These are all hard-coded items. We may want them to come from the database somehow
		//Whenever a new action gets added, then you need to add one getActionItem and one getHr
		actionDiv.appendChild(getActionItem('Run Pumps', displayPumpDialog));
		actionDiv.appendChild(getHr());
		actionDiv.appendChild(getActionItem('Start Reference', startReference));
		actionDiv.appendChild(getHr());
		actionDiv.appendChild(getActionItem('Configurations', displayConfigurationManager));
	
		document.body.appendChild(actionDiv);
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Gets the horizontal line for the action dialog
 * Also activates the easter egg
 */
function getHr()
{
	try
	{
		let hr = document.createElement('hr');
		hr.style.cursor = 'pointer';
		hr.onclick = function()
		{
			 window.open('http://www.hamsterdance.org/hamsterdance/');
		};
		return hr;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/*********************************************!!!!Stopped Code Review Here 2020-01-24 *************************************/

/**
 * Gets an item for the action dialog, including all behaviors
 * @param {string} title - what will be displayed to the user
 * @param {function} callback - what function is called when the user clicks the item
 */
function getActionItem(title, callback)
{
	try
	{
		let span = document.createElement('span');
		span.innerHTML = title;
		span.style.cursor = 'pointer';

		//when the user clicks the item, run the function
		span.addEventListener('click', function(event)
		{
			if(callback && typeof callback === 'function')
			{
				callback();
			}
		});

		//when the user hovers over an item, highlight it
		span.addEventListener('mouseover', function(event)
		{
			event.srcElement.style.backgroundColor = 'DodgerBlue';
			event.srcElement.style.color = 'white';
		});
	
		//when the user moves their mouse away from an item, no longer highlight it
		span.addEventListener('mouseout', function(event)
		{
			event.srcElement.style.backgroundColor = 'transparent';
			event.srcElement.style.color = 'black';
		});
	
		return span;
	
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Start the reference logging
 * !Need to give a way to indicate which reference to start
 * ?Or maybe start all references?
 * Currently the code in calRun starts the first reference in the list
 */
function startReference()
{
	calRun.startReference();
}

/**
 * Show the configuration manager to the user
 */
function displayConfigurationManager()
{
	try
	{
		//disable buttons while the configuration manager is displayed
		showPopUpDialog('Configuration Manager', '460px', '250px');
		configControl = new ConfigurationManagerDialog('containerDiv');
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Show the pump control dialog
 */
function displayPumpDialog()
{
	try
	{
		//display the dialog
		showPopUpDialog('Pump Control', '250px', '130px');
		pumpControl = new PumpControl('containerDiv');

		//when the user clicks the one and only button
		pumpControl.on('buttonclick', function(parameters)
		{
			//show the values on the main form
			displayPumpValues(parameters);

			//run the pump
			var pumpControllerDelay = 100;
			if(!calRun.pumpControllerConfigured)
			{
				pumpControllerDelay = 2000;
			}
			calRun.configurePumpController();

			//this timeout is to allow the port to open if it's not open
			setTimeout(function()
			{
				calRun.runPumpController(parameters.pumpNumber, parameters.pumpRate, parameters.pumpVolume);
			}, pumpControllerDelay);
		});
		
		//display the pump control values on the form
		let systemStatusValues = calRun.getSystemStatusValues();
		let pumpControlValues = [];
		if(systemStatusValues.length > 0)
		{
			systemStatusValues.forEach(function(value)
			{
				switch(value.ItemName)
				{
				case 'pumpNumber':
					pumpControlValues.pumpNumber = value.ItemValue;
					break;
				case 'pumpRate':
					pumpControlValues.pumpRate = value.ItemValue;
					break;
				case 'pumpVolume':
					pumpControlValues.pumpVolume = value.ItemValue;
					break;	
				}
			});
		}
		else
		{
			//if no values are stored, then use default values
			pumpControlValues.pumpNumber = 1;
			pumpControlValues.pumpRate = 20;
			pumpControlValues.pumpVolume = 1;
		}
	
		pumpControl.setValues(pumpControlValues);
	
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * Display the pump control settings on the form
 * @param {object} parameters {pumpNumber:1, pumpRate:20, pumpVolume:1}
 */
function displayPumpValues(parameters)
{
	try
	{
		systemStatus.setValue('control', 'Pump Number', null, parameters.pumpNumber);
		systemStatus.setValue('control', 'Pump Rate', null, parameters.pumpRate);
		systemStatus.setValue('control', 'Pump Volume', null, parameters.pumpVolume);
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * If the user clicks an item in the status area
 * check to see if it's something that is clickable
 * then perform whatever task it is supposed to perform
 * @param {string} parameters - the text of an item that was clicked
 */
function processSystemStatusClick(parameters)
{
	try
	{
		switch(parameters)
		{
		case 'Pump Number': case 'Pump Rate': case 'Pump Volume':
			//if the user is attempting to change the peristaltic pump setup
			displayPumpDialog();
			break;
		case 'Pump Running':
			//if the user clicks on "pump running" then run the chosen peristaltic pump with the rate & volume in the UI.
			let pumpNumber = systemStatus.getValue('control', 'Pump Number');
			let pumpRate = systemStatus.getValue('control', 'Pump Rate');
			let pumpVolume = systemStatus.getValue('control', 'Pump Volume');
			//check to make sure there are valid values in the pump control UI
			if(!isNaN(pumpNumber) && !isNaN(pumpRate) && !isNaN(pumpVolume))
			{
				var pumpControllerDelay = 100;
				//check to see if the pump controller has been configured (comm port, baud rate, protocol, etc.)
				if(!calRun.pumpControllerConfigured)
				{
					pumpControllerDelay = 2000;
				}
				//configure the pump controller using the settings in the Contol tab
				calRun.configurePumpController();
				//run the chosen pump, at the chosen rate & volume
				setTimeout(function()
				{
					calRun.runPumpController(pumpNumber, pumpRate, pumpVolume);
				}, pumpControllerDelay);
			}
			break;
		case 'Flow Pump':
			var pumpControllerDelay = 100;
			//check if the circulation pump is configured
			if(!calRun.pumpControllerConfigured)
			{
				pumpControllerDelay = 2000;
			}
			//configure the pump controller using the settings in the Control tab
			calRun.configurePumpController();
			//get the current status for the pump
			let pumpOnOff = systemStatus.getValue('control', 'Flow Pump');
			//toggle between ON / OFF, if it's currently set to OFF, turn on the pump & vs-versa
			if(pumpOnOff.toLowerCase() === 'on')
			{
				calRun.activateFlowPump(false);
			}
			else 
			{
				calRun.activateFlowPump(true);
			}			
			break;
		case 'Drain Valve':
			//get an object for the controller relays
			let drainValve = calRun.getRelayActivationConfiguration();
			var pumpControllerDelay = 100;
			//check to see if the valve controller (same as the pump controller) has been configured
			if(!calRun.pumpControllerConfigured)
			{
				pumpControllerDelay = 2000;
			}
			//configure the valve controller
			calRun.configurePumpController();
			//get the current status of the valve in the UI
			let drainOnOff = systemStatus.getValue('control', 'Drain Valve');
			//toggle between OPEN / CLOSED, if it's currently CLOSED, open the valve, or vs-versa
			if(drainOnOff.toLowerCase() === 'closed')
			{
				calRun.activateRelay(drainValve.portName, drainValve['Drain relay'], true);
				calRun.emit('drainValveActivated', true);
			}
			else 
			{
				calRun.activateRelay(drainValve.portName, drainValve['Drain relay'], false);
				calRun.emit('drainValveActivated', false);
			}
			break;
		case 'Fill Valve':
			//almost identical to the drain valve above.
			let fillValve = calRun.getRelayActivationConfiguration();
			var pumpControllerDelay = 100;
			if(!calRun.pumpControllerConfigured)
			{
				pumpControllerDelay = 2000;
			}
			calRun.configurePumpController();
			let fillOnOff = systemStatus.getValue('control', 'Fill Valve');
			if(fillOnOff.toLowerCase() === 'closed')
			{
				calRun.activateRelay(fillValve.portName, fillValve['Fill relay'], true);
				calRun.emit('fillValveActivated', true);
			}
			else 
			{
				calRun.activateRelay(fillValve.portName, fillValve['Fill relay'], false);
				calRun.emit('fillValveActivated', false);
			}
			break;
		default:
			//do nothing in any other case
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * This is the main empty part of the screen
 * We have filled it with a div that simply lets the user
 * know the status of the calibration at the end
 * If a calibration ends early for any reason, this is a failure
 * @param {boolean} success status of calibration completion
 */
function notifyCalibrationComplete(success)
{
	try
	{
		//get the holder for the text
		let notifyCalDiv = document.getElementById('notifyCalibration');

		//if successful, then it will be green
		if(success === true)
		{
			notifyCalDiv.innerHTML = 'Calibration Successful';
			notifyCalDiv.className = 'calibrationSuccess';
		}
		else
		{
			//if not successful, then it will be red
			notifyCalDiv.innerHTML = 'Calibration Ended with Errors';
			notifyCalDiv.className = 'calibrationFailure';
		}
		systemStatus.setValue('status', 'Data Point', null, 'Ended');
		systemStatus.setValue('status', 'Status', null, 'Ended');
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the calibration starts, fill the main, empty part of the screen
 * This makes the user happy
 */
function notifyCalibrationStarted()
{
	try
	{
		//once the cal starts, place text in the middle of the screen
		let notifyCalDiv = document.getElementById('notifyCalibration');
		notifyCalDiv.innerHTML = 'Calibration In Progress';
		//this makes the text black
		notifyCalDiv.className = 'calibrationNeutral';
		//Also, place some text in the status area at the top of the page
		systemStatus.setValue('status', 'Status', null, 'Running');
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Show the data point configuration dialog
 */
function displayDataPointSetup()
{
	try
	{
		//get the dialog box
		showPopUpDialog('Data Point Configuration');
		dataPointConfigurator = new CalibrationConfigurator('containerDiv', dataPointObjects);
		
		//when a value changes, process that value
		dataPointConfigurator.on('valueChanged', function(parameters)
		{
			processDataPointValue(parameters);
		});

		//fill the dialog with data point information
		populateConfigurator(dataPointConfigurator, calRun.configurationManager.configurationSettings, 'dataPoint');
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * When the user selects something, then change other options based on the selected item
 * This is a function that works as a trickle-down filter
 * @param {Object} parameters - what the user selected
 */
function processDataPointValue(parameters)
{
	try
	{
		//if the user selects device type (reference or system)
		//then load all the models found under that device type
		if(parameters.optionName === 'Device Type')
		{
			dataPointConfigurator.setSpecificListItems(parameters.OptionIndex, parameters.ParameterIndex, 'Model', calRun.getModelsForDataPoints(parameters.optionValue.toLowerCase()));
			return;
		}
	
		//if the user selects model, then load all the serial numbers for that type of model and device type
		if(parameters.optionName === 'Model')
		{
			let deviceType = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Device Type');
			let snList = calRun.getSnForDataPoints(deviceType, parameters.optionValue);
			dataPointConfigurator.setSpecificListItems(parameters.OptionIndex, parameters.ParameterIndex, 'SN', snList);
			return;
		}
	
		//if the user selects serial number
		//load all the possible measurands for that specific serial number
		if(parameters.optionName === 'SN')
		{
			//get measurands
			let deviceType = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Device Type');
			let modelNumber = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Model');
			let serialNumber = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'SN');
			let measurandList = calRun.getMeasurandsForDataPoints(deviceType, modelNumber, serialNumber);
			dataPointConfigurator.setSpecificListItems(parameters.OptionIndex, parameters.ParameterIndex, 'Measurand', measurandList);
			return;
		}

		//if the user selects measurand, then show all the sub-types for that measurand
		if(parameters.optionName === 'Measurand')
		{
			//get sub-types
			let deviceType = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Device Type');
			if(deviceType !== 'Reference')
			{
				return;
			}
			let modelNumber = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Model');
			let serialNumber = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'SN');
			let measurand = dataPointConfigurator.getValue(parameters.OptionIndex, parameters.ParameterIndex, 'Measurand');
			let measurandList = calRun.getMeasurandSubTypesForDataPoints(modelNumber, serialNumber, measurand);
			dataPointConfigurator.setSpecificListItems(parameters.OptionIndex, parameters.ParameterIndex, 'Measurand Sub-Type', measurandList);
			return;
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

function populateControlObject(config) {
	// TODO: settings from local storage / database synced already
	if (!config || !localSettings) {
		console.error('Cannot populate control object, local settings are not retrieved from database or not in system storage.');
		renderGrowl('growl', 'Cannot populate control object and cannot continue calibration.', 'danger');
		enableButtons(false);
		return;
	}
	localSettings.forEach((el, index) => {
		el.index = index;
	});

	databaseTabs.forEach((el, index) => {
		let controlSettings = localSettings.filter((a, b) => a.ConfigurationArea === el.ConfigurationArea);

		controlSettings.forEach((el) => {
			let copiedObject = JSON.parse(JSON.stringify(config[`_${el.ConfigurationArea}`]));

			let index = el.ParameterIndex === "-1" ? 0 : 1;

			copiedObject[index].controls.forEach((row, i) => {
				if (row.label === el.ItemName) {
					config[`_${el.ConfigurationArea}`][index].controls[i].value = el.ItemValue;
					config[`_${el.ConfigurationArea}`][index].controls[i].settingIndex = el.index;
					if (row.label === 'Port') {
						config[`_${el.ConfigurationArea}`][index].controls[i].list = calRun.portList;
					}
				}
				// const setSerialList = (serialList, configIndex, rowIndex) => 


			});
		});

	});
	// DONE: need to filter settings object for each area then take settings and map to the control object
	
	// TODO: Need to appropriately update list options from database  (devices, cal locations, etc)

	// TODO: Need to appropriately update serial port list options from Serial Widget
	
	return config;
}

/**
 * Show the overall system configuration dialog
 */
function displaySystemConfiguration()
{
	try
	{
		//show the dialog
		showPopUpDialog('System Configuration');

		//get the configurator
		systemConfigurator = new CalibrationConfigurator('containerDiv', systemObjects);
		systemConfigurator.setListItems('Calibration System Type', calRun.getSystemTypes());
		systemConfigurator.setListItems('Calibration System Location', calRun.getCalibrationLocations());
		systemConfigurator.setListItems('Device', calRun.getJustModelNames('dut', true), true);

		//when the user changes a value, then process that change
		systemConfigurator.on('valueChanged', function(parameters)
		{
			//when the user changes the system type, show the devices that can be calibrated
			if(parameters.optionName === 'Calibration System Type')
			{
				let calibratableModels = calRun.getModelBySystemType(parameters.optionValue);
				systemConfigurator.calibrationOptions[0].clearParameters();
				for(let i = 0; i < calibratableModels.length; i++)
				{
					systemConfigurator.calibrationOptions[0].addParameter();
					systemConfigurator.calibrationOptions[0].setValue('Device', calibratableModels[i], i);
				}
			}
		});
	
		//load the configuration into the configurator
		populateConfigurator(systemConfigurator, calRun.configurationManager.configurationSettings, 'system');
	
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Returns the correct control object so the dialogs can be populated correctly
 * This comes from controlObjects.js
 * Contains the definition for which controls will be displayed
 * @param {string} ConfigurationArea 
 */
function getCorrectControlObject(ConfigurationArea)
{
	try
	{
		switch(ConfigurationArea)
		{
		case 'system':
			return systemObjects;
		case 'control':
			return controllerObjects;
		case 'dataPoint':
			return dataPointObjects;
		case 'reference':
			return referenceObjects;
		default:
			throw new TypeError('Invalid configuration area');
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Takes the saved configuration settings from the calRun object
 * and puts them in the correct dialog box so the user can
 * see what was selected
 * @param {object} configurator - the dialog itself
 * @param {object} values - all configuration values
 * @param {string} ConfigurationArea - which configuration dialog?
 */
function populateConfigurator(configurator, values, ConfigurationArea)
{
	try
	{
		//iterate through all the values
		for(let i = 0; i < values.length; i++)
		{
			//get the ones for the configuration area being displayed
			if(values[i].ConfigurationArea === ConfigurationArea)
			{
				//add new options to the configurator
				if(values[i].OptionIndex >= configurator.optionCount)
				{
					configurator.addCalibrationOption(getCorrectControlObject(ConfigurationArea));
				}
	
				//add sub-items to the configurator
				if(values[i].ParameterIndex >= configurator.calibrationOptions[values[i].OptionIndex].parameterCount)
				{
					configurator.calibrationOptions[values[i].OptionIndex].addParameter();
				}
		
				//display the selected values from the database
				configurator.setValue(values[i].OptionIndex, values[i].ParameterIndex, values[i].ItemName, values[i].ItemValue);
		
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the user changes which configuration they are using
 * from the configuration selection dialog
 * then need to change that value in the configuration manager
 * and recall all the settings
 */
function processConfigSelection()
{
	try
	{
		let currentConfig = configControl.getValue('Current');
		if(currentConfig !== calRun.configurationManager.currentConfigurationName)
		{
			//need to recall the settings for the newly selected configuration
			
			calRun.configurationManager.setCurrentConfigurationByName(calRun.systemID, currentConfig);
	
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the user closes the pump dialog box
 * Save the settings
 */
function processPumpValues()
{
	try
	{
		//get the values from the pump dialog
		let pumpValues = pumpControl.getValues();

		//push the settings into a correctly formatted object
		let configurationSettings = [];
		let keys = Object.keys(pumpValues);
		for(let i = 0; i < keys.length; i++)
		{
			configurationSettings.push(
				{
					ConfigurationArea: 'pump',
					OptionIndex: 0,
					ParameterIndex: -1,
					ItemName: keys[i],
					ItemValue: pumpValues[keys[i]]
				}
			);
		}

		//save the settings
		calRun.saveSettings(configurationSettings);

		//put the values into the main form
		displayPumpValues(pumpValues);

		//get rid of the dialog box from memory
		pumpControl = null;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * This is how the settings get from the dialog into calRun and then into the database
 * Pulls information from the dialog and puts it into a form that calRun can use
 * Each option is then saved into a properly formatted object
 * That will be pushed to the CalRun object and then saved to the database
 * @param {object} configurator 
 * @param {object} controlObject 
 * @param {string} ConfigurationArea 
 */
function processConfiguratorValues(configurator, controlObject, ConfigurationArea)
{
	try
	{
		let configurationSettings = [];
		//first get the top level options
		for(let i = 0; i < configurator.optionCount; i++)
		{
			for(let j = 0; j < controlObject[0].controls.length; j++)
			{
				if(controlObject[0].controls[j].type !== 'button')
				{
					configurationSettings.push(
						{
							ConfigurationArea: ConfigurationArea,
							OptionIndex: i,
							ParameterIndex: -1,
							ItemName: controlObject[0].controls[j].label,
							ItemValue: configurator.getValue(i, -1, controlObject[0].controls[j].label)
						}
					);
				}
			}
	
			//then get any parameters associated with those options
			for(let k = 0; k < configurator.calibrationOptions[i].parameters.length; k++)
			{
				for(let j = 0; j < controlObject[1].controls.length; j++)
				{
					if(controlObject[1].controls[j].type !== 'button')
					{
						configurationSettings.push(
							{
								ConfigurationArea: ConfigurationArea,
								OptionIndex: i,
								ParameterIndex: k,
								ItemName: controlObject[1].controls[j].label,
								ItemValue: configurator.getValue(i, k, controlObject[1].controls[j].label)
							}
						);
					}
				}
			}
		}
	
		//save the settings to the database
		calRun.saveSettings(configurationSettings);
	
		//remove the dialog box from memory.
		//It has already been removed from the DOM
		configurator = null;
	
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Link between the dialog box that was displayed and the save process
 * Since we don't know specifically which dialog was displayed
 * We have to check and see what is left in memory and use that one
 * !Potential Issue: If, for some reason, more than one dialog is displayed, which shouldn't happen
 * !Then more than one option would be triggered. This may or may not be an actual issue
 * !As long as we keep the memory clear of extra dialogs and only allow one at a time
 * !This is done by disabling the buttons when a dialog is visible
 */
function processConfigurators()
{
	try
	{
		//system settings
		if(systemConfigurator !== null)
		{
			processConfiguratorValues(systemConfigurator, getCorrectControlObject('system'), 'system');
		}
	
		//control settings
		if(controllerConfigurator !== null)
		{
			processConfiguratorValues(controllerConfigurator, getCorrectControlObject('control'), 'control');
		}
	
		//reference settings
		if(referenceConfigurator !== null)
		{
			processConfiguratorValues(referenceConfigurator, getCorrectControlObject('reference'), 'reference');
		}
	
		//data point setup
		if(dataPointConfigurator !== null)
		{
			processConfiguratorValues(dataPointConfigurator, getCorrectControlObject('dataPoint'), 'dataPoint');
		}

		//pump controller
		if(pumpControl !== null)
		{
			processPumpValues();
		}

		//configuration manager dialog
		if(configControl !== null)
		{
			processConfigSelection();
		}
	
		//terminal windows
		//since all terminal values are handled real-time,
		//we don't need to handle them when the dialog closes
		//just make sure it is out of memory
		terminalWindowGroup = null;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * This is how the dialog box is created
 * CSS classes are contained in css/calRunWeb.css
 * @param {string} title - the title to be displayed in the dialog box
 * @param {string} width - (optional) must be an acceptable css width value
 * @param {height} height - (optional) must be an acceptable css height value
 */
function showPopUpDialog(title, width, height)
{
	try
	{
		//when the pop up dialog is displayed, disable all the buttons
		//A few are still enabled such as the bug report
		enableButtons(false);

		//create a div to hold the dialog box
		let div = document.createElement('div');
		div.id = 'popupDiv';

		//don't fill the whole page
		div.style.width = '90%';
		div.style.height = '90%';

		//if a size was specified, use that size
		if(width)
		{
			div.style.width = width;
		}

		if(height)
		{
			div.style.height = height;
		}

		//title row
		let table = document.createElement('table');
		table.classList.add('popupTable');

		let row = table.insertRow();
		row.classList.add('popupTitleRow');

		let titleCell = row.insertCell();
		titleCell.classList.add('popupTitleCell');
		titleCell.id = 'popupDivTitle';

		//since there are two columns, centering the column doesn't actually
		//center the title on the dialog. We have to make the title slightly longer
		//for it to actually be centered. Adding &nbsp; (non-breaking space) 
		//achieves this goal and thus the title looks centered in the form
		if(title)
		{
			for(let i = 0; i < 12; i++)
			{
				title = '&nbsp;' + title;
			}
			titleCell.innerHTML = title;
		}

		//cell that contains a button that looks like the Windows form close button
		let cell = row.insertCell();
		cell.classList.add('popupCloseButton');

		//when the user clicks the close button
		//remove the dialog
		//the option will still be in memory though
		//so it can be processed
		let btnClose = document.createElement('img');
		btnClose.src = 'images/Close.png';
		btnClose.style.cursor = 'pointer';
		btnClose.addEventListener('click', function()
		{
			div.parentNode.removeChild(div);

			//save any information
			processConfigurators();

			//enable all the buttons
			enableButtons(true);
		});

		cell.appendChild(btnClose);

		//content area
		row = table.insertRow();
		row.classList.add('popupContentRow');

		cell = row.insertCell();
		cell.classList.add('popupContentCell');
		cell.setAttribute('colspan', '2');


		let div2 = document.createElement('div');

		//container div is the magic div
		//that holds any dialog boxes
		div2.id = 'containerDiv';
		cell.appendChild(div2);

		div.appendChild(table);
		document.body.appendChild(div);

		//we don't currently use this return value for anything
		//but we might use it for testing in the future
		return div;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the port is reported to be open, then show it as open in the terminal window
 * @param {object} parameters 
 */
function setPortActive(parameters)
{
	try
	{
		//if the terminal window group is displayed
		if(terminalWindowGroup !== null)
		{
			//iterate through the ports
			for(let i = 0; i < terminalWindowGroup.quantity; i++)
			{
				//find the specified port
				let twPort = terminalWindowGroup.getValue(i, 'Port');
				if(twPort === parameters[1].portName)
				{
					//set it as open
					//This will just disable the "open" button
					terminalWindowGroup.setConnected(i, true);
					return;
				}
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the user presses a key in the terminal window
 * Send that on to the device connected to that port
 * @param {object} parameters 
 */
function terminalKeyPress(parameters)
{
	try
	{
		//figure out what port had the key pressed
		let portName = terminalWindowGroup.getValue(parameters.windowID, 'Port');
		let key = parameters.event.key;
	
		//using "Enter" because the key code is only chr(13)
		//If we capture chr(13) then we might accidentally send an additional line feed by adding chr(10) to it.
		if(key === 'Enter')
		{
			key = '\r\n';
		}
	
		//only process the key up event and not the down or press events
		if(parameters.event.type === 'keyup')
		{
			key = String.fromCharCode(parameters.event.keyCode);
		}
	
		//if the port is set to something, attempt to send out the port
		//TODO: Need to check if the port is open first.
		//!This causes exceptions in the serial widget. These exceptions are
		//!Not being displayed in the user interface
		if(portName !== 'Not Set' )
		{
			calRun.sendCommand(portName, key, false);
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When a value is changed in the terminal window, change the value in the device selector
 * and save the change
 * @param {object} parameters 
 */
function terminalValueChanged(parameters)
{
	try
	{
		//set the value of the corresponding item
		deviceSelectorGroup.setValue(parameters.deviceID, parameters.optionName, parameters.optionValue);

		//send the device type to the serial widget for logging
		if(parameters.optionName === 'Device' || parameters.optionName === 'SN')
		{
			let portName = deviceSelectorGroup.getValue(parameters.deviceID, 'Port');
			let modelNumber = deviceSelectorGroup.getValue(parameters.deviceID, 'Device');
			let serialNumber = deviceSelectorGroup.getValue(parameters.deviceID, 'SN');
		
			calRun.setDeviceType(parameters.deviceID, portName, modelNumber, serialNumber);
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When calRun indicates a port is closed, show it on the terminal window
 * @param {object} parameters 
 */
function closePort(parameters)
{
	try
	{
		if(terminalWindowGroup !== null)
		{
			terminalWindowGroup.setConnected(parameters.deviceID, false);
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}

}

/**
 * When the model, serial number or firmware changes, then update the user interface
 * this is triggered by a change coming from the calRun object
 * @param {object} parameters 
 */
function udateDeviceIdentity(parameters)
{
	try
	{
		//only handle model, sn and firmware
		if(parameters.optionName === 'Device' || parameters.optionName === 'SN' || parameters.optionName === 'Firmware')
		{
			//set the device selector value
			deviceSelectorGroup.setValue(parameters.deviceID, parameters.optionName, parameters.optionValue);

			//if the terminal window is open, then most likely this came because 
			//the user clicked "status" in the terminal window
			//in that case, update the terminal as well
			if(terminalWindowGroup !== null)
			{
				terminalWindowGroup.setValue(parameters.deviceID, parameters.optionName, parameters.optionValue);
			}
		}
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Turns the activity light green or red
 * This is just a comfort to the user so they know something is happening
 * 
 * @param {object} parameters {deviceID:xxxx, state:{'good' | 'bad'}}
 */
function setActivity(parameters)
{
	try
	{
		//as a side note, in the device selector group
		//the activity light is set to turn neutral after a few milliseconds
		//to give it the appearance of blinking
		deviceSelectorGroup.setValue(parameters.index, 'activity', parameters.state);
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the calibration system is used for the first time
 * ask the user to give the system a name
 */
function promptForSystemName()
{
	try
	{
		//no buttons at all can be enabled
		//including the bug buttons
		enableButtons(false, true);

		//custom system name pop up
		//this builds the dialog box for the system name
		let div = document.createElement('div');
		div.id = 'systemNameDiv';

		let table = document.createElement('table');
		table.style.width = '100%';
		table.style.border = 'none';

		let row = table.insertRow();
		let cell = row.insertCell();
		cell.className = 'systemNameCell';
		cell.innerHTML = 'This is new system. It doesn\'t have a name.<br/>What would you like to call it?<br/>Please enter a system name below.<br/>You can pick anything you like at all.<br/>Please try to make the name unique.<br/>So people will know which computer this is.';

		row = table.insertRow();
		cell = row.insertCell();
		cell.style.textAlign = 'center';
		let txtBox = document.createElement('input');
		txtBox.type = 'text';
		txtBox.id = 'systemNameText';
		txtBox.size = 20;
		txtBox.className = 'systemNameText';

		cell.appendChild(txtBox);

		row = table.insertRow();
		cell = row.insertCell();
		cell.style.textAlign = 'center';

		let btn = document.createElement('button');
		btn.id = 'btnSetName';
		btn.innerHTML = 'Set Name';
		btn.className = 'systemNameButton';

		//when the user clicks the button
		btn.onclick = function(event)
		{
			//save the new system name
			//if the name is not valid or could not be saved
			//then the dialog remains displayed
			if (processInitialSystemName() === true)
			{
				//remove the dialog box
				div.parentElement.removeChild(div);
				enableButtons(true);
			}
		};

		//if the user presses Enter, process the new name as above
		txtBox.onkeydown = function(event)
		{
			if(event.keyCode === 13)
			{
				event.preventDefault();
				if (processInitialSystemName() === true)
				{
					div.parentElement.removeChild(div);
					enableButtons(true);
				}
			}
		};

		cell.appendChild(btn);

		div.appendChild(table);


		document.body.appendChild(div);

		//set focus to the system name textbox
		txtBox.focus();


	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * When the user enters the system name for the first time
 * Need to set it in the database and display on the form
 */
function processInitialSystemName()
{
	try
	{
		//get the text box from the dialog
		let systemNameText = document.getElementById('systemNameText');

		//cannot process a blank name
		//anything else is fine
		if(systemNameText.value !== '')
		{
			calRun.updateSystemName(systemNameText.value);
			return true;
		}
		return false;
	}
	catch(err)
	{
		calRun.onError(err);
	}
}

/**
 * Adds listeners for various events in the U/I and in the calRun object
 */
function addListeners()
{
	try
	{
		//when we have discovered what measurands the reference has
		//update the main form to show those
		calRun.on('referenceParametersChanged', function(parameters)
		{
			systemStatus.ReferenceArea.clearRows();
			systemStatus.ReferenceArea.addRows(parameters);
		});

		//when the system name has been recalled
		calRun.on('systemName', function(parameters)
		{
			//if no name, then ask the user for one
			if(parameters === false)
			{
				promptForSystemName();
			}
			else
			{
				document.getElementById('systemName').innerText = parameters;
			}
		});

		//when moving to the next data point
		calRun.on('changingDataPoint', function(parameters)
		{
			systemStatus.setValue('status', 'Data Point', null, parameters);
		});

		//when calRun is initialized
		calRun.on('initializationComplete', function()
		{
			enableButtons(true);
		});

		//when the settings have been retrieved from the database
		calRun.on('settingsRetrieved', function()
		{
			displayStartingSystemValues();
		});
	
		//when the number of devices to be calibrated has changed
		calRun.on('maxDevicesChanged', function(numberDevices)
		{
			//update the device selector group
			placeDeviceSelectorGroup(numberDevices);
		});

		//When the current state of the calibration has changed
		calRun.on('updateStatus', function(message)
		{
			systemStatus.setValue('status', 'Status', null, message);
		});
		
		//when something happens within the calRun object
		//that the user should be notified about
		calRun.on('eventOccurred', function(msg)
		{
			displayEvent(msg);
		});

		//when the auto-connect routine has changed connection settings
		//NOTE: This does NOT indicate a successful connection
		//Just that the settings for the serial port have changed
		calRun.on('connectionSettingsChanged', function(parameters)
		{
			displayConnectionSettings(parameters);
		});

		//When data is received from a device
		calRun.on('dataReceived', function(parameters)
		{
			displayReceivedData(parameters);
		});

		//When the device has been discovered
		//This could contain serial port information
		//But that was already processed by 'connectionSettingsChanged'
		calRun.on('deviceSettingChanged', function(parameters)
		{
			udateDeviceIdentity(parameters);
		});

		//when the port is configured (opened)
		calRun.on('portConfigured', function(parameters)
		{
			setPortActive(parameters);
		});

		//when the port is closed
		calRun.on('portClosed', function(parameters)
		{
			closePort(parameters);
		});

		//when a calibration starts
		calRun.on('calibrationStarted', function()
		{
			enableButtons(false);
			showSpinny(true);
			notifyCalibrationStarted();
		});

		//when the system is busy
		calRun.on('systemBusy', function(parameters)
		{
			showSpinny(parameters);
		});

		//calRun can request the buttons to be enabled or disabled
		calRun.on('allowUserInput', function(parameters)
		{
			enableButtons(parameters);
		});

		//when a calibration has eneded
		//it may have ended for a variety of reasons
		//But there is only a true/false success/failure
		//indication
		calRun.on('calibrationEnded', function(parameters)
		{
			enableButtons(true);
			showSpinny(false);
			notifyCalibrationComplete(parameters);
		});

		//When the coefficients are retrieved from a file
		//This is only useful for items that do not self-identify
		//Also, this is only for reference sensors
		//If a sensor self-identifies, then any manually set 
		//coefficients will be ignored
		calRun.on('coefficientsRetrieved', function(parameters)
		{
			//populate the reference dialog if displayed
			if(referenceConfigurator !== null)
			{
				for(let i = 0; i < referenceConfigurator.optionCount; i++)
				{
					if(referenceConfigurator.getValue(i, -1, 'Device') === parameters.modelNumber && referenceConfigurator.getValue(i, -1, 'SN') === parameters.serialNumber)
					{
						referenceConfigurator.setValue(i, 0, 'Cal date', parameters.calDate);
						referenceConfigurator.setValue(i, 0, 'Coefficients', parameters.coefficients);
					}
				}
			}
		});

		//When the reference takes a sample
		//it will return a snapshot of the previous x (sample window) samples
		//display this to the user
		calRun.on('referenceUpdate', function(parameters)
		{
			systemStatus.setValue('reference', parameters.parameter, 'Converted', parameters.converted.toFixed(4));
			systemStatus.setValue('reference', parameters.parameter, 'Raw', parameters.raw);
			systemStatus.setValue('reference', parameters.parameter, 'COV', parameters.cov.toFixed(4));
			systemStatus.setValue('reference', parameters.parameter, 'Stable', parameters.stable);
			systemStatus.setValue('reference', parameters.parameter, 'Units', parameters.units);
		});

		//when the drain valve has been activated or deactiviated
		//display this to the user
		calRun.on('drainValveActivated', function(parameters)
		{
			let onoff = 'OPEN';
			if(parameters === false)
			{
				onoff = 'CLOSED';
			}
			systemStatus.setValue('control', 'Drain Valve', null, onoff);
		});

		//when the fill valve has been activated or deactivated
		//display this to the user
		calRun.on('fillValveActivated', function(parameters)
		{
			let onoff = 'OPEN';
			if(parameters === false)
			{
				onoff = 'CLOSED';
			}
			systemStatus.setValue('control', 'Fill Valve', null, onoff);
		});

		//when the flow pump has been activated or deactivated
		//display this to the user
		calRun.on('flowPumpActivated', function(parameters)
		{
			let onoff = 'ON';
			if(parameters === false)
			{
				onoff = 'OFF';
			}
			systemStatus.setValue('control', 'Flow Pump', null, onoff);
		});

		//when a relay is activated, display that information to the user
		calRun.on('relayActivated', function(parameters)
		{
			systemStatus.setValue('control', 'Pump Running', null, 'TRUE');
			systemStatus.setValue('control', 'Pump Number', null, parameters.relayNumber);
			systemStatus.setValue('control', 'Pump Volume', null, parameters.volume);
			systemStatus.setValue('control', 'Pump Rate', null, parameters.rate);

			//divide the rate by the volume and multiply the result by 1000 to get milliseconds
			//EG:  ((22ml / min)/2ml) * 1000 = 11k ms or 11 seconds to display the pump running true flag
			setTimeout(function()
			{
				systemStatus.setValue('control', 'Pump Running', null, 'FALSE');
			}, (parameters.rate / parameters.volume) * 1000);
		});

		//Any extra information we want displayed about a device
		//during a calibration.
		//This goes into the Info field
		calRun.on('deviceInfo', function(parameters)
		{
			let deviceInfo = '';
			Object.keys(parameters).forEach(function(key)
			{
				if(key !== 'deviceID')
				{
					if(deviceInfo !== '')
					{
						deviceInfo += '<br/>';
					}
					deviceInfo += key + ' = ' + parameters[key];
				}
			});

			deviceSelectorGroup.setValue(parameters.deviceID, 'Info', deviceInfo);
		});

		//when the system is set to debug
		//turn the screen salmon colored
		calRun.on('notifyDebug', function(parameters)
		{
			if(parameters === true)
			{
				document.body.style.background = '#ffb3b3';
			}
		});

		//when the serial port reports it's state
		calRun.on('serialPortState', function(parameters)
		{
			//this tells the terminal window to set the open and close buttons appropriately
			for(let i = 0; i < terminalWindowGroup.quantity; i++)
			{
				let twPort = terminalWindowGroup.getValue(i, 'Port');
				if(twPort === parameters.portName)
				{
					terminalWindowGroup.setConnected(i, parameters.isOpen);
				}
			}
		});

		//when the countdown display needs to be updated
		calRun.on('countdown', function(data)
		{
			systemStatus.setValue('status', 'Countdown', null, data);
		});
			
		// hook up a listener to the Bug button
		document.getElementById('btnBug').addEventListener('click', function() 
		{
			window.open('https://docs.google.com/forms/d/e/1FAIpQLSehXNiNhXqgp8dJZL-sAgB7DvEzY2XDOTbdyvLf5KI_5YdOcQ/viewform');
		});
	
		//display the terminal window
		document.getElementById('btnTerminal').addEventListener('click', function()
		{
			displayTerminals();
		});
	
		// //display the system configuration dialog
		// document.getElementById('btnSystem').addEventListener('click', function()
		// {
		// 	displaySystemConfiguration();
		// });
	
		// //display the data point configuration dialog
		// document.getElementById('btnDataPoint').addEventListener('click', function()
		// {
		// 	displayDataPointSetup();
		// });
	
		//start the calibration
		document.getElementById('btnStart').addEventListener('click', function()
		{
			calRun.startCalibration();
		});

		//stop the calibration. This will generate an error on purpose
		document.getElementById('btnStop').addEventListener('click', function()
		{
			calRun.endCalibration(false, true);
			//stop the circulation pump
			calRun.activateFlowPump(false);
			//close the fill valve
			let fillValve = calRun.getRelayActivationConfiguration();
			calRun.activateRelay(fillValve.portName, fillValve['Fill relay'], false);
			calRun.emit('fillValveActivated', false);
			//close the drain valve
			let drainValve = calRun.getRelayActivationConfiguration();
			calRun.activateRelay(drainValve.portName, drainValve['Drain relay'], false);
			calRun.emit('drainValveActivated', false);
			//turn off rotating SBS symbol because it's annoying.
			showSpinny(false);
		});
	
		// //display the reference configuration dialog
		// document.getElementById('btnReferences').addEventListener('click', function()
		// {
		// 	displayReferenceConfiguration();
		// });
	
		// //display the system control dialog
		// document.getElementById('btnControl').addEventListener('click', function()
		// {
		// 	displayControllerConfiguration();
		// });

		//displays a drop down for actions that can be taken
		//that don't fit in the other main buttons
		//these are less common things
		document.getElementById('btnAction').addEventListener('click', function()
		{
			displayActionDialog(document.getElementById('btnAction'));
		});

		//display calcert
		document.getElementById('btnCalCert').addEventListener('click', function()
		{
			window.open('http://sbedb01:88/calcert/', '_blank');
		});
	
		//change the system name when the user leaves the system name box
		document.getElementById('systemName').addEventListener('blur', function()
		{
			calRun.updateSystemName(document.getElementById('systemName').innerHTML);
		});
	
		//when the user enters the system name box, highlight the system name
		document.getElementById('systemName').addEventListener('click', function()
		{
			document.execCommand('selectall', null, false);
		});
		
		document.getElementById('btnConfigure').addEventListener('click', function()
		{
			console.log('configure');
			showConfigurationDialog();
		});
	
		//change the system name when the user presses Enter
		document.getElementById('systemName').addEventListener('keydown', function(e)
		{
			if(e.keyCode === 13)
			{
				e.preventDefault();
				calRun.updateSystemName(document.getElementById('systemName').innerHTML);
			}
		});
		const clearLSButton = document.querySelector('#btnClearLocalStorage');
		if (self.getIsDebug()) {
			// THIS CODE WAS IMPLEMENTED TO CLEAR LOCAL STORAGE - it is intended for debug purposes and SHOULD NOT go to production.
			clearLSButton.addEventListener('click', (e) => {
				localStorage.clear();
				window.location.reload();
			});
		} else {
			clearLSButton.style = "display:none";
		}
	
	}
	catch(err)
	{
		calRun.onError(err);
	}

}