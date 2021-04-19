'use strict';

//calRun object. This is the magic that does all the work
let calRun = null;
let popUp = null;

function initializeCalRun(enable = false)
{
	enableButtons(enable);
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
		//'js/controlObjects.js',
		//'js/configurationManager.js',
		//'js/calibrationConfigurationFunctions.js',
		//'js/calibrationParameter.js',
		//'js/calibrationOption.js',
		//'js/calibrationConfigurator.js',
		'js/calRun.js',
		//'js/widgetCommunications.js',
		//'js/PumpControl.js',
		//'js/SystemStatus.js',
		//'js/ConfigurationManagerDialog.js',
		//'js/CoefficientLoader.js',
		//'js/SCPI.js'
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
		console.log('Continuing CalRun initialization');
		calRun = new CalRun(true);
		addListeners();
		calRun.initialize();
	
	}
	catch(err)
	{
		onError(err);
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
		document.getElementById('btnAction').disabled = !enable;
		document.getElementById('btnConfigure').disabled = !enable;

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
		onError(err);
	}
}

/**
 * Adds listeners for various events in the U/I and calRun object
 */
function addListeners()
{
	try
	{
		//when calRun is initialized
		calRun.on('initializationComplete', function()
		{
			enableButtons(true);
		});

		// hook up a listener to the Bug button
		document.getElementById('btnBug').addEventListener('click', function()
		{
			window.open('https://docs.google.com/forms/d/e/1FAIpQLSehXNiNhXqgp8dJZL-sAgB7DvEzY2XDOTbdyvLf5KI_5YdOcQ/viewform');
		});

		//display calcert
		document.getElementById('btnCalCert').addEventListener('click', function()
		{
			window.open('http://sbedb01:88/calcert/', '_blank');
		});

		document.getElementById('btnConfigure').addEventListener('click', function()
		{
			console.log('configure');
			showConfigurationDialog();
		});

	}
	catch(err)
	{
		onError(err);
	}
}

// BUG: this doesn't disable the menu bar, allowing the background pop up to be displayed again over the config screen
function showConfigurationDialog()
{
	let popUp = showPopUpDialog('Calibration Configuration', '75%', '75%');
	// let configurationDialog = new sbConfigurationDialog();
	// configurationDialog.setup(getConfigurationSetup());

	// confir

	// popUp.setContent();
	renderConfig(popUp.contentArea.id);
}

/**
 * TODO: test
 * Temporary function!
 */
function getConfigurationSetup()
{
	let configurationSettings = '['+
	'{"configurationNodeID":"1","displayIndex":"4","parentNodeID":null,"configurationArea":"datapoint","userCanAddMultiple":"0","displayValue":"Data Points","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"2","displayIndex":"1","parentNodeID":"1","configurationArea":"datapoint","userCanAddMultiple":"1","displayValue":"Data Point","quantity":"1","controls":[],"childNodes":[],"nodeSubIndex":1}]},'+
	'{"configurationNodeID":"3","displayIndex":"2","parentNodeID":null,"configurationArea":"reference","userCanAddMultiple":"0","displayValue":"Reference Sensors","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"4","displayIndex":"1","parentNodeID":"3","configurationArea":"reference","userCanAddMultiple":"1","displayValue":"Reference Sensor","quantity":"2","controls":[' +
	'{"configurationNodeID":"4","displayIndex":"1","label":"SN","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":"10","listItems":null,"minValue":null,"maxValue":null,"controlType":"textbox","configurationSettingsID":"872379","value":"1234"}],"childNodes":[],"nodeSubIndex":1},'+
	'{"configurationNodeID":"4","displayIndex":"1","parentNodeID":"3","configurationArea":"reference","userCanAddMultiple":"1","displayValue":"Reference Sensor","quantity":"2","controls":[' +
	'{"configurationNodeID":"4","displayIndex":"1","label":"SN","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":"10","listItems":null,"minValue":null,"maxValue":null,"controlType":"textbox","configurationSettingsID":"872620","value":"2345"}],"childNodes":[],"nodeSubIndex":2}]},'+
	'{"configurationNodeID":"5","displayIndex":"1","parentNodeID":null,"configurationArea":"settings","userCanAddMultiple":"0","displayValue":"Settings","quantity":"1","controls":[' + 
	'{"configurationNodeID":"5","displayIndex":"1","label":"Calibration System Type","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":null,"listItems":null,"minValue":null,"maxValue":null,"controlType":"dropdown","configurationSettingsID":"863682","value":"ECOV2"},'+
	'{"configurationNodeID":"5","displayIndex":"2","label":"Calibration System Location","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":null,"listItems":null,"minValue":null,"maxValue":null,"controlType":"dropdown","configurationSettingsID":-1,"value":"Not Set"},'+
	'{"configurationNodeID":"5","displayIndex":"3","label":"Number of Sequential Calibrations","width":"50px","height":"30px","defaultValue":"1","maxLength":null,"listItems":null,"minValue":"1","maxValue":"7","controlType":"number","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"4","label":"Samples To Average","width":"50px","height":"30px","defaultValue":"10","maxLength":null,"listItems":null,"minValue":"1","maxValue":"24","controlType":"number","configurationSettingsID":-1,"value":"10"},'+
	'{"configurationNodeID":"5","displayIndex":"5","label":"Coefficient of Variation (max)","width":"50px","height":"30px","defaultValue":"1","maxLength":"10","listItems":null,"minValue":null,"maxValue":null,"controlType":"textbox","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"6","label":"Additional Wait Time Once Stable (sec)","width":"50px","height":"30px","defaultValue":"0","maxLength":null,"listItems":null,"minValue":"0","maxValue":"120","controlType":"number","configurationSettingsID":-1,"value":"0"},'+
	'{"configurationNodeID":"5","displayIndex":"7","label":"Sample Rate (hz)","width":"50px","height":"30px","defaultValue":"1","maxLength":"10","listItems":null,"minValue":null,"maxValue":null,"controlType":"textbox","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"8","label":"Data Point Time Out (sec)","width":"50px","height":"30px","defaultValue":"30","maxLength":null,"listItems":null,"minValue":"1","maxValue":"200","controlType":"number","configurationSettingsID":-1,"value":"30"},'+
	'{"configurationNodeID":"5","displayIndex":"9","label":"Number of Devices to Calibrate","width":"50px","height":"30px","defaultValue":"1","maxLength":null,"listItems":null,"minValue":"1","maxValue":"12","controlType":"number","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"10","label":"Reference Sensor Time Out (sec)","width":"50px","height":"30px","defaultValue":"30","maxLength":null,"listItems":null,"minValue":"1","maxValue":"200","controlType":"number","configurationSettingsID":-1,"value":"30"},'+
	'{"configurationNodeID":"5","displayIndex":"11","label":"Device Under Test Time Out (sec)","width":"50px","height":"30px","defaultValue":"30","maxLength":null,"listItems":null,"minValue":"1","maxValue":"200","controlType":"number","configurationSettingsID":-1,"value":"30"},'+
	'{"configurationNodeID":"5","displayIndex":"12","label":"Flow Relay Number","width":"50px","height":"30px","defaultValue":"1","maxLength":null,"listItems":null,"minValue":"1","maxValue":"12","controlType":"number","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"13","label":"Drain Relay Number","width":"50px","height":"30px","defaultValue":"2","maxLength":null,"listItems":null,"minValue":"1","maxValue":"12","controlType":"number","configurationSettingsID":-1,"value":"2"},'+
	'{"configurationNodeID":"5","displayIndex":"14","label":"Fill Relay Number","width":"50px","height":"30px","defaultValue":"3","maxLength":null,"listItems":null,"minValue":"1","maxValue":"12","controlType":"number","configurationSettingsID":-1,"value":"3"},'+
	'{"configurationNodeID":"5","displayIndex":"15","label":"Drain Time (sec)","width":"50px","height":"30px","defaultValue":"1","maxLength":null,"listItems":null,"minValue":"1","maxValue":"30","controlType":"number","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"16","label":"Fill Time (sec)","width":"50px","height":"30px","defaultValue":"1","maxLength":null,"listItems":null,"minValue":"1","maxValue":"30","controlType":"number","configurationSettingsID":-1,"value":"1"},'+
	'{"configurationNodeID":"5","displayIndex":"17","label":"Notes","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":null,"listItems":null,"minValue":null,"maxValue":null,"controlType":"textarea","configurationSettingsID":-1,"value":"Not Set"}],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"9","displayIndex":"1","parentNodeID":"5","configurationArea":"settings","userCanAddMultiple":"1","displayValue":"Device","quantity":"1","controls":[],"childNodes":[],"nodeSubIndex":1}]},'+
	'{"configurationNodeID":"6","displayIndex":"3","parentNodeID":null,"configurationArea":"control","userCanAddMultiple":"0","displayValue":"Control Devices","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"7","displayIndex":"1","parentNodeID":"6","configurationArea":"control","userCanAddMultiple":"1","displayValue":"Control Device","quantity":"1","controls":[],"childNodes":[],"nodeSubIndex":1}]},'+
	'{"configurationNodeID":"8","displayIndex":"-1","parentNodeID":null,"configurationArea":"device","userCanAddMultiple":"1","displayValue":"Devices","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[]}'+
	']';
	let returnValues = JSON.parse(configurationSettings);
		console.log(returnValues);
	return returnValues;
	// let configurationSettings = 
	// {
	// 	configurationID: 35,
	// 	configurationName: 'default',
	// 	notes:'',
	// 	configurationNodes:
	// 	[
	// 		{
	// 			configurationNodeID:0,
	// 			displayValue: 'Data Points',
	// 			displayIndex: 3,
	// 			parentNodeID: -1,
	// 			childNodes:
	// 			[
	// 				{
	// 					configurationNodeID:4,
	// 					displayValue:'Data Point',
	// 					displayIndex: 0,
	// 					parentNodeID: 0,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:5,
	// 					displayValue:'Data Point',
	// 					displayIndex: 1,
	// 					parentNodeID: 0,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:6,
	// 					displayValue:'Data Point',
	// 					displayIndex: 2,
	// 					parentNodeID: 0,
	// 					childNodes:[]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			configurationNodeID:1,
	// 			displayValue:'Reference Sensors',
	// 			displayIndex:1,
	// 			parentNodeID:-1,
	// 			childNodes:
	// 			[
	// 				{
	// 					configurationNodeID:7,
	// 					displayValue:'Reference Sensor',
	// 					displayIndex:0,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:8,
	// 					displayValue:'Reference Sensor',
	// 					displayIndex:1,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:9,
	// 					displayValue:'Reference Sensor',
	// 					displayIndex:2,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				}

	// 			]
	// 		},
	// 		{
	// 			configurationNodeID:2,
	// 			displayValue:'Settings',
	// 			displayIndex:0,
	// 			parentNodeID: -1,
	// 			childNodes:[]
	// 		},
	// 		{
	// 			configurationNodeID:3,
	// 			displayValue:'Control Devices',
	// 			displayIndex:2,
	// 			parentNodeID:-1,
	// 			childNodes:
	// 			[
	// 				{
	// 					configurationNodeID:10,
	// 					displayValue:'Control Device',
	// 					displayIndex:0,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:11,
	// 					displayValue:'Control Device',
	// 					displayIndex:1,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				},
	// 				{
	// 					configurationNodeID:12,
	// 					displayValue:'Control Device',
	// 					displayIndex:2,
	// 					parentNodeID:1,
	// 					childNodes:[]
	// 				}

	// 			]

	// 		}
	// 	]
	// };

	// return configurationSettings;

	// let configurationSetup = 
	// [
	// 	{
	// 		configurationArea: 'dataPoint',
	// 		configurationID: 35,
	// 		configurationName: 'default',
	// 		displayValue: 'Data Points',
	// 		displayIndex: 3,
	// 		display: true,
	// 		optionID: 0,
	// 		controls:
	// 		[
	// 			{
	// 				label:'Number of Data Points',
	// 				type: 'number',
	// 				min: '1',
	// 				max: '20',
	// 				defaultValue: '1',
	// 				controlID: 0
	// 			}
	// 		],
	// 		childOptions:
	// 		[
	// 			{
	// 				configurationArea:'dataPoint',
	// 				configurationID: 35,
	// 				configurationName: 'default',
	// 				displayValue: 'Data Point',
	// 				displayIndex: 0,
	// 				display: true,
	// 				optionID: 7,
	// 				controls:
	// 				[

	// 				],
	// 				childOptions:
	// 				[
	// 					{
	// 						configurationArea: 'dataPoint',
	// 						configurationID: 35
	// 					}
	// 				],
	// 				parentOption: 0,
	// 				multiples: true,
	// 				multiplesControledBy: 0
	// 			}
	// 		],
	// 		parentOption: -1, //no parent
	// 		multiples: false,
	// 		multiplesControledBy: -1 //not controlled
	// 	},
	// 	{
	// 		configurationArea: 'reference',
	// 		configurationID: 35,
	// 		configurationName: 'default',
	// 		displayValue: 'Reference Sensors',
	// 		displayIndex: 1,
	// 		display: true,
	// 		controls:
	// 		[
	// 			{
	// 				label:'Number of Reference Sensors',
	// 				type: 'number',
	// 				min: '1',
	// 				max: '5',
	// 				defautlValue: '1'
	// 			}

	// 		]
	// 	},
	// 	{
	// 		configurationArea: 'device',
	// 		configurationID: 35,
	// 		configurationName: 'default',
	// 		displayValue: 'Device List',
	// 		displayIndex: 4,
	// 		display: false,
	// 		controls: []
	// 	},
	// 	{
	// 		configurationArea: 'control',
	// 		configurationID: 35,
	// 		configurationName: 'default',
	// 		displayValue: 'Control Devices',
	// 		displayIndex: 2,
	// 		display: true,
	// 		controls: 
	// 		[
	// 			{
	// 				label: 'Number of control devices',
	// 				type:'number',
	// 				min: '1',
	// 				max: '10',
	// 				defautlValue: '1'
	// 			}
	// 		]
	// 	},
	// 	{
	// 		configurationArea: 'system',
	// 		configurationID: 35,
	// 		configurationName: 'default',
	// 		displayValue: 'Settings',
	// 		displayIndex: 0,
	// 		display: true,
	// 		controls: 
	// 		[
	// 			{
	// 				label:'Number of sequential calibrations', 
	// 				type:'number',
	// 				min: '1',
	// 				max: '3',
	// 				defaultValue: '1'
	// 			},
	// 			{
	// 				label: 'Samples to average',
	// 				type: 'number',
	// 				min: '1',
	// 				max: '24',
	// 				defautlValue: '10'
					
	// 			},
	// 			{
	// 				label: 'Number of devices to calibrate',
	// 				type: 'number',
	// 				min: '1',
	// 				max: '12',
	// 				defaultValue: '1'
	// 			}
	// 		]			
	// 	}

	// ];
	// return configurationSetup;
}

function showPopUpDialog(title, width, height)
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

/**
 * If an error occurs, report it to the calRun object if it exists
 * @param {function} err 
 */
function onError(err)
{
	console.log(err);
	if(typeof calRun === 'function' && typeof calRun.onError === 'function')
	{
		calRun.onError(err);
	}
}

