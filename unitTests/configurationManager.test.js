'use strict'
/*
    Some notes on unit testing with JEST
   
    You will notice the below pattern often in the code:
  	test('empty JSON object throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('not found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationDeleted('[]');

		expect(errorOccurred).toBe(true);

	});

	This is because, when an error occurs, we want to make sure the correct error is happening
	so data.message needs to match the words we want
	However, if the message does not match, then you may get an error thrown by jest saying that the pattern didn't match
	This is how Jest checks the toMatch value.
	In the case above, the pattern would be "not found" and, if that was missing from the error message
	then Jest might say it couldn't find the pattern "not found". 
	So we check that the message does not match "pattern" which shows that Jest didn't have an error
	We also set a variable errorOccurred to true to indicate that we fell into the function
	There are times when you can bypass a function like this and get a passing test when it
	really should have been a failing test. So by checking that we fell into the function, we can
	call this a good test

	For some tests, we use ()=> to indicate that the code will run synchronously and should immediately give the result expected.
	Example would be :
	test('we did something so something should happen', ()=>
	{
		expect(something).toBe(true);
	});

	For some tests, we use done=> to indicate that the code will run asynchronously and it could be some
	time before the code completes. The code will wait until done() is reached in order to call the test complete
	there is a timeout period where it will complain, but this is several seconds. Most code will execute faster than that.
	Example:
	test('we did an asynchronous thing, so we wait for something to happen', done=>
	{
		function asyncWait(value)
		{
			expect(value).toBe(true);
			done();
		}

		callFunctionAsynchronously(values, asyncWait); //in this case asyncWait is a callback to the function
	});
 */
let ConfigurationManager = require('../js/configurationManager.js').ConfigurationManager;
global.SBListener = require('../../sbGlobal/sbGlobalFunctions.js').SBListener;
global.isPositiveInteger = require('../../sbGlobal/sbGlobalFunctions.js').isPositiveInteger;
global.executeCallback = require('../../sbGlobal/sbGlobalFunctions.js').executeCallback;
global.isJson = require('../../sbGlobal/sbGlobalFunctions.js').isJson;
global.processDatabaseError = require('../../sbGlobal/sbGlobalFunctions.js').processDatabaseError;
global.Device = require('../../sbGlobal/Device.js').Device;
global.toCamelCase = require('../../sbGlobal/sbGlobalFunctions.js').toCamelCase;
global.removeParentheses = require('../../sbGlobal/sbGlobalFunctions.js').removeParentheses;

function getConfigurations()
{
	let configurations = '[' +
	'{\"ConfigurationID\":\"35\",\"ConfigurationName\":\"default\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"1\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"50\",\"ConfigurationName\":\"drummer\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"51\",\"ConfigurationName\":\"falcon\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"52\",\"ConfigurationName\":\"default 2\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"53\",\"ConfigurationName\":\"default 3\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"55\",\"ConfigurationName\":\"New name\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"56\",\"ConfigurationName\":\"New name 2\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"57\",\"ConfigurationName\":\"New name 3\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"58\",\"ConfigurationName\":\"New name 4\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"59\",\"ConfigurationName\":\"another new name\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":\"Some notes here\"},' +
	'{\"ConfigurationID\":\"60\",\"ConfigurationName\":\"another new name 2\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":\"Some notes here\"},' +
	'{\"ConfigurationID\":\"61\",\"ConfigurationName\":\"wow lookit dat\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"62\",\"ConfigurationName\":\"configuration 72\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"63\",\"ConfigurationName\":\"dunlop\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"65\",\"ConfigurationName\":\"configuration 73\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"66\",\"ConfigurationName\":\"configuration 74\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"67\",\"ConfigurationName\":\"dumdum\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"68\",\"ConfigurationName\":\"dumdum 2\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"69\",\"ConfigurationName\":\"fred flintsone\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null},' +
	'{\"ConfigurationID\":\"70\",\"ConfigurationName\":\"fred flintsone 2\",\"CalibrationSystemID\":\"35\",\"CurrentConfiguration\":\"0\",\"Notes\":null}]';
	return configurations;
};

function getConfigurationSettings()
{
	//This block of settings was taken from Mike Vorkapich's computer on 2019-10-30
	let configurationSettings = '['+
	'{"configurationNodeID":"1","displayIndex":"4","parentNodeID":null,"configurationArea":"datapoint","userCanAddMultiple":"0","displayValue":"Data Points","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"2","displayIndex":"1","parentNodeID":"1","configurationArea":"datapoint","userCanAddMultiple":"1","displayValue":"Data Point","quantity":"1","controls":[],"childNodes":[],"nodeSubIndex":1}]},'+
	'{"configurationNodeID":"3","displayIndex":"2","parentNodeID":null,"configurationArea":"reference","userCanAddMultiple":"0","displayValue":"Reference Sensors","quantity":"1","controls":[],"nodeSubIndex":1,"childNodes":[' +
	'{"configurationNodeID":"4","displayIndex":"1","parentNodeID":"3","configurationArea":"reference","userCanAddMultiple":"1","displayValue":"Reference Sensor","quantity":"2","controls":[' +
	'{"configurationNodeID":"4","displayIndex":"1","label":"SN","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":"10","listItems":null,"minValue":null,"maxValue":null,"controlType":"textbox","configurationSettingsID":"872379","value":"1234"}],"childNodes":[' +
    '{"configurationNodeID":"19","displayIndex":"1","parentNodeID":"4","configurationArea":"reference","userCanAddMultiple":"1","displayValue":"Measurand","quantity":"1","controls":[{"configurationNodeID":"19","displayIndex":"1","label":"Measurand","width":"50px","height":"30px","defaultValue":"Not Set","maxLength":"10","listItems":"Chlorophyll, Temperature","minValue":null,"maxValue":null,"controlType":"dropdown","configurationSettingsID":"872620","value":"2345"}],"childNodes":[],"nodeSubIndex":1}],"nodeSubIndex":1},'+
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
	return configurationSettings;
}

function getExternalConfigurations()
{
	let externalConfigurations = '[' +
		'{\"SystemName\":\"AL0\",\"CalibrationSystemID\":\"1\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AL1\",\"CalibrationSystemID\":\"2\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AL2\",\"CalibrationSystemID\":\"3\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AL3\",\"CalibrationSystemID\":\"4\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AL4\",\"CalibrationSystemID\":\"5\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AL5\",\"CalibrationSystemID\":\"6\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"AT1\",\"CalibrationSystemID\":\"7\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"C1\",\"CalibrationSystemID\":\"8\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"C2\",\"CalibrationSystemID\":\"9\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"DC1\",\"CalibrationSystemID\":\"10\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"DM1\",\"CalibrationSystemID\":\"11\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"DT1\",\"CalibrationSystemID\":\"12\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"MC1\",\"CalibrationSystemID\":\"13\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"MC2\",\"CalibrationSystemID\":\"14\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"OX1\",\"CalibrationSystemID\":\"15\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"OX2\",\"CalibrationSystemID\":\"16\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"OX3\",\"CalibrationSystemID\":\"17\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"OX4\",\"CalibrationSystemID\":\"18\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"OX5\",\"CalibrationSystemID\":\"19\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SC1\",\"CalibrationSystemID\":\"20\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SC2\",\"CalibrationSystemID\":\"21\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SC3\",\"CalibrationSystemID\":\"22\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SC4\",\"CalibrationSystemID\":\"23\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SC5\",\"CalibrationSystemID\":\"24\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"T1\",\"CalibrationSystemID\":\"25\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"T2\",\"CalibrationSystemID\":\"26\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"T3\",\"CalibrationSystemID\":\"27\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"T4\",\"CalibrationSystemID\":\"28\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"T5\",\"CalibrationSystemID\":\"29\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"davegdev\",\"CalibrationSystemID\":\"30\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"DS1\",\"CalibrationSystemID\":\"31\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SVC1\",\"CalibrationSystemID\":\"32\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SVC2\",\"CalibrationSystemID\":\"33\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"ECOV2\",\"CalibrationSystemID\":\"34\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"Purple\",\"CalibrationSystemID\":\"41\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"davegDesk\",\"CalibrationSystemID\":\"42\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"WL170\",\"CalibrationSystemID\":\"44\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"WL182\",\"CalibrationSystemID\":\"45\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"Orange\",\"CalibrationSystemID\":\"46\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"jones\",\"CalibrationSystemID\":\"53\",\"ConfigurationName\":\"default\"},' +
		'{\"SystemName\":\"SNTLLocalTest\",\"CalibrationSystemID\":\"37\",\"ConfigurationName\":\"default\"}]';
	return externalConfigurations;
}

let validNewConfiguration = '[{"newConfigurationID":"999","calibrationSystemID":"35","configurationName":"my special new configuration"}]';
let databaseError = 'missing: storedProcedure<BR/>Error: <BR>Class: sbDatabaseQueries.php<BR>Function: Connect<BR>Message: Not enough parameters supplied<BR>false';

function getRandomConfigurationName()
{
	return 'configuration_' + Math.round(Math.random() * 1000000);
}

beforeEach(()=>
{
	global.ProcessDatabaseRequest = function(){};
});

describe('recallConfigurations', ()=>
{
	test('missing system id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		configMgr.on('error', function(data)
		{
			errorOccurred = true;
			expect(data.message).toMatch('Invalid System ID');
			expect(data.message).not.toMatch('pattern');
			done();
		});

		configMgr.recallConfigurations();
		expect(errorOccurred).toBe(true);
	});

	test('valid system id, gets values', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let dataRecieved = false;
		function gotData(data)
		{
			expect(isJson(data)).toBe(true);
			dataRecieved = true;
			done();
		};

		global.ProcessDatabaseRequest = function(data, callback)
		{
			executeCallback(callback, getConfigurations());
		};

		configMgr.processConfigurations = function(data)
		{
			gotData(data);
		};
		configMgr.recallConfigurations(100);
		expect(dataRecieved).toBe(true);
	});

	test('invalid system id, returns empty array', ()=>
	{
		let configMgr = new ConfigurationManager(true);

		let dataReceived = false;
		function gotData(data)
		{
			expect(data).toBe('[]');
			dataReceived = true;
			done();
		}

		global.ProcessDatabaseRequest = function(data, callback)
		{
			executeCallback(callback, '[]');
		};

		configMgr.processConfigurations = function(data)
		{
			gotData(data);
		};

		configMgr.recallConfigurations(9000000000000000);
		expect(dataReceived).toBe(true);
	});

	test('valid system id, calls next function', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let dataRetrieved = false;

		global.ProcessDatabaseRequest = function(data, callback)
		{
			callback(getConfigurations());
		};

		configMgr.processConfigurations = function(data)
		{
			dataRetrieved = true;
			expect(isJson(data)).toBe(true);
			done();
		}

		configMgr.recallConfigurations(90000);
		expect(dataRetrieved).toBe(true);

	});

});

describe('configurationsRetrieved', ()=>
{
	test('valid parameters, fills configurations', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		expect(configMgr.configurations.length).toBe(0);

		configMgr.processConfigurations(getConfigurations());
		expect(configMgr.configurations.length).toBeGreaterThan(0);
	});

	test('valid parameters, triggers listener', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let processed = false;
		function configProcessed(data)
		{
			expect(data.length).toBeGreaterThan(0);
			processed = true;
			done();
		}
		configMgr.on('configurationsProcessed', configProcessed);
		configMgr.processConfigurations(getConfigurations());
		expect(processed).toBe(true);
	});

	test('valid parameters, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);

		expect(configMgr.processConfigurations(getConfigurations())).toBe(true);
	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let errorOccurred = false;
		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurations(databaseError);
	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurations('fred');
		expect(errorOccurred).toBe(true);
	});
});

describe('createNewConfiguration', ()=>
{
	test('valid parameters, calls next function', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let dataReceived = false;

		global.ProcessDatabaseRequest = function(parameters, callback)
		{
			callback('[{"newConfigurationID":"999"}]');
		};

		configMgr.processNewConfiguration = function(data)
		{
			expect(data).toMatch('999');
			dataReceived = true;
			done();

		};
		configMgr.createNewConfiguration(35, 'configuration_' + Math.round(Math.random() * 1000000));
		expect(dataReceived).toBe(true);
	});

	test('missing system ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorHappened = false;

		function errorOccurred(data)
		{
			expect(data.message).toMatch('Invalid');
			expect(data.message).not.toMatch('pattern');
			errorHappened = true;
			done();
		}

		configMgr.on('error', errorOccurred);
		configMgr.createNewConfiguration();

		expect(errorHappened).toBe(true);
	});

	test('invalid system ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorHappened = false;

		function errorOccurred(data)
		{
			expect(data.message).toMatch('Invalid');
			expect(data.message).not.toMatch('pattern');
			errorHappened = true;
			done();
		}

		configMgr.on('error', errorOccurred);
		configMgr.createNewConfiguration('fred');

		expect(errorHappened).toBe(true);
	});

	test('missing configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorHappened = false;

		function errorOccurred(data)
		{
			expect(data.message).toMatch('blank');
			expect(data.message).not.toMatch('pattern');
			errorHappened = true;
			done();
		}

		configMgr.on('error', errorOccurred);
		configMgr.createNewConfiguration(35);

		expect(errorHappened).toBe(true);
		
	});

	test('duplicate configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorHappened = false;

		function errorOccurred(data)
		{
			expect(data.message).toMatch('already in use');
			expect(data.message).not.toMatch('pattern');
			errorHappened = true;
			done();
		}

		configMgr.on('error', errorOccurred);
		configMgr.checkExistingConfiguration = function()
		{
			return true;
		}
		configMgr.createNewConfiguration(35, 'default');

		expect(errorHappened).toBe(true);
	});
});

describe('processNewConfiguration', ()=>
{
	test('valid parameters returned, updates configurations', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.addConfiguration = jest.fn();

		configMgr.processNewConfiguration(validNewConfiguration);
		expect(configMgr.addConfiguration).toHaveBeenCalled();
	});

	test('valid parameters returned, clears configuration settings', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		expect(configMgr.configurationSettings.length).toBeGreaterThan(0);

		configMgr.addConfiguration = function(){};
		configMgr.processNewConfiguration(validNewConfiguration);
		expect(configMgr.configurationSettings.length).toBe(0);
	});

	test('valid parameters returned, sets current configuration ID', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		expect(configMgr.currentConfiguration).toBe(-1);
		configMgr.addConfiguration = function(){};
		configMgr.processNewConfiguration(validNewConfiguration);
		expect(configMgr.currentConfiguration).toBe(999);
	});

	test('valid parameters returned, sets current configuraiton name', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		expect(configMgr.currentConfigurationName).toBe('');
		configMgr.addConfiguration = function(){};
		configMgr.processNewConfiguration(validNewConfiguration);
		expect(configMgr.currentConfigurationName).toBe('my special new configuration');
	});

	test('valid parameters returned, triggers listener', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let listenerTriggered = false;

		function configCreated(data)
		{
			expect(data).toBe(999);
			listenerTriggered = true;
			done();
		}

		configMgr.on('newConfigurationProcessed', configCreated);
		configMgr.processNewConfiguration(validNewConfiguration);
		expect(listenerTriggered).toBe(true);

	});

	test('valid parameters returned, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.addConfiguration = function(){};
		expect(configMgr.processNewConfiguration(validNewConfiguration)).toBe(true);
	});

	test('invalid JSON, throws error', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}

		configMgr.processNewConfiguration('fred');
		expect(errorOccurred).toBe(true);

	});

	test('database error, triggers error routine', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processNewConfiguration(databaseError);
		expect(errorOccurred).toBe(true);


	});
});

describe('addConfiguration', ()=>
{
	test('valid information, adds configuration', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configCount = configMgr.configurations.length;
		configMgr.addConfiguration(35, 21, getRandomConfigurationName());
		expect(configMgr.configurations.length).toBeGreaterThan(configCount);
	});

	test('valid information, sets the new configuration as current', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let newConfigName = getRandomConfigurationName();
		configMgr.addConfiguration(35, 21, newConfigName);

		let newConfig = configMgr.configurations.filter(function(config)
		{
			return config.ConfigurationName === newConfigName;
		});

		expect(newConfig[0].CurrentConfiguration).toBe(1);
	});

	test('valid information, resets all existing configurations to not current', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let newConfigName = getRandomConfigurationName();
		configMgr.addConfiguration(35, 21, newConfigName);

		let newConfig = configMgr.configurations.filter(function(config)
		{
			return config.CurrentConfiguration === 1;
		});

		expect(newConfig.length).toBe(1);
	});

	test('missing system ID, throws exception', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.addConfiguration();

		expect(errorOccurred).toBe(true);
	});

	test('invalid systemID, throws exception', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.addConfiguration('fred');
		expect(errorOccurred).toBe(true);
	});

	test('missing configuration ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.addConfiguration(35);

		expect(errorOccurred).toBe(true);

	});

	test('invalid configuration ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.addConfiguration(35, 'fred');

		expect(errorOccurred).toBe(true);


	});

	test('missing configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be blank');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.addConfiguration(35, 75);

		expect(errorOccurred).toBe(true);

	});

	test('duplicate configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('in use');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfiguration = function(){return true;}
		configMgr.addConfiguration(35, 75, 'default');

		expect(errorOccurred).toBe(true);


	});

	test('valid notes, sets notes', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		configMgr.addConfiguration(35, 21, getRandomConfigurationName(), 'some random notes');
		expect(configMgr.configurations[configMgr.configurations.length - 1].Notes).toBe('some random notes');

	});
});

describe ('checkExistinConfiguration', ()=>
{
	test('empty configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be blank');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfiguration();
		expect(errorOccurred).toBe(true);
	});

	test('configuration exists, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		let configExists = configMgr.checkExistingConfiguration('default');
		expect(configExists).toBe(true);
	});

	test('configuration does not exist, returns false', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		let configExists = configMgr.checkExistingConfiguration('not a real configuration');
		expect(configExists).toBe(false);

	});

	test('mixed case configuration exists, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		let configExists = configMgr.checkExistingConfiguration('DeFaUlT');
		expect(configExists).toBe(true);

	});


});

describe('renameConfiguration', ()=>
{
	test('missing configuration id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.renameConfiguration();
		expect(errorOccurred).toBe(true);
	});

	test('invalid configuration id , throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.renameConfiguration('fred');
		expect(errorOccurred).toBe(true);

	})

	test('missing configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('cannot be blank');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.renameConfiguration(35);
		expect(errorOccurred).toBe(true);
	});

	test('configuration name already in use, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.checkExistingConfiguration = function()
		{
			return true;
		}

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('already in use');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.renameConfiguration(35, 'default');
		expect(errorOccurred).toBe(true);
		
	});

	test('configuration id not in list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.checkExistingConfigurationID = function()
		{
			return false;
		}

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.renameConfiguration(999,'some new long name so we prevent duplicates');
		expect(errorOccurred).toBe(true);
	});

	test('valid parameters, calls next function', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.checkExistingConfiguration = function()
		{
			return false;
		}

		configMgr.checkExistingConfigurationID = function()
		{
			return true;
		}

		let listenerTriggered = false;
		configMgr.processConfigurationRename = function()
		{
			listenerTriggered = true;
			done();
		}
		
		global.ProcessDatabaseRequest = function(parameters, callback)
		{
			callback('something');
		}

		configMgr.renameConfiguration(70, 'fred');
		expect(listenerTriggered).toBe(true);
	});
});

describe('processConfigurationRename', ()=>
{
	test('valid parameters, updates configuration name', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNumber = 5;
		let configID = configMgr.configurations[configNumber].ConfigurationID;
		let newName = getRandomConfigurationName();

		configMgr.processConfigurationRename('[{"ConfigurationID":"' + configID + '","ConfigurationName":"' + newName + '"}]');
		expect(configMgr.configurations[configNumber].ConfigurationName).toBe(newName);
	});

	test('valid parameters, triggers listener', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNumber = 5;
		let configID = configMgr.configurations[configNumber].ConfigurationID;
		let newName = getRandomConfigurationName();

		function configRenamed(data)
		{
			expect(data.ConfigurationName).toBe(newName);
			done();
		}

		configMgr.on('configurationRenamed', configRenamed);
		configMgr.processConfigurationRename('[{"ConfigurationID":"' + configID + '","ConfigurationName":"' + newName + '"}]');

	});

	test('valid parameters, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNumber = 5;
		let configID = configMgr.configurations[configNumber].ConfigurationID;
		let newName = getRandomConfigurationName();

		expect(configMgr.processConfigurationRename('[{"ConfigurationID":"' + configID + '","ConfigurationName":"' + newName + '"}]')).toBe(true);
	});

	test('database error, processes database error', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let errorOccurred = false;
		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurationRename(databaseError);
		expect(errorOccurred).toBe(true);
	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}


		configMgr.processConfigurationRename('fred');
		expect(errorOccurred).toBe(true);
	});

	test('configuration not in local memory, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('local memory');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationRename('[{"ConfigurationID":"999999999999","ConfigurationName":"' + getRandomConfigurationName() + '"}]');
		expect(errorOccurred).toBe(true);
	});

	test('empty response from server, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('not found in database');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationRename('[]');
		expect(errorOccurred).toBe(true);
	});
});

describe('checkExistingConfigurationID', ()=>
{
	test('valid configuration id, in list, returns true', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		let configExists = configMgr.checkExistingConfigurationID(70);
		expect(configExists).toBe(true);
	});

	test('valid configuration id, not in list, returns false', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		let configExists = configMgr.checkExistingConfigurationID(222);
		expect(configExists).toBe(false);
	});

	test('invalid configuration id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfigurationID('fred');
		expect(errorOccurred).toBe(true);
	});

	test('missing configuration id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfigurationID();
		expect(errorOccurred).toBe(true);
	})
});

describe('setCurrentConfiguration', ()=>
{
	test('valid parameters, calls function', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.processSetCurrentConfiguration = function(data)
		{
			expect(data).toBe('fred');
			done();
		}

		global.ProcessDatabaseRequest = function(parameters, callback)
		{
			callback('fred');
		}

		configMgr.checkExistingConfigurationID = function()
		{
			return true;
		}

		configMgr.setCurrentConfiguration(35, 100);
		
	});

	test('missing system ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.setCurrentConfiguration();
	});

	test('invalid system ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.setCurrentConfiguration('fred');
	});

	test('missing configuration ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.setCurrentConfiguration(35);
	});

	test('invalid configuration ID, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.setCurrentConfiguration(35, 'fred');
	});

	test('configuration ID not in list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.checkExistingConfigurationID = function()
		{
			return false;
		}
		configMgr.on('error', onError);
		configMgr.setCurrentConfiguration(35, 999);
		expect(errorOccurred).toBe(true);
	});
});

describe('processSetCurrentConfiguration', ()=>
{
	test('empty data set, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('not found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processSetCurrentConfiguration('[]');
		expect(errorOccurred).toBe(true);


	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processSetCurrentConfiguration(databaseError);
		expect(errorOccurred).toBe(true);



	});

	test('not JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('database response');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processSetCurrentConfiguration('fred');
		expect(errorOccurred).toBe(true);
	});

	test('valid JSON, sets configuration ID', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		expect(configMgr.currentConfiguration).toBe(-1);
		configMgr.processSetCurrentConfiguration('[{"ConfigurationID":"70","ConfigurationName":"fred flintstone"}]');
		expect(configMgr.currentConfiguration).toBe(70);
		
	});

	test('valid JSON, sets configuration name', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		expect(configMgr.currentConfigurationName).toBe('');
		configMgr.processSetCurrentConfiguration('[{"ConfigurationID":"70","ConfigurationName":"fred flintstone"}]');
		expect(configMgr.currentConfigurationName).toBe('fred flintstone');
	});

	test('valid JSON, updates local configuration list', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		
		let configNumber = 6;
		let configID = configMgr.configurations[configNumber].ConfigurationID;
		let configName = configMgr.configurations[configNumber].ConfigurationName;

		expect(parseInt(configMgr.configurations[configNumber].CurrentConfiguration)).toBe(0);

		configMgr.processSetCurrentConfiguration('[{"ConfigurationID":"' + configID + '","ConfigurationName":"' + configName + '"}]');
		expect(configMgr.configurations[configNumber].CurrentConfiguration).toBe(1);

	});

	test('configuration id not in list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('find configuration');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processSetCurrentConfiguration('[{"ConfigurationID":"70","ConfigurationName":"fred flintstone"}]');
		expect(errorOccurred).toBe(true);

	});

	test('valid JSON, triggers listener', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		
		let configNumber = 6;
		let configID = configMgr.configurations[configNumber].ConfigurationID;
		let configName = configMgr.configurations[configNumber].ConfigurationName;
		function configCurrent(data)
		{
			expect(data.ConfigurationID).toBe(configID);
			done();
		}

		configMgr.on('configurationSetAsCurrent', configCurrent);
		configMgr.processSetCurrentConfiguration('[{"ConfigurationID":"' + configID + '","ConfigurationName":"' + configName + '"}]');
	});
});

describe('copyConfiguration', ()=>
{
	test('system ID invalid, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('are invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.copyConfiguration(-1);
		expect(errorOccurred).toBe(true);
	});

	test('system ID not an integer, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('are invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.copyConfiguration('fred');
		expect(errorOccurred).toBe(true);
	});

	test('configuration ID invalid, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('are invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.copyConfiguration(35, -1);
		expect(errorOccurred).toBe(true);
	});

	test('configuration ID not an integer, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('are invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.copyConfiguration(35, 'fred');
		expect(errorOccurred).toBe(true);
	});

	test('missing configuration name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be blank');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.copyConfiguration(35, 70);
		expect(errorOccurred).toBe(true);

	});

	test('configuration name already in list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('already in use');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfiguration = function(){return true;}
		configMgr.copyConfiguration(35, 70, 'fred flintstone');
		expect(errorOccurred).toBe(true);
	});

	test('configuration ID not in the list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.checkExistingConfiguration = function(){return false;}
		configMgr.checkExistingConfigurationID = function(){return false;}
		configMgr.copyConfiguration(35, 70, 'fred flintstone');
		expect(errorOccurred).toBe(true);
	});

	test('valid parameters, calls database', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let databaseCalled = false;
		global.ProcessDatabaseRequest = function(parameters, callback)
		{
			databaseCalled = true;
			done();
		}

		configMgr.checkExistingConfiguration = function(){return false;}
		configMgr.checkExistingConfigurationID = function(){return true;}

		configMgr.copyConfiguration(35, 70, 'fred flintstone');
		expect(databaseCalled).toBe(true);

	})
});

describe('processConfigurationCopy', ()=>
{
	test('empty JSON object throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('not found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationCopy('[]');

		expect(errorOccurred).toBe(true);

	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}


		configMgr.processConfigurationCopy('fred');

		expect(errorOccurred).toBe(true);

	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurationCopy(databaseError);

		expect(errorOccurred).toBe(true);
	});

	test('valid JSON object, calls addConfiguration', done=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let functionCalled = false;
		configMgr.addConfiguration = function()
		{
			functionCalled = true;
			done();
		}

		configMgr.processConfigurationCopy('[{"ConfigurationID":"999","CalibrationSystemID":"35","ConfigurationName":"New special configuration","Notes":"null"}]');
		expect(functionCalled).toBe(true);
	});

	test('valid JSON object, sets current configuration', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.addConfiguration = function(){};
		expect(configMgr.currentConfiguration).toBe(-1);
		expect(configMgr.currentConfigurationName).toBe('');
		configMgr.processConfigurationCopy('[{"ConfigurationID":"999","CalibrationSystemID":"35","ConfigurationName":"New special configuration","Notes":"null"}]');
		expect(configMgr.currentConfiguration).toBe(999);
		expect(configMgr.currentConfigurationName).toBe('New special configuration');
	});

	test('valid JSON object, updates configuration settings', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.addConfiguration = function(){};
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		configMgr.processConfigurationCopy('[{"ConfigurationID":"999","CalibrationSystemID":"35","ConfigurationName":"New special configuration","Notes":"null"}]');
		expect(configMgr.configurationSettings[0].ConfigurationID).toBe(999);		

	});

	test('valid JSON, triggers listener', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.addConfiguration = function(){};

		let fn = jest.fn();

		configMgr.on('configurationCopied', fn);
		configMgr.processConfigurationCopy('[{"ConfigurationID":"999","CalibrationSystemID":"35","ConfigurationName":"New special configuration","Notes":"null"}]');
		expect(fn).toHaveBeenCalled();
	});
});

describe('deleteConfiguration', ()=>
{
	test('configuration ID invalid, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('is invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.deleteConfiguration();
		expect(errorOccurred).toBe(true);
	});

	test('configuration ID not an integer, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('is invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.deleteConfiguration('fred');
		expect(errorOccurred).toBe(true);
	});

	test('configuration id not in list, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.checkExistingConfigurationID = function()
		{
			return false;
		}

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.deleteConfiguration(999);
		expect(errorOccurred).toBe(true);
	});

	test('valid parameters, calls database', ()=>
	{
		let configMgr = new ConfigurationManager(true);

		let fn = jest.fn();
		global.ProcessDatabaseRequest = fn;

		configMgr.checkExistingConfigurationID = function(){return true;}

		configMgr.deleteConfiguration(35);
		expect(fn).toHaveBeenCalled();

	})

});

describe('processConfigurationDeleted', ()=>
{
	test('valid parameters, updates current configuration', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNum = 6;
		let configID = configMgr.configurations[configNum].ConfigurationID;
		configMgr.currentConfiguration = configID;
		
		configMgr.processConfigurationDeleted('[{"ConfigurationID":"' + configID + '"}]');

		expect(configMgr.currentConfiguration).toBe(-1);
		
	});

	test('valid parameters, updates current configuration name', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNum = 6;
		let configID = configMgr.configurations[configNum].ConfigurationID;
		
		configMgr.currentConfigurationName = configMgr.configurations[configNum].ConfigurationName;
		expect(configMgr.currentConfigurationName).not.toBe('');
		
		configMgr.processConfigurationDeleted('[{"ConfigurationID":"' + configID + '"}]');

		expect(configMgr.currentConfigurationName).toBe('');

	});

	test('valid parameters, removes configuration from local memory', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());

		let configNum = 6;
		let configID = configMgr.configurations[configNum].ConfigurationID;
		configMgr.currentConfiguration = configMgr.configurations[configNum].ConfigurationID;
		let numConfigs = configMgr.configurations.length;
		
		configMgr.processConfigurationDeleted('[{"ConfigurationID":"' + configID + '"}]');

		expect(configMgr.configurations.length).toBe(numConfigs - 1);
		expect(parseInt(configMgr.configurations[configNum].ConfigurationID)).not.toBe(configID);

	});

	test('valid parameters, clears configuration settings', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		let configNum = 6;
		let configID = configMgr.configurations[configNum].ConfigurationID;
		expect(configMgr.configurationSettings.length).toBeGreaterThan(0);
		
		configMgr.processConfigurationDeleted('[{"ConfigurationID":"' + configID + '"}]');

		expect(configMgr.configurationSettings.length).toBe(0);

	});

	test('valid parameters, triggers listener', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurations = JSON.parse(getConfigurations());
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		let configNum = 6;
		let configID = configMgr.configurations[configNum].ConfigurationID;

		let functionCalled = false;
		function configDeleted(data)
		{
			expect(parseInt(data.ConfigurationID)).toBe(parseInt(configID));
			functionCalled = true;
			done();
		}
		
		configMgr.on('configurationDeleted', configDeleted);
		configMgr.processConfigurationDeleted('[{"ConfigurationID":"' + configID + '"}]');
		expect(functionCalled).toBe(true);

	});

	test('empty JSON object throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('not found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationDeleted('[]');

		expect(errorOccurred).toBe(true);

	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}


		configMgr.processConfigurationDeleted('fred');

		expect(errorOccurred).toBe(true);

	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurationDeleted(databaseError);

		expect(errorOccurred).toBe(true);
	});
});

describe('retrieveConfigurationSettings', ()=>
{
	test('configuration ID invalid, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('is invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.retrieveConfigurationSettings();
		expect(errorOccurred).toBe(true);
	});

	test('configuration ID not an integer, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('is invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.retrieveConfigurationSettings('fred');
		expect(errorOccurred).toBe(true);
	});

	test('valid parameters, calls database', ()=>
	{
		let configMgr = new ConfigurationManager(true);

		let fn = jest.fn();
		global.ProcessDatabaseRequest = fn;

		configMgr.checkExistingConfigurationID = function(){return true;}

		configMgr.retrieveConfigurationSettings(35);
		expect(fn).toHaveBeenCalled();

	})

	test('configuration ID not in local memory, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('cannot be found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.checkExistingConfigurationID = function(){return false;}

		configMgr.on('error', onError);
		configMgr.retrieveConfigurationSettings(35);
		expect(errorOccurred).toBe(true);

	})

});

describe('processConfigurationSettings', ()=>
{
	test('valid parameters, updates settings', ()=>
	{
		let configMgr = new ConfigurationManager(true);

		expect(configMgr.configurationSettings.length).toBe(0);

		configMgr.processConfigurationSettings(getConfigurationSettings());

		expect(configMgr.configurationSettings.length).toBeGreaterThan(0);

		
	});
	test('valid parameters, triggers listener', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		
		let fn = jest.fn();
		configMgr.on('settingsRetrieved', fn);
		configMgr.processConfigurationSettings(getConfigurationSettings());
		expect(fn).toHaveBeenCalled();

	});

	test('empty JSON object throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('not found');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.processConfigurationSettings('[]');

		expect(errorOccurred).toBe(true);

	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}


		configMgr.processConfigurationSettings('fred');

		expect(errorOccurred).toBe(true);

	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}

		configMgr.processConfigurationSettings(databaseError);

		expect(errorOccurred).toBe(true);
	});

})

describe('getTopLevelNode', ()=>
{
	test.each(
		[
			['datapoint', 'Data Points'],
			['control', 'Control Devices'],
			['reference', 'Reference Sensors'],
			['device', 'Devices'],
			['settings', 'Settings'],
		]
	)('area name passed in, returns expected settings', (areaName, displayValue)=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		let desiredSettings = configMgr.getTopLevelNode(areaName);
		expect(desiredSettings).not.toBe(null);
		expect(desiredSettings.displayValue).toMatch(displayValue);
	});

	test('configurationArea not in memory, returns null', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		let desiredSettings = configMgr.getTopLevelNode('blarg');
		expect(desiredSettings).toBe(null);

	});
	test('missing area name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('blank');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.getTopLevelNode();
		expect(errorOccurred).toBe(true);
	});

});

describe('getChildNodes', ()=>
{
	test('valid configuration area and parameter name, one item, returns one result', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		let foundConfig = configMgr.getChildNodes('datapoint', 'Data Point');
		expect(foundConfig.length).toBe(1);
	});

	test('valid configuration area and parameter name, multiple items, returns multiple results', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		let foundConfig = configMgr.getChildNodes('reference', 'Reference Sensor');
		expect(foundConfig.length).toBeGreaterThan(1);
	});

	test('valid values passed in, no results, returns empty array', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		let foundConfig = configMgr.getChildNodes('blarg', 'blarg');
		expect(foundConfig.length).toBe(0);
		expect(Array.isArray(foundConfig)).toBe(true);
	});

	test('missing area name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('blank');
			expect(data.message).toMatch('Configuration');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.getChildNodes();
		expect(errorOccurred).toBe(true);
	});

	test('missing node name, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;

		function onError(data)
		{
			expect(data.message).toMatch('blank');
			expect(data.message).toMatch('Node');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.getChildNodes('blarg');
		expect(errorOccurred).toBe(true);
	});
	
});

describe('validateSetting', ()=>
{
	test('valid setting, returns true', ()=>
	{
		let setting = {configurationNodeID:2,displayIndex:1,value:'Not Set',nodeSubIndex:1, itemName:'SN'};
		let configMgr = new ConfigurationManager(true);
		expect(configMgr.validateSetting(setting)).toBe(true);
	});


	test('valid setting, case insensitive, returns true', ()=>
	{
		let setting = {CoNfIgUrAtIoNnoDeId:2,displayIndex:1,value:'Not Set', nodeSubIndex:1, itemName:'SN'};
		let configMgr = new ConfigurationManager(true);
		expect(configMgr.validateSetting(setting)).toBe(true);
	});


	test.each(
		[
			[{displayIndex:1,value:'Not Set',nodeSubIndex:1}],
			[{configurationNodeID:2,value:'Not Set',nodeSubIndex:1}],
			[{configurationNodeID:2,displayIndex:1,nodeSubIndex:1}],
			[{configurationNodeID:2,displayIndex:1,value:'Not Set'}],
			[{configrationNodeID:2,displayIndex:1,value:'Not Set',nodeSubIndex:1}],
			[{configurationNodeID:2,displayIdex:1,value:'Not Set',nodeSubIndex:1}],
			[{configurationNodeID:2,displayIndex:1,vale:'Not Set',nodeSubIndex:1}],
			[{configurationNodeID:2,displayIndex:1,value:'Not Set',nodSubIndex:1}]
		]
	)('incorrect setting key, throws error', (setting)=>
	{
		let fn = jest.fn();

		let configMgr = new ConfigurationManager(true);
		function ErrorOccurred(data)
		{
			expect(data.message).toMatch('Unable to locate');
			expect(data.message).not.toMatch('pattern');
			fn();
		}

		configMgr.on('error', ErrorOccurred);
		configMgr.validateSetting(setting);
		expect(fn).toHaveBeenCalled();
	});

	test('no setting passed in, throws error', ()=>
	{
		let fn = jest.fn();

		let configMgr = new ConfigurationManager(true);
		function onError(data)
		{
			expect(data.message).toMatch('No setting object');
			expect(data.message).not.toMatch('pattern');
			fn();
		}

		configMgr.on('error', onError);
		configMgr.validateSetting();
		expect(fn).toHaveBeenCalled();
		
	});
});



describe('updateSetting', ()=>
{
	test('valid setting, setting exists, updates setting', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		expect(JSON.stringify(configMgr.configurationSettings)).not.toMatch('fred mertz');
		configMgr.updateSetting({
			configurationNodeID:19,
			displayIndex:1,
			itemName:'Measurand',
			value:'fred mertz',
			nodeSubIndex:1
		})
		expect(JSON.stringify(configMgr.configurationSettings)).toMatch('fred mertz');
	});

	test('setting does not exist, does not update settings', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		expect(JSON.stringify(configMgr.configurationSettings)).not.toMatch('fred mertz');
		configMgr.updateSetting({
			configurationNodeID:19,
			displayIndex:1,
			itemName:'blarg',
			value:'fred mertz',
			nodeSubIndex:1
		})
		expect(JSON.stringify(configMgr.configurationSettings)).not.toMatch('fred mertz');

	});

	test('invalid setting, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		function ErrorOccurred(data)
		{
			expect(data.message).toMatch('Unable to locate');
			expect(data.message).not.toMatch('pattern');
			done();
		}
		let newSetting = {CnfigurationArea:'setpoint', OptionIndex:999, ParameterIndex:0, ItemName:'Measurand', ItemValue:'Temperature'};
		configMgr.on('error', ErrorOccurred);
		configMgr.updateSetting(newSetting);
	});

	test('empty setting, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());

		function ErrorOccurred(data)
		{
			expect(data.message).toMatch('No setting');
			expect(data.message).not.toMatch('pattern');
			done();
		}
		configMgr.on('error', ErrorOccurred);
		configMgr.updateSetting();
	});
});

describe('retrieveExternalConfigurations', ()=>
{
	test('valid parameters, calls database', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		let systemID = 35;

		let fn = jest.fn();

		global.ProcessDatabaseRequest = function(parameters, callback)
		{
			fn();
		};

		configMgr.processExternalConfigurations = function(){};

		configMgr.retrieveExternalConfigurations(systemID);
		expect(fn).toHaveBeenCalled();

	});
	test('missing system id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.retrieveExternalConfigurations();
		expect(errorOccurred).toBe(true);
	});

	test('missing system id, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		function onError(data)
		{
			expect(data.message).toMatch('invalid');
			expect(data.message).not.toMatch('pattern');
			errorOccurred = true;
			done();
		}

		configMgr.on('error', onError);
		configMgr.retrieveExternalConfigurations('fred');
		expect(errorOccurred).toBe(true);
	});
});

describe('processExternalConfigurations', ()=>
{
	test('valid parameters returned, triggers listener', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let functionCalled = false;
		function configurationsGotten(data)
		{
			expect(JSON.stringify(data)).toBe(getExternalConfigurations());
			functionCalled = true;
			done();
		}
		configMgr.on('externalConfigurationsRetrieved', configurationsGotten);
		configMgr.processExternalConfigurations(getExternalConfigurations());
	});

	test('database error, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);
		let errorOccurred = false;
		configMgr.processDatabaseError = function(data)
		{
			expect(data).toMatch(databaseError);
			errorOccurred = true;
			done();
		}
		configMgr.processExternalConfigurations(databaseError);
		expect(errorOccurred).toBe(true);

	});

	test('invalid JSON, throws error', done=>
	{
		let configMgr = new ConfigurationManager(true);

		let errorOccurred = false;

		configMgr.processDatabaseError = function onError(data)
		{
			expect(data).toBe('fred');
			errorOccurred = true;
			done();
		}

		configMgr.processExternalConfigurations('fred');
		expect(errorOccurred).toBe(true);
	});
});

describe('setupDeviceList', ()=>
{
	test('valid configuration area, sets up list', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		configMgr.setupDeviceList('reference');
	});

	test('invalid configuration area, throws error', ()=>
	{

	});

	test('no devices configured, creates list of one item', ()=>
	{

	});

	test('multiple devices configured, creates correct size list', ()=>
	{

	});

	test('valid configuration area, creates list of device objects', ()=>
	{

	});

	test('device is reference, sets flag', ()=>
	{

	});
});

describe('setupSettings', ()=>
{
	test('do something', ()=>
	{
		let configMgr = new ConfigurationManager(true);
		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
		configMgr.setupSettings();
	});
});

// describe('save', ()=>
// {
// 	test('configuration settings exist, calls database', ()=>
// 	{
// 		let configMgr = new ConfigurationManager(true);
// 		let fn = jest.fn();
// 		global.ProcessDatabaseRequest = function(parameters)
// 		{
// 			fn();
// 		}

// 		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
// 		configMgr.save();
// 		expect(fn).toHaveBeenCalled();
// 	});

// 	test('no settings, throws error', done=>
// 	{
// 		let configMgr = new ConfigurationManager(true);
		
// 		let errorOccurred = false;
// 		function onError (data)
// 		{
// 			expect(data.message).toMatch('settings');
// 			expect(data.message).not.toMatch('pattern');
// 			errorOccurred = true;
// 			done();
// 		}

// 		configMgr.on('error', onError);
// 		configMgr.save();
// 		expect(errorOccurred).toBe(true);
		
// 	});

// 	test('database response, calls correct function', ()=>
// 	{
// 		let configMgr = new ConfigurationManager(true);
// 		configMgr.configurationSettings = JSON.parse(getConfigurationSettings());
// 		global.ProcessDatabaseRequest = function(parameters, callback)
// 		{
// 			callback(getConfigurationSettings());
// 		}

// 		let fn = jest.fn();
// 		configMgr.processConfigurationSettings = function(data)
// 		{
// 			fn();
// 		}

// 		configMgr.save();
// 		expect(fn).toHaveBeenCalled();
// 	});

// });

// describe('getSettings', ()=>
// {
		//Need to do something here
// });

//TODO: Get values from the controls. Currently only getting a top level node or the child nodes
//TODO: Create an addChildNode function for things like set points and devices where you can add more
//TODO:    -- This will create a duplicate of the first child node with all settings set to the default value
//TODO: Create a reorderNodes function.
//TODO:    -- This will put a specific node in a specific location and move all others out of the way
//TODO: Create a duplicateChildNode function which is basically the addChildNode function that keeps all the values
//TODO: Connect up all the buttons
//TODO: Create the controls on the form
//TODO: Update the settings object when the user updates a value in a control
//TODO: Trigger save when the user closes the settings form.
//TODO: Update the save function in the database to handle the new object structure
//TODO: Remove quantity from node object
//TODO: convert settings to referenceList, deviceList, dataPoints and settings

