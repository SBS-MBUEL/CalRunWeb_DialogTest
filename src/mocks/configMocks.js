'use strict';

let _reference = 
[
	{for:'calibrationOption',
		defaultName:'Reference',
		controls:
	[
		{label:'Device', type:'dropdown', list:['Not Set', 'ACS', 'ECOV2', 'Keithley', 'SBE3', 'SBE4', 'SBE63', 'SKR-Mini', 'SNTL', 'SparkFun', 'TU5300', 'UNO'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'SN', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Port', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Baud', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Settings', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Format', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, titleOrder:-1},
		{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Start Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Add Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addParameter', maxLength:0, titleOrder:-1},
		{label:'Remove Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeParameter', maxLength:0, titleOrder:-1},
		// {label:'Retrieve Coefficients', type:'button', list:[], width:'50px', height:'30px', control:null, value:'retrieveCoefficients', maxLength:0, titleOrder:-1},
		// {label:'Program Coefficients', type:'button', list:[], width:'50px', height:'30px', control:null, value:'programCoefficients', maxLength:0, titleOrder:-1},
		{label:'Read Coefficients from File', type:'button', list:[], width:'50px', height:'30px', control:null, value:'readCoefficientsFromFile', maxLength:0, titleOrder:-1},
		{label:'Add New Reference', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addOption', maxLength:0, titleOrder:-1},
		{label:'Remove This Reference', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeOption', maxLength:0, titleOrder:-1},
	]},
	{for:'calibrationParameter',
		defaultName:'Measurand',
		controls:
	[
		{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'Measurand Sub-Type', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Cal date', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Test value raw', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Test value converted', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Drift', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Offset', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Spike', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Coefficients', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
	]}
];
let _device = 
[
	{for:'calibrationOption',
		defaultName:'Control Device',
		controls:
	[
		{label:'Device', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
		{label:'SN', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Port', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Baud', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Settings', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Format', type:'dropdown', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:-1},
		{label:'Delay before sampling', type:'text', list:[], width:'200px', height:'30px', control:null, value:'0', maxLength:20, titleOrder:-1},
		{label:'Configuration Commands', type:'textarea', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Sample Command', type:'text', list:[], width:'200px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Add Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addParameter', maxLength:0, titleOrder:-1},
		{label:'Remove Measurand', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeParameter', maxLength:0, titleOrder:-1},
		{label:'Add New System Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addOption', maxLength:0, titleOrder:-1},
		{label:'Remove This System Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeOption', maxLength:0, titleOrder:-1},
	]},
	{for:'calibrationParameter',
		defaultName:'Measurand',
		controls:
	[
		{label:'Measurand', type:'dropdown', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
	]}
];
let _datapoint = 
[
	{for:'calibrationOption',
		defaultName:'Data Point',
		controls:
	[
		{label:'Calculate After', type:'dropdown', list:['Not Set', 'Sine Max', 'Sentinel Offset'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Add Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addParameter', maxLength:0, titleOrder:-1},
		{label:'Remove Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeParameter', maxLength:0, titleOrder:-1},
		{label:'Add Set Point', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addOption', maxLength:0, titleOrder:-1},
		{label:'Remove Set Point', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeOption', maxLength:0, titleOrder:-1}
	]},
	{for:'calibrationParameter',
		defaultName:'Device',
		controls:
	[
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
	]}
];
let _system = 
[
	{for:'calibrationOption',
    defaultName:'System Settings',
    controls:
	[
		{label:'Calibration System Type', type:'dropdown', list:['Not Set', 'Alace', 'Atlas', 'Conductivity', 'ECO', 'Microcat', 'Oxygen', 'Pressure Temperature Compensation', 'SNTL', 'Seacat', 'Temperature'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:1},
		{label:'Calibration System Location', type:'dropdown', list:['Not Set', 'Bellevue', 'China', 'Kempten', 'Philomath', 'Seacat Cal Room', 'Small Sensor Cal Room', 'daveg desk'], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:2},
		{label:'Number of sequential calibrations', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Samples to average', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Coefficient of Variation (max)', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Additional Wait Time Once Stable (ms)', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Sample Interval', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Data Point Timeout', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Number of devices to calibrate', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Reference Sensor Timeout', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Device Under Test Timeout', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Drain relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Fill relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Flow relay', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},		
		{label:'Drain time (sec)', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},		
		{label:'Fill time (sec)', type:'text', list:[], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Notes', type:'textarea', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Sine Max target slope', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Sentinel target offset', type:'text', list:[], width:'50px', height:'30px', control:null, value:'Not Set', maxLength:20, titleOrder:-1},
		{label:'Add Device That Can Be Calibrated', type:'button', list:[], width:'50px', height:'30px', control:null, value:'addParameter', maxLength:0, titleOrder:-1},
		{label:'Remove Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'removeParameter', maxLength:0, titleOrder:-1},
	]},
	{for:'calibrationParameter',
		defaultName:'Device',
		controls:
	[
		{label:'Device', type:'dropdown', list:['Not Set', 'AC-S',	'DeepSeapHoxV2',	'Digiquartz',	'Druck', 'ECOV2',	'FloatpH',	'Keithley',	'Kistler',	'SBE3',
            'SBE37',	'SBE39',	'SBE4',	'SBE63',	'SKR-Mini'], width:'100px', height:'30px', control:null, value:'Not Set', maxLength:0, titleOrder:0},
	]}
];

let systemStatusObjects = 
{
	//TODO: This should come from the database
	parameters: ['Unknown'],
	statusItems:['Countdown', 'Current Time', 'Data Point', 'Errors', 'Status', 'Calibration Cycles', 'Wait Time', 'Configuration', 'Samples to Average'],
	controlItems:['Pump Number', 'Pump Rate', 'Pump Volume', 'Pump Running', 'Flow Pump', 'Drain Valve', 'Fill Valve']

};

let objectCollection = {
    _system, 
    _device, 
    _reference, 
    _datapoint
};