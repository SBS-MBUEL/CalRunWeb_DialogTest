'use strict';

const tabNames = [
    {
        'id': 'controlDevices',
        'name': 'Control Devices',
        'classIcon':'fa fa-desktop'
    },
    {
        'id': 'systemConfiguration',
        'name': 'System Config',
        'classIcon':'fa fa-cube'
    },
    {
        'id':'setPoints',
        'name':'Set Points',
        'classIcon':'fa fa-circle-o'
    },
    {
        'id':'references',
        'name':'References',
        'classIcon':'fa fa-thermometer-half'
    }
];

const controlTabContent = {
        "id":"controlDevices",
        "title":"Control Devices",
        "header": [
            {
                "colSize":"1",
                "textContent":"Device",
            },
            {
                "colSize":"1",
                "textContent":"SN",
            },
            {
                "colSize":"1",
                "textContent":"Port",
            },
            {
                "colSize":"1",
                "textContent":"Baud",
            },
            {
                "colSize":"1",
                "textContent":"Settings",
            },
            {
                "colSize":"1",
                "textContent":"Format",
            },
            {
                "colSize":"1",
                "textContent":"Delay Before Sampling",
            },
            {
                "colSize":"1",
                "textContent":"Configuration Commands",
            },
            {
                "colSize":"1",
                "textContent":"Sample Command",
            },
            {
                "colSize":"2",
                "textContent":"Measurands",
            },
            {
                "colSize":"1",
                "textContent":"Update",
            },

        ],
        "inputRow": [
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Device",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"SN",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Port",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Baud",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Settings",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Format",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Delay Before",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Set",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Set",
            },
            {
                "colSize":"2",
                "element":"div",
                "className":"btn btn-primary",
                "textContent":"Add Measurand",
            },
            {
                "colSize":"1",
                "element":"div",
                "className":"row",
                "textContent":"",
                "subContent":[
                    {
                        "colSize":"4",
                        "className":"empty",
                        "element":"div",
                        "textContent":" "
                    },
                    {
                        "colSize":"4",
                        "className":"empty",
                        "element":"div",
                        "textContent":" "
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn-success",
                        "subClassName":"fa fa-plus"
                    },
                ]
            },
        ]
};

const systemTabContent = {
        "id":"systemConfiguration",
        "title":"System Config",
        "header": [
            {
                "colSize":"1",
                "textContent":"Calibration System Type",
            },
            {
                "colSize":"1",
                "textContent":"Calibration Location",
            },
            {
                "colSize":"1",
                "textContent":"Number of Devices",
            },
            {
                "colSize":"1",
                "textContent":"Sequential Calibrations",
            },
            {
                "colSize":"1",
                "textContent":"Samples To Average",
            },
            {
                "colSize":"1",
                "textContent":"CoV",
            },
            {
                "colSize":"1",
                "textContent":"Wait Time after Stable",
            },
            {
                "colSize":"1",
                "textContent":"Sample Interval",
            },
            {
                "colSize":"1",
                "textContent":"Data Point Timeout",
            },
            {
                "colSize":"1",
                "textContent":"Fill",
            },
            {
                "colSize":"1",
                "textContent":"Calulate After",
            },
            {
                "colSize":"1",
                "textContent":"Update",
            },

        ],
        "inputRow": [
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Device",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"SN",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Port",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Baud",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Format",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Delay",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Set",
            },
            {
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Set",
            },
            {
                "colSize":"1",
                "element":"div",
                "className":"row",
                "textContent":"",
                "subContent":[
                    {
                        "colSize":"4",
                        "className":"empty",
                        "element":"div",
                        "textContent":" "
                    },
                    {
                        "colSize":"4",
                        "className":"empty",
                        "element":"div",
                        "textContent":" "
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn-success",
                        "subClassName":"fa fa-plus"
                    },
                ]
            },
        ]
};

const setPointTabContent =  {
    "id":"setPoints",
    "title":"Set Points",
    "header": [
        {
            "colSize":"1",
            "textContent":"Device",
        },
        {
            "colSize":"1",
            "textContent":"SN",
        },
        {
            "colSize":"1",
            "textContent":"Baud",
        },
        {
            "colSize":"1",
            "textContent":"Format",
        },
        {
            "colSize":"1",
            "textContent":"Delay",
        },
        {
            "colSize":"1",
            "textContent":"Commands to Configure",
        },
        {
            "colSize":"1",
            "textContent":"Sample Commands",
        },
        {
            "colSize":"1",
            "textContent":"Measurands",
        },
        {
            "colSize":"1",
            "textContent":"Update",
        },

    ],
    "inputRow": [
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Device",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"SN",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Port",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Baud",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Format",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Delay",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Set",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Set",
        },
        {
            "colSize":"3",
            "element":"div",
            "className":"btn btn-primary",
            "textContent":"Add Measurand",
        },
        {
            "colSize":"1",
            "element":"div",
            "className":"row",
            "textContent":"",
            "subContent":[
                {
                    "colSize":"4",
                    "className":"empty",
                    "element":"div",
                    "textContent":" "
                },
                {
                    "colSize":"4",
                    "className":"empty",
                    "element":"div",
                    "textContent":" "
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-success",
                    "subClassName":"fa fa-plus"
                },
            ]
        },
    ]
};

const referenceTabContent = {
    "id":"references",
    "title":"References",
    "header": [
        {
            "colSize":"1",
            "textContent":"Device",
        },
        {
            "colSize":"1",
            "textContent":"SN",
        },
        {
            "colSize":"1",
            "textContent":"Baud",
        },
        {
            "colSize":"1",
            "textContent":"Format",
        },
        {
            "colSize":"1",
            "textContent":"Delay",
        },
        {
            "colSize":"1",
            "textContent":"Commands to Configure",
        },
        {
            "colSize":"1",
            "textContent":"Sample Commands",
        },
        {
            "colSize":"1",
            "textContent":"Measurands",
        },
        {
            "colSize":"1",
            "textContent":"Update",
        },

    ],
    "inputRow": [
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Device",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"SN",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Port",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Baud",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Format",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Delay",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Set",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"Set",
        },
        {
            "colSize":"3",
            "element":"div",
            "className":"btn btn-primary",
            "textContent":"Add Measurand",
        },
        {
            "colSize":"1",
            "element":"div",
            "className":"row",
            "textContent":"",
            "subContent":[
                {
                    "colSize":"4",
                    "className":"empty",
                    "element":"div",
                    "textContent":" "
                },
                {
                    "colSize":"4",
                    "className":"empty",
                    "element":"div",
                    "textContent":" "
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-success",
                    "subClassName":"fa fa-plus"
                },
            ]
        },
    ]
}

// TODO: fix content of this configuration to match the existing page
const tabContent = [
    controlTabContent, 
    systemTabContent, 
    setPointTabContent, 
    referenceTabContent
];