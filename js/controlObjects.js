'use strict';

const databaseTabs = [
    {
        "ConfigurationArea": "system",
        "VisibleToUser": "1",
        "Icon": "fa fa-wrench"
    },
    {
        "ConfigurationArea": "device",
        "VisibleToUser": "1",
        "Icon": "fa fa-gamepad"
    },
    {
        "ConfigurationArea": "reference",
        "VisibleToUser": "1",
        "Icon": "fa fa-thermometer-half"
    },
    {
        "ConfigurationArea": "datapoint",
        "VisibleToUser": "1",
        "Icon": "fa fa-map-marker"
    }
];

const _reference = [
	{
		for:'calibrationOption',
		defaultName:'Reference',
		controls:
		[
			{label:'Add New Reference', type:'button', list:[], control:null, value:'add reference', maxLength:0},
			{label:'Copy Reference', type:'button', list:[], control:null, value:'copy reference', maxLength:0,},
			{label:'Remove This Reference', type:'button', list:[], control:null, value:'remove reference', maxLength:0,},
			{label:'Device', type:'dropdown', list:['Not Set', 'ACS', 'ECOV2', 'Keithley', 'SBE3', 'SBE4', 'SBE63', 'SKR-Mini', 'SNTL', 'SparkFun', 'TU5300', 'UNO'], control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:103},
			{label:'SN', type:'text', list:[], control:null, value:'Not Set', maxLength:20, titleOrder:1, settingIndex:104},
			{label:'Port', type:'dropdown', list:['Not Set', 'COM3', 'COM4', 'COM5'], control:null, value:'Not Set', maxLength:0, settingIndex:105},
			{label:'Baud', type:'dropdown', list:['Not Set', '115200', '57600', '38400', '19200', '9600', '4800', '2400', '1200', '600', '300'], control:null, value:'Not Set', maxLength:0, settingIndex:106},
			{label:'Settings', type:'dropdown', list:['Not Set', 'N,8', 'E,7', 'O,7'], control:null, value:'Not Set', maxLength:0, settingIndex:107},
			{label:'Format', type:'dropdown', list:['RS-232', 'RS-485', 'IM'], control:null, value:'Not Set', maxLength:0, settingIndex:108},
			{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, settingIndex:109},
			{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:110},
			{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:111},
			{label:'Start Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:112},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Measurand',
		master:0,
		controls:
		[
			{label:'Add New Measurand', type:'button', list:[], control:null, value:'add ref measurand', maxLength:0,},
			{label:'Remove This Measurand', type:'button', list:[], control:null, value:'remove ref measurand', maxLength:0,},
			{label:'Read Coefficients from File', type:'button', list:[], control:null, value:'load coeff from file', maxLength:0,},
			{label:'Measurand', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:113},
			{label:'Measurand Sub-Type', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, settingIndex:114},
			{label:'Cal date', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:115},
			{label:'Coefficient of Variation (max)', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Test value raw', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:116},
			{label:'Test value converted', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:117},
			{label:'Drift', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:118},
			{label:'Offset', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:119},
			{label:'Spike', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:120},
			{label:'Coefficients', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:121},
		]
	}
];
const _device = [
	{
		for:'calibrationOption',
		defaultName:'Control Device',
		controls: [
			{label:'Add New System Device', type:'button', list:[], control:null, value:'add device', maxLength:0,},
			{label:'Copy Device', type:'button', list:[], control:null, value:'copy device', maxLength:0,},
			{label:'Remove This System Device', type:'button', list:[], control:null, value:'remove device', maxLength:0,},
			{label:'Device', type:'dropdown', list:['Not Set', 'AC-S', 'ECOV2', 'Keithley', 'SBE3', 'SBE4', 'SBE63', 'SKR-MINI', 'SNTL', 'SparkFun', 'UNO'], control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:93},
			{label:'SN', type:'text', list:['Not Set', 'COM3', 'COM4', 'COM5'], control:null, value:'Not Set', maxLength:20, titleOrder:1, settingIndex: 94},
			{label:'Port', type:'dropdown', list:['Not Set', 'COM3', 'COM4', 'COM5'], control:null, value:'Not Set', maxLength:0, settingIndex: 95},
			{label:'Baud', type:'dropdown', list:['Not Set', '115200', '57600', '38400', '19200', '9600', '4800', '2400', '1200', '600', '300'], control:null, value:'Not Set', maxLength:0, settingIndex: 96},
			{label:'Settings', type:'dropdown', list:['Not Set', 'N,8', 'E,7', 'O,7'], control:null, value:'Not Set', maxLength:0, settingIndex: 97},
			{label:'Format', type:'dropdown', list:['RS-232', 'RS-485', 'IM'], control:null, value:'Not Set', maxLength:0, settingIndex: 98},
			{label:'Delay before sampling', type:'number', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, settingIndex: 99},
			{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex: 100},
			{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex: 101},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Measurand',
		master: 0,
		controls: [
			{label:'Add Measurand', type:'button', list:[], control:null, value:'add cal measurand', maxLength:0,},
			{label:'Copy Measurand', type:'button', list:[], control:null, value:'copy cal measurand', maxLength:0,},
			{label:'Remove Measurand', type:'button', list:[], control:null, value:'remove cal measurand', maxLength:0,},
			{label:'Measurand', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:"Control Device-0", value:'Not Set', maxLength:0, titleOrder:0, settingIndex: 10},
			{label:'Measurand Sub-Type', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, settingIndex:11},
		]
	},
];
const _datapoint = [
	{
		for:'calibrationOption',
		defaultName:'Data Point',
		controls:
		[
			{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:10},
			
		]	
	},
	{
		for:'calibrationOption',
		defaultName:'Data Point',
		controls:
		[
			{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, settingIndex:10},
			
		]	
	},
	{
		for:'calibrationParameter',
		defaultName:'Device',
		master: 0,
		controls:
		[
			{label:'Add Device', type:'button', list:[], control:null, value:'add SP device data', maxLength:0,},
			{label:'Remove Device', type:'button', list:[], control:null, value:'remove SP device data', maxLength:0,},
			{label:'Device Type', type:'dropdown', list:['Reference', 'System'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
			{label:'Model', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:1},
			{label:'SN', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:3},
			{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0,},		
			{label:'Peristaltic Pump Number', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Injection Volume', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Pump Rate', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Drain', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Fill', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Setpoint',
		master: 0,
		controls:
		[
			{label:'Add Set Point', type:'button', list:[], control:null, value:'add SP setpoint data', maxLength:0,},
			{label:'Remove Set Point', type:'button', list:[], control:null, value:'remove SP setpoint data', maxLength:0,},
			{label:'Device Type', type:'dropdown', list:['Reference', 'System'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
			{label:'Model', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:1},
			{label:'SN', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:3},
			{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0,},		
			{label:'Peristaltic Pump Number', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Injection Volume', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Pump Rate', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Drain', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Fill', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		]
	}

];
const _system = [
	{
		for:'calibrationOption',
    	defaultName:'System Settings',
    	controls:
		[
			{label:'Calibration System Type', type:'dropdown', list:['Not Set', 'Alace', 'Atlas', 'Conductivity', 'ECO', 'Microcat', 'Oxygen', 'Pressure Temperature Compensation', 'SNTL', 'Seacat', 'Temperature'], control:null, value:'Not Set', maxLength:20, titleOrder:1},
			{label:'Calibration System Location', type:'dropdown', list:['Not Set', 'Bellevue', 'China', 'Kempten', 'Philomath', 'Seacat Cal Room', 'Small Sensor Cal Room', 'daveg desk'], control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Number of sequential calibrations', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Samples to average', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Additional Wait Time Once Stable (ms)', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Sample Interval', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Data Point Timeout', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Number of devices to calibrate', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Reference Sensor Timeout', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Device Under Test Timeout', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Drain relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Fill relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Flow relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},		
			{label:'Drain time (sec)', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},		
			{label:'Fill time (sec)', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
			{label:'Notes', type:'textarea', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Sine Max target slope', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
			{label:'Sentinel target offset', type:'number', list:[], control:null, value:'Not Set', maxLength:20,},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Device',
		master: 0,
		controls:
		[
			{label:'Add Device That Can Be Calibrated', type:'button', list:[], control:null, value:'add device', maxLength:0,},
			{label:'Copy Device Last Device', type:'button', list:[], control:null, value:'copy device', maxLength:0,},
			{label:'Remove Last Device', type:'button', list:[], control:null, value:'remove device', maxLength:0,},
			{label:'Device', type:'dropdown', list:['Not Set', 'AC-S',	'DeepSeapHoxV2',	'Digiquartz',	'Druck', 'ECOV2',	'FloatpH',	'Keithley',	'Kistler',	'SBE3',
				'SBE37',	'SBE39',	'SBE4',	'SBE63',	'SKR-Mini'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		]
	}
];

const systemStatusObjects = {
	//TODO: This should come from the database
	parameters: ['Unknown'],
	statusItems:['Countdown', 'Current Time', 'Data Point', 'Errors', 'Status', 'Calibration Cycles', 'Wait Time', 'Configuration', 'Samples to Average'],
	controlItems:['Pump Number', 'Pump Rate', 'Pump Volume', 'Pump Running', 'Flow Pump', 'Drain Valve', 'Fill Valve']

};

const settingsCollection = {
    _system, 
    _device, 
    _reference, 
    _datapoint
};

let referenceObjects = 
[
	{for:'calibrationOption',
		defaultName:'Reference',
		controls:
	[
		{label:'Device', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'SN', type:'text', list:[], control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Port', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Baud', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Settings', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Format', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20,},
		{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Start Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Add Measurand', type:'button', list:[], control:null, value:'addParameter', maxLength:0,},
		{label:'Remove Measurand', type:'button', list:[], control:null, value:'removeParameter', maxLength:0,},
		// {label:'Retrieve Coefficients', type:'button', list:[], control:null, value:'retrieveCoefficients', maxLength:0,},
		// {label:'Program Coefficients', type:'button', list:[], control:null, value:'programCoefficients', maxLength:0,},
		{label:'Read Coefficients from File', type:'button', list:[], control:null, value:'readCoefficientsFromFile', maxLength:0,},
		{label:'Add New Reference', type:'button', list:[], control:null, value:'addOption', maxLength:0,},
		{label:'Remove This Reference', type:'button', list:[], control:null, value:'removeOption', maxLength:0,},
	]},
	{for:'calibrationParameter',
		defaultName:'Measurand',
		controls:
	[
		{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0,},
		{label:'Cal date', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Test value raw', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Test value converted', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Drift', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Offset', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Spike', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Coefficients', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
	]}
];
let controllerObjects = 
[
	{for:'calibrationOption',
		defaultName:'Control Device',
		controls:
	[
		{label:'Device', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'SN', type:'text', list:[], control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Port', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Baud', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Settings', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Format', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:0,},
		{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20,},
		{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Add Measurand', type:'button', list:[], control:null, value:'addParameter', maxLength:0,},
		{label:'Remove Measurand', type:'button', list:[], control:null, value:'removeParameter', maxLength:0,},
		{label:'Add New System Device', type:'button', list:[], control:null, value:'addOption', maxLength:0,},
		{label:'Remove This System Device', type:'button', list:[], control:null, value:'removeOption', maxLength:0,},
	]},
	{for:'calibrationParameter',
		defaultName:'Measurand',
		controls:
	[
		{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
	]}
];
let dataPointObjects = 
[
	{for:'calibrationOption',
		defaultName:'Data Point',
		controls:
	[
		{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Add Device', type:'button', list:[], control:null, value:'addParameter', maxLength:0,},
		{label:'Remove Device', type:'button', list:[], control:null, value:'removeParameter', maxLength:0,},
		{label:'Add Set Point', type:'button', list:[], control:null, value:'addOption', maxLength:0,},
		{label:'Remove Set Point', type:'button', list:[], control:null, value:'removeOption', maxLength:0,}
	]},
	{for:'calibrationParameter',
		defaultName:'Device',
		controls:
	[
		{label:'Device Type', type:'dropdown', list:['Reference', 'System'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'Model', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:1},
		{label:'SN', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
		{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:3},
		{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0,},		
		{label:'Peristaltic Pump Number', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Injection Volume', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Pump Rate', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Drain', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Fill', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
	]}
];
let systemObjects = 
[
	{for:'calibrationOption',
		defaultName:'System Settings',
		controls:
	[
		{label:'Calibration System Type', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Calibration System Location', type:'dropdown', list:[], control:null, value:'Not Set', maxLength:20, titleOrder:2},
		{label:'Number of sequential calibrations', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Samples to average', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Coefficient of Variation (max)', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Additional Wait Time Once Stable (ms)', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Sample Interval', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Data Point Timeout', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Number of devices to calibrate', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Reference Sensor Timeout', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Device Under Test Timeout', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Drain relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Fill relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Flow relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},		
		{label:'Drain time (sec)', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},		
		{label:'Fill time (sec)', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20,},
		{label:'Notes', type:'textarea', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Sine Max target slope', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Sentinel target offset', type:'text', list:[], control:null, value:'Not Set', maxLength:20,},
		{label:'Add Device That Can Be Calibrated', type:'button', list:[], control:null, value:'addParameter', maxLength:0,},
		{label:'Remove Device', type:'button', list:[], control:null, value:'removeParameter', maxLength:0,},
	]},
	{for:'calibrationParameter',
		defaultName:'Device',
		controls:
	[
		{label:'Device', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
	]}
];