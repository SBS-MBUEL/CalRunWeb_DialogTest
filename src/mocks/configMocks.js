'use strict';

const _reference = [
	{
		for:'calibrationOption',
		defaultName:'Reference',
		controls:
		[
			{label:'Add New Reference', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add reference', maxLength:0, titleOrder:-1},
			{label:'Copy Reference', type:'button', list:[], width:'50px', height:'30px', control:null, value:'copy reference', maxLength:0, titleOrder:-1},
			{label:'Remove This Reference', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove reference', maxLength:0, titleOrder:-1},
			{label:'Device', type:'dropdown', list:['Not Set', 'ACS', 'ECOV2', 'Keithley', 'SBE3', 'SBE4', 'SBE63', 'SKR-Mini', 'SNTL', 'SparkFun', 'TU5300', 'UNO'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:103},
			{label:'SN', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1, settingIndex:104},
			{label:'Port', type:'dropdown', list:['Not Set', 'COM3', 'COM4', 'COM5'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:105},
			{label:'Baud', type:'dropdown', list:['Not Set', '115200', '57600', '38400', '19200', '9600', '4800', '2400', '1200', '600', '300'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:106},
			{label:'Settings', type:'dropdown', list:['Not Set', 'N,8', 'E,7', 'O,7'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:107},
			{label:'Format', type:'dropdown', list:['RS-232', 'RS-485', 'IM'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:108},
			{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, titleOrder:-1, settingIndex:109},
			{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:110},
			{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:111},
			{label:'Start Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:112},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Measurand',
		master:0,
		controls:
		[
			{label:'Add New Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add ref measurand', maxLength:0, titleOrder:-1},
			{label:'Remove This Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove ref measurand', maxLength:0, titleOrder:-1},
			{label:'Read Coefficients from File', type:'button', list:[], width:'50px', height:'30px', control:null, value:'load coeff from file', maxLength:0, titleOrder:-1},
			{label:'Measurand', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:113},
			{label:'Measurand Sub-Type', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:114},
			{label:'Cal date', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:115},
			{label:'Coefficient of Variation (max)', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Test value raw', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:116},
			{label:'Test value converted', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:117},
			{label:'Drift', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:118},
			{label:'Offset', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:119},
			{label:'Spike', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:120},
			{label:'Coefficients', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:121},
		]
	}
];
const _device = [
	{
		for:'calibrationOption',
		defaultName:'Control Device',
		controls: [
			{label:'Add New System Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add device', maxLength:0, titleOrder:-1},
			{label:'Copy Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'copy device', maxLength:0, titleOrder:-1},
			{label:'Remove This System Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove device', maxLength:0, titleOrder:-1},
			{label:'Device', type:'dropdown', list:['Not Set', 'AC-S', 'ECOV2', 'Keithley', 'SBE3', 'SBE4', 'SBE63', 'SKR-MINI', 'SNTL', 'SparkFun', 'UNO'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0, settingIndex:93},
			{label:'SN', type:'text', list:['Not Set', 'COM3', 'COM4', 'COM5'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1, settingIndex: 94},
			{label:'Port', type:'dropdown', list:['Not Set', 'COM3', 'COM4', 'COM5'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex: 95},
			{label:'Baud', type:'dropdown', list:['Not Set', '115200', '57600', '38400', '19200', '9600', '4800', '2400', '1200', '600', '300'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex: 96},
			{label:'Settings', type:'dropdown', list:['Not Set', 'N,8', 'E,7', 'O,7'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex: 97},
			{label:'Format', type:'dropdown', list:['RS-232', 'RS-485', 'IM'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex: 98},
			{label:'Delay before sampling', type:'number', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, titleOrder:-1, settingIndex: 99},
			{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex: 100},
			{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex: 101},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Measurand',
		master: 0,
		controls: [
			{label:'Add Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add cal measurand', maxLength:0, titleOrder:-1},
			{label:'Copy Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'copy cal measurand', maxLength:0, titleOrder:-1},
			{label:'Remove Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove cal measurand', maxLength:0, titleOrder:-1},
			{label:'Measurand', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:"Control Device-0", value:'Not Set', maxLength:0, titleOrder:0, settingIndex: 10},
			{label:'Measurand Sub-Type', type:'dropdown', list:['Not Set',	'Backscatter', 'Chlorophyll',	'Conductivity',	'FDOM',	'FLPC',	'FLPE',	'FLRH',	'FLUR',	'NTU',	'Oxygen',	'Phenanthrene', 'Pressure',	'Temperature',	'Voltage',	'pH'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1, settingIndex:11},
		]
	},
];
const _datapoint = [
	{
		for:'calibrationOption',
		defaultName:'Data Point',
		controls:
		[
			{label:'Add Setpoint', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add setpoint', maxLength:0, titleOrder:-1},
			{label:'Remove Setpoint', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove setpoint', maxLength:0, titleOrder:-1},
			{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:10},
			
		]	
	},
	{
		for:'calibrationOption',
		defaultName:'Data Point',
		controls:
		[
			{label:'Add Setpoint', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add setpoint', maxLength:0, titleOrder:-1},
			{label:'Remove Setpoint', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove setpoint', maxLength:0, titleOrder:-1},
			{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1, settingIndex:10},
			
		]	
	},
	{
		for:'calibrationParameter',
		defaultName:'Device',
		master: 0,
		controls:
		[
			{label:'Add Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add SP device data', maxLength:0, titleOrder:-1},
			{label:'Remove Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove SP device data', maxLength:0, titleOrder:-1},
			{label:'Device Type', type:'dropdown', list:['Reference', 'System'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
			{label:'Model', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:1},
			{label:'SN', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:3},
			{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},		
			{label:'Peristaltic Pump Number', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Injection Volume', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Pump Rate', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Drain', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Fill', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Setpoint',
		master: 0,
		controls:
		[
			{label:'Add Set Point', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add SP setpoint data', maxLength:0, titleOrder:-1},
			{label:'Remove Set Point', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove SP setpoint data', maxLength:0, titleOrder:-1},
			{label:'Device Type', type:'dropdown', list:['Reference', 'System'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
			{label:'Model', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:1},
			{label:'SN', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:3},
			{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},		
			{label:'Peristaltic Pump Number', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Injection Volume', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Pump Rate', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Drain', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Fill', type:'dropdown', list:['yes', 'no'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		]
	}

];
const _system = [
	{
		for:'calibrationOption',
    	defaultName:'System Settings',
    	controls:
		[
			{label:'Calibration System Type', type:'dropdown', list:['Not Set', 'Alace', 'Atlas', 'Conductivity', 'ECO', 'Microcat', 'Oxygen', 'Pressure Temperature Compensation', 'SNTL', 'Seacat', 'Temperature'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1},
			{label:'Calibration System Location', type:'dropdown', list:['Not Set', 'Bellevue', 'China', 'Kempten', 'Philomath', 'Seacat Cal Room', 'Small Sensor Cal Room', 'daveg desk'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
			{label:'Number of sequential calibrations', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Samples to average', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Additional Wait Time Once Stable (ms)', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Sample Interval', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Data Point Timeout', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Number of devices to calibrate', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Reference Sensor Timeout', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Device Under Test Timeout', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Drain relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Fill relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Flow relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},		
			{label:'Drain time (sec)', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},		
			{label:'Fill time (sec)', type:'number', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Notes', type:'textarea', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Sine Max target slope', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
			{label:'Sentinel target offset', type:'number', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		]
	},
	{
		for:'calibrationParameter',
		defaultName:'Device',
		master: 0,
		controls:
		[
			{label:'Add Device That Can Be Calibrated', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add device', maxLength:0, titleOrder:-1},
			{label:'Copy Device Last Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'copy device', maxLength:0, titleOrder:-1},
			{label:'Remove Last Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove device', maxLength:0, titleOrder:-1},
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

const objectCollection = {
    _system, 
    _device, 
    _reference, 
    _datapoint
};

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     module.exports = {
		objectCollection: objectCollection

     };
 }