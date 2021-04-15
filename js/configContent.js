'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListMenu = function (_React$Component) {
    _inherits(ListMenu, _React$Component);

    function ListMenu() {
        _classCallCheck(this, ListMenu);

        return _possibleConstructorReturn(this, (ListMenu.__proto__ || Object.getPrototypeOf(ListMenu)).apply(this, arguments));
    }

    _createClass(ListMenu, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                tab = _props.tab,
                index = _props.index;


            return React.createElement(
                'li',
                { key: index, className: index === 0 ? 'tab-select active' : 'tab-select', role: 'presentation' },
                React.createElement(
                    'a',
                    { href: '#' + tab.id, 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab', 'aria-expanded': 'true' },
                    React.createElement('i', { className: '' + tab.classIcon }),
                    ' ',
                    tab.name
                )
            );
        }
    }]);

    return ListMenu;
}(React.Component);

var ConfigContainer = function (_React$Component2) {
    _inherits(ConfigContainer, _React$Component2);

    function ConfigContainer(props) {
        _classCallCheck(this, ConfigContainer);

        var _this2 = _possibleConstructorReturn(this, (ConfigContainer.__proto__ || Object.getPrototypeOf(ConfigContainer)).call(this, props));

        _this2.state = {
            tabs: props.tabs,
            tabContent: props.tabContent
        };
        return _this2;
    }

    _createClass(ConfigContainer, [{
        key: 'render',
        value: function render() {
            var _state = this.state,
                tabs = _state.tabs,
                tabContent = _state.tabContent;

            console.log(tabContent);
            return React.createElement(
                'div',
                { className: 'container-fluid text-center' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'pt-4 col-12' },
                        React.createElement(
                            'div',
                            { className: 'tab', role: 'tabpanel' },
                            React.createElement(
                                'ul',
                                { className: 'nav nav-tabs', role: 'tablist' },
                                tabs.length > 0 ? tabs.map(function (tab, i) {
                                    return React.createElement(ListMenu, { index: i, tab: tab });
                                }) : React.createElement(
                                    'p',
                                    null,
                                    'no tabs to select'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'tab-content tabs' },
                                tabContent.length > 0 ? tabContent.map(function (content, i) {
                                    return React.createElement(
                                        'div',
                                        { key: i, role: 'tabpanel', className: 'tab-pane active fade in ' + (i === 0 ? 'show' : ''), id: '' + content.id },
                                        React.createElement(
                                            'h1',
                                            { className: 'pl-1 text-center' },
                                            content.title
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'header ' },
                                            React.createElement(
                                                'div',
                                                { className: 'pl-1 row font-weight-bold' },
                                                content.header.length > 0 ? content.header.map(function (header, i) {
                                                    return React.createElement(
                                                        'div',
                                                        { key: i, className: 'col-' + header.colSize },
                                                        header.textContent
                                                    );
                                                }) : React.createElement(
                                                    'p',
                                                    null,
                                                    'no header rows'
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'input ' + content.id },
                                            React.createElement(
                                                'div',
                                                { className: 'pl-1 row mb-1' },
                                                content.inputRow.length > 0 ? content.inputRow.map(function (input, i) {
                                                    return React.createElement(
                                                        'div',
                                                        { key: i, className: 'col-' + input.colSize },
                                                        React.createElement(
                                                            'span',
                                                            { 'class': 'controlLink' },
                                                            input.textContent
                                                        )
                                                    );
                                                }) : React.createElement(
                                                    'p',
                                                    null,
                                                    'no header rows'
                                                )
                                            )
                                        )
                                    );
                                }) : React.createElement(
                                    'p',
                                    null,
                                    'no content to display'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ConfigContainer;
}(React.Component);

var tabContent = [{
    "id": "controlDevices",
    "title": "Control Devices",
    "header": [{
        "colSize": "1",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "textContent": "Commands to Configure"
    }, {
        "colSize": "1",
        "textContent": "Sample Commands"
    }, {
        "colSize": "1",
        "textContent": "Measurands"
    }, {
        "colSize": "1",
        "textContent": "Update"
    }],
    "inputRow": [{
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Port"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "3",
        "element": "div",
        "className": "btn btn-primary",
        "textContent": "Add Measurand"
    }, {
        "colSize": "1",
        "element": "div",
        "className": "row",
        "textContent": "",
        "subContent": [{
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "className": "btn btn success",
            "textContent": "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
        }]
    }]

}, {
    "id": "instrumentConfiguration",
    "title": "Instrument Config",
    "header": [{
        "colSize": "1",
        "textContent": "Device Type"
    }, {
        "colSize": "1",
        "textContent": "Model"
    }, {
        "colSize": "1",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "textContent": "Measurand"
    }, {
        "colSize": "1",
        "textContent": "Measurand Sub-Type"
    }, {
        "colSize": "1",
        "textContent": "Peristaltic Pump Delay"
    }, {
        "colSize": "1",
        "textContent": "Injection Volume"
    }, {
        "colSize": "1",
        "textContent": "Pump Rate"
    }, {
        "colSize": "1",
        "textContent": "Drain"
    }, {
        "colSize": "1",
        "textContent": "Fill"
    }, {
        "colSize": "1",
        "textContent": "Calulate After"
    }, {
        "colSize": "1",
        "textContent": "Update"
    }],
    "inputRow": [{
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Port"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "3",
        "element": "div",
        "className": "btn btn-primary",
        "textContent": "Add Measurand"
    }, {
        "colSize": "1",
        "element": "div",
        "className": "row",
        "textContent": "",
        "subContent": [{
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "className": "btn btn success",
            "textContent": "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
        }]
    }]

}, {
    "id": "setPoints",
    "title": "Set Points",
    "header": [{
        "colSize": "1",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "textContent": "Commands to Configure"
    }, {
        "colSize": "1",
        "textContent": "Sample Commands"
    }, {
        "colSize": "1",
        "textContent": "Measurands"
    }, {
        "colSize": "1",
        "textContent": "Update"
    }],
    "inputRow": [{
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Port"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "3",
        "element": "div",
        "className": "btn btn-primary",
        "textContent": "Add Measurand"
    }, {
        "colSize": "1",
        "element": "div",
        "className": "row",
        "textContent": "",
        "subContent": [{
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "className": "btn btn success",
            "textContent": "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
        }]
    }]

}, {
    "id": "references",
    "title": "References",
    "header": [{
        "colSize": "1",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "textContent": "Commands to Configure"
    }, {
        "colSize": "1",
        "textContent": "Sample Commands"
    }, {
        "colSize": "1",
        "textContent": "Measurands"
    }, {
        "colSize": "1",
        "textContent": "Update"
    }],
    "inputRow": [{
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Device"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "SN"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Port"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Baud"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Format"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Delay"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "1",
        "element": "span",
        "className": "controlLink",
        "textContent": "Set"
    }, {
        "colSize": "3",
        "element": "div",
        "className": "btn btn-primary",
        "textContent": "Add Measurand"
    }, {
        "colSize": "1",
        "element": "div",
        "className": "row",
        "textContent": "",
        "subContent": [{
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "textContent": "&npsb;"
        }, {
            "colSize": "4",
            "element": "div",
            "className": "btn btn success",
            "textContent": "<i class=\"fa fa-plus\" aria-hidden=\"true\"></i>"
        }]
    }]

}];

function renderConfig(root) {
    ReactDOM.render(React.createElement(ConfigContainer, { tabs: [{
            'id': 'controlDevices',
            'name': 'Control Devices',
            'classIcon': 'fa fa-desktop'
        }, {
            'id': 'instrumentConfiguration',
            'name': 'Instrument Configs',
            'classIcon': 'fa fa-cube'
        }, {
            'id': 'setPoints',
            'name': 'Set Points',
            'classIcon': 'fa fa-circle-o'
        }, {
            'id': 'references',
            'name': 'References',
            'classIcon': 'fa fa-thermometer-half'
        }], tabContent: tabContent }), document.getElementById(root));

    $('.tab-select').on('click', function (e) {
        var _this3 = this;

        $('.tab-select').map(function (i, el) {
            if (el === _this3) {
                el.classList && el.classList.add('active');
            } else {
                el.classList && el.classList.remove('active');
            }
        });
    });
}
