'use strict';

const icons = [
    'gamepad',
    'gamepad',
    'gamepad',
    'wrench',
    'map-marker',
    'thermometer-half'
];

const tabNames2 = [...new Set(databaseContent
    .map((el, i) => el.ConfigurationArea))]
    .map((el,  i) => {
        return {
            id : el,
            name: el.toUpperCase(),
            'classIcon': 'fa fa-' + icons[i]
    }
});

const tabNames = [
    {
        'id': 'controlDevices',
        'name': 'Controller Configuration',
        'classIcon':'fa fa-gamepad'
    },
    {
        'id': 'systemConfiguration',
        'name': 'System Config',
        'classIcon':'fa fa-wrench'
    },
    {
        'id':'setPoints',
        'name':'Set Points',
        'classIcon':'fa fac'
    },
    {
        'id':'references',
        'name':'References',
        'classIcon':'fa fa-thermometer-half'
    }
];

const controlTabContentHeader = [
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

];

const controlTabContentInputRow = [
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
];


const controlTabContentDataRows = [
    [
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"ECO-V2",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"210",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"COM-5",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"19200",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"8,N,1",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"RS-232",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"50",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"5",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"10",
        },
        {
            "colSize":"2",
            "element":"div",
            "subContent": [
                {
                    "colSize":"3",
                    "className":"btn btn-primary",
                    "element": "div",
                    "textContent":"Chlorophyll",
                },
                {
                    "colSize":"3",
                    "className":"btn btn-primary",
                    "element": "div",
                    "textContent":"Add Measurand",
                },
            ]
        },
        {
            "colSize":"1",
            "element":"div",
            "className":"row",
            "textContent":"",
            "subContent":[
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-warning",
                    "subClassName":"fa fa-copy"
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-info",
                    "subClassName":"fa fa-save"
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-danger",
                    "subClassName":"fa fa-remove"
                },
            ]
        }
    ],
    [
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"PAR",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"5748",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"COM-4",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"19200",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"8,N,1",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"RS-232",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"50",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"5",
        },
        {
            "colSize":"1",
            "element":"span",
            "className":"controlLink",
            "textContent":"10",
        },
        {
            "colSize":"2",
            "element":"div",
            "subContent": [
                {
                    "colSize":"3",
                    "className":"btn btn-primary",
                    "element": "div",
                    "textContent":"Chlorophyll",
                },
                {
                    "colSize":"3",
                    "className":"btn btn-primary",
                    "element": "div",
                    "textContent":"Add Measurand",
                },
            ]
        },
        {
            "colSize":"1",
            "element":"div",
            "className":"row",
            "textContent":"",
            "subContent":[
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-warning",
                    "subClassName":"fa fa-copy"
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-info",
                    "subClassName":"fa fa-save"
                },
                {
                    "colSize":"4",
                    "element":"div",
                    "className":"btn btn-danger",
                    "subClassName":"fa fa-remove"
                },
            ]
        }
    ]
]

const controlTabContent = {
        "id":"controlDevices",
        "title":"Control Devices",
        "header": controlTabContentHeader,
        "inputRow": controlTabContentInputRow,
        "dataRows": controlTabContentDataRows
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
                "id":"controlDevice-device",
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Device",
            },
            {
                "id":"controlDevice-sn",
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"SN",
            },
            {
                "id":"controlDevice-port",
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Port",
            },
            {
                "id":"controlDevice-baud",
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Baud",
            },
            {
                "id":"controlDevice-format",
                "colSize":"1",
                "element":"span",
                "className":"controlLink",
                "textContent":"Format",
            },
            {
                "id":"controlDevice-delay",
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
        ],
        "dataRows": controlTabContentDataRows
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
    ],
    "dataRows": controlTabContentDataRows
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
    ],
    "dataRows": controlTabContentDataRows
}

// TODO: fix content of this configuration to match the existing page
const tabContent = [
    controlTabContent, 
    systemTabContent, 
    setPointTabContent, 
    referenceTabContent
];

