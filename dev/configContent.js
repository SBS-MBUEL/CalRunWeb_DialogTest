class ListMenu extends React.Component {
    render() {
        const {tab, index} = this.props;

        return (<li key={index} className={(index === 0 ? 'tab-select active' : 'tab-select')} role="presentation"><a href={`#${tab.id}`} aria-controls="home" role="tab" data-toggle="tab" aria-expanded="true"><i className={`${tab.classIcon}`}></i> {tab.name}</a></li>);
    }
}
class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs : props.tabs,
            tabContent : props.tabContent
        }
    }

    render() {
        const { tabs, tabContent } = this.state;
        console.log(tabContent);
        return (
            <div className="container-fluid text-center">
                <div className="row">
                    <div className="pt-4 col-12">
                        <div className="tab" role="tabpanel">
                            <ul className="nav nav-tabs" role="tablist">
                                {tabs.length > 0 ? tabs.map((tab, i) => {
                                    return <ListMenu index={i} tab={tab} />
                                }) : <p>no tabs to select</p>}
                            </ul>
                            <div className="tab-content tabs">
                                {/* this is where we wiil map the data */}
                                {tabContent.length > 0 ? tabContent.map((content, i) => {
                                    return (
                                        <div key={i} role="tabpanel" className={`tab-pane active fade in ${i === 0 ? 'show' : ''}`}  id={`${content.id}`}>
                                            <h1 className="pl-1 text-center">{content.title}</h1>
                                            <div className="header ">
                                                {/* {content.header.length} */}
                                                <div className="pl-1 row font-weight-bold">
                                                    {content.header.length > 0 ? content.header.map((header, i) => {
                                                        return (<div key={i} className={`col-${header.colSize}`}>
                                                            {header.textContent}
                                                        </div>);
                                                    }) : <p>no header rows</p>}
                                                </div>
                                            </div>
                                            <div className={`input ${content.id}`}>
                                                <div className="pl-1 row mb-1">
                                                    {content.inputRow.length > 0 ? content.inputRow.map((input, i) => {
                                                        return (<div key={i} className={`col-${input.colSize}`}>
                                                            <span class="controlLink">{input.textContent}</span>
                                                        </div>);
                                                    }) : <p>no header rows</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : <p>no content to display</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
const tabContent = [
    {
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
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn success",
                        "textContent":"<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
                    },
                ]
            },
        ]
    
    },
    {
        "id":"instrumentConfiguration",
        "title":"Instrument Config",
        "header": [
            {
                "colSize":"1",
                "textContent":"Device Type",
            },
            {
                "colSize":"1",
                "textContent":"Model",
            },
            {
                "colSize":"1",
                "textContent":"SN",
            },
            {
                "colSize":"1",
                "textContent":"Measurand",
            },
            {
                "colSize":"1",
                "textContent":"Measurand Sub-Type",
            },
            {
                "colSize":"1",
                "textContent":"Peristaltic Pump Delay",
            },
            {
                "colSize":"1",
                "textContent":"Injection Volume",
            },
            {
                "colSize":"1",
                "textContent":"Pump Rate",
            },
            {
                "colSize":"1",
                "textContent":"Drain",
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
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn success",
                        "textContent":"<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
                    },
                ]
            },
        ]
    
    },
    {
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
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn success",
                        "textContent":"<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
                    },
                ]
            },
        ]
    
    },
    {
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
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "textContent":"&npsb;"
                    },
                    {
                        "colSize":"4",
                        "element":"div",
                        "className":"btn btn success",
                        "textContent":"<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
                    },
                ]
            },
        ]
    
    },
]

    function renderConfig(root) {
        ReactDOM.render(
        <ConfigContainer tabs={[
            {
                'id': 'controlDevices',
                'name': 'Control Devices',
                'classIcon':'fa fa-desktop'
            },
            {
                'id': 'instrumentConfiguration',
                'name': 'Instrument Configs',
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
        ]} tabContent={tabContent}/>,
        document.getElementById(root)
        );
      
        $('.tab-select').on('click', function(e) {
            $('.tab-select').map((i, el) => {
                if (el === this) {
                    el.classList && el.classList.add('active');
                } else {
                    el.classList && el.classList.remove('active');
                }
            });
        });
    }
  