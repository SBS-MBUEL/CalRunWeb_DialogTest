import { RemoveItemFromArray, FilterElementsOnTextContent } from '../utils/ArrayUtils';

const test_array = ['test1', 'test2', 'test3', 'test4', 'test5'];

const test_array_2 = [
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1
            }
        ],
        "indice": 0
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-1",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "ECOV2",
                "maxLength": 0,
                "titleOrder": 0
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "6654",
                "maxLength": 20,
                "titleOrder": 1
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM4",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "115200",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "66",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1
            }
        ],
        "indice": 1
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 2
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-1",
                "value": "Chlorophyll",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 3
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 4
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1
            }
        ],
        "indice": 5
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 6
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": 0,
                "settingIndex": 175
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": 1,
                "settingIndex": 176
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 177
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 178
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 179
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 180
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 181
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 182
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 183
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 184
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 185
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 186
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 187
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 188
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 189
            }
        ],
        "indice": 7
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 8
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": 0,
                "settingIndex": 175
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": 1,
                "settingIndex": 176
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 177
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 178
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 179
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 180
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 181
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 182
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 183
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 184
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 185
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 186
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 187
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 188
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 189
            }
        ],
        "indice": 9
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 10
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1
            }
        ],
        "indice": 11
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 12
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0,
                "settingIndex": 223
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1,
                "settingIndex": 224
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 225
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 226
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 227
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 228
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 229
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 230
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 231
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 232
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 233
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 234
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 235
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 236
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 237
            }
        ],
        "indice": 13
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 14
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0,
                "settingIndex": 239
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1,
                "settingIndex": 240
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 241
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 242
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 243
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 244
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 245
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 246
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1,
                "settingIndex": 247
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 248
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 249
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 250
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 251
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 252
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1,
                "settingIndex": 253
            }
        ],
        "indice": 15
    },
    {
        "for": "calibrationParameter",
        "defaultName": "Measurand",
        "controls": [
            {
                "label": "Measurand-0",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "Backscatter",
                    "Chlorophyll",
                    "Conductivity",
                    "FDOM",
                    "FLPC",
                    "FLPE",
                    "FLRH",
                    "FLUR",
                    "NTU",
                    "Oxygen",
                    "Phenanthrene",
                    "Pressure",
                    "Temperature",
                    "Voltage",
                    "pH"
                ],
                "width": "100px",
                "height": "30px",
                "control": "Control Device-0",
                "value": "Conductivity",
                "maxLength": 0,
                "titleOrder": 0
            }
        ],
        "indice": 16
    },
    {
        "for": "calibrationOption",
        "defaultName": "Control Device-0",
        "controls": [
            {
                "label": "Device",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "AC-S",
                    "ECOV2",
                    "Keithley",
                    "SBE3",
                    "SBE4",
                    "SBE63",
                    "SKR-MINI",
                    "SNTL",
                    "SparkFun",
                    "UNO"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "SBE4",
                "maxLength": 0,
                "titleOrder": 0
            },
            {
                "label": "SN",
                "type": "text",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "2566",
                "maxLength": 20,
                "titleOrder": 1
            },
            {
                "label": "Port",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "COM3",
                    "COM4",
                    "COM5"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "COM5",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Baud",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "115200",
                    "57600",
                    "38400",
                    "19200",
                    "9600",
                    "4800",
                    "2400",
                    "1200",
                    "600",
                    "300"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "4800",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Settings",
                "type": "dropdown",
                "list": [
                    "Not Set",
                    "N,8",
                    "E,7",
                    "O,7"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "N,8",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Format",
                "type": "dropdown",
                "list": [
                    "RS-232",
                    "RS-485",
                    "IM"
                ],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "RS-232",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Delay before sampling",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "2",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Configuration Commands",
                "type": "textarea",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Sample Command",
                "type": "text",
                "list": [],
                "width": "200px",
                "height": "30px",
                "control": null,
                "value": "Not Set",
                "maxLength": 20,
                "titleOrder": -1
            },
            {
                "label": "Add Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove Measurand",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove measurand",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Add New System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "add device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Copy Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "copy device",
                "maxLength": 0,
                "titleOrder": -1
            },
            {
                "label": "Remove This System Device",
                "type": "button",
                "list": [],
                "width": "50px",
                "height": "30px",
                "control": null,
                "value": "remove device",
                "maxLength": 0,
                "titleOrder": -1
            }
        ],
        "indice": 17
    }
]

describe('remove correct item', ()=> {
    test('passed in index removes item and returns correct array', () => {
        const expected = ['test1', 'test2', 'test4', 'test5'];

        const results = RemoveItemFromArray(test_array, 2);

        for (let i = 0; i < expected.length; i++) {
            expect(results[i]).toBe(expected[i]);
        }

        expect(results).not.toStrictEqual(test_array);
    });
});

describe('remove position zero correct item', ()=> {
    test('passed in index removes item and returns correct array', () => {
        const expected = ['test2', 'test3', 'test4', 'test5'];

        const results = RemoveItemFromArray(test_array, 0);
        console.log(results);
        for (let i = 0; i < expected.length; i++) {
            expect(results[i]).toBe(expected[i]);
        }

        expect(results).not.toStrictEqual(test_array);
    });
});

describe('remove position max correct item', ()=> {
    test('passed in index removes item and returns correct array', () => {
        const expected = ['test1', 'test2', 'test3', 'test4'];

        const results = RemoveItemFromArray(test_array, test_array.length - 1);

        for (let i = 0; i < expected.length; i++) {
            expect(results[i]).toBe(expected[i]);
        }

        expect(results).not.toStrictEqual(test_array);
    });
});

describe('remove correct position in larger array', ()=> {
    test('passed in index removes item and returns correct array', () => {
        const expected = 17;

        const results = RemoveItemFromArray(test_array_2, 4);

        expect(results.length).toBe(expected);

        expect(results).not.toStrictEqual(test_array);
    });
});

describe('properly deal with errors', ()=> {
    test('passed in index of -1 returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(test_array, -1);

        expect(results).toBe(expected);
    });

    test('passed in index of 200 returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(test_array, 200);

        expect(results).toBe(expected);
    });

    test('passed in undefined array returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(undefined, 1);

        expect(results).toBe(expected);
    });
});