'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabMenu = function (_React$Component) {
    _inherits(TabMenu, _React$Component);

    function TabMenu() {
        _classCallCheck(this, TabMenu);

        return _possibleConstructorReturn(this, (TabMenu.__proto__ || Object.getPrototypeOf(TabMenu)).apply(this, arguments));
    }

    _createClass(TabMenu, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                tab = _props.tab,
                index = _props.index;


            return React.createElement(
                'li',
                {
                    key: tab.ConfigurationArea,
                    className: index === 0 ? 'tab-select active' : 'tab-select',
                    role: 'presentation' },
                React.createElement(
                    'a',
                    { href: '#' + tab.ConfigurationArea, 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab', 'aria-expanded': 'true' },
                    React.createElement('i', { className: '' + tab.Icon }),
                    tab.ConfigurationArea
                )
            );
        }
    }]);

    return TabMenu;
}(React.Component);

var HeaderRow = function (_React$Component2) {
    _inherits(HeaderRow, _React$Component2);

    function HeaderRow() {
        _classCallCheck(this, HeaderRow);

        return _possibleConstructorReturn(this, (HeaderRow.__proto__ || Object.getPrototypeOf(HeaderRow)).apply(this, arguments));
    }

    _createClass(HeaderRow, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                content = _props2.content,
                index = _props2.index;


            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    'h1',
                    { key: index, className: 'pl-1 text-center' },
                    content.title
                ),
                React.createElement(
                    'div',
                    { className: 'header ' },
                    React.createElement(
                        'div',
                        { className: 'pl-1 row heading font-weight-bold' },
                        content.header.length > 0 ? content.header.map(function (header, index) {
                            return React.createElement(
                                'div',
                                { key: index, className: 'col-' + header.colSize },
                                header.textContent
                            );
                        }) : React.createElement(
                            'p',
                            null,
                            'no header cols'
                        )
                    )
                )
            );
        }
    }]);

    return HeaderRow;
}(React.Component);

var DropDownList = function (_React$Component3) {
    _inherits(DropDownList, _React$Component3);

    function DropDownList() {
        _classCallCheck(this, DropDownList);

        return _possibleConstructorReturn(this, (DropDownList.__proto__ || Object.getPrototypeOf(DropDownList)).apply(this, arguments));
    }

    _createClass(DropDownList, [{
        key: 'render',
        value: function render() {
            console.log('hello', this.props.ddContent);
            return React.createElement(React.Fragment, null);
        }
    }]);

    return DropDownList;
}(React.Component);

var ConfigRow = function (_React$Component4) {
    _inherits(ConfigRow, _React$Component4);

    function ConfigRow() {
        _classCallCheck(this, ConfigRow);

        return _possibleConstructorReturn(this, (ConfigRow.__proto__ || Object.getPrototypeOf(ConfigRow)).apply(this, arguments));
    }

    _createClass(ConfigRow, [{
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _props3 = this.props,
                content = _props3.content,
                index = _props3.index;

            console.warn(content);
            return React.createElement(
                'div',
                { key: index, className: 'pl-1 row mb-1 content ${content.id}' },
                content.length > 0 ? content.map(function (column, index) {
                    return React.createElement(
                        'div',
                        { key: index, className: 'col-' + column.colSize },
                        React.createElement(
                            'div',
                            { className: 'dropdown' },
                            React.createElement(
                                'span',
                                { className: column.className + ' dropdown-toggle', 'data-toggle': 'dropdown' },
                                'test'
                            ),
                            React.createElement(
                                'ul',
                                { className: 'miniPopUp dropdown-menu' },
                                React.createElement(
                                    'div',
                                    { className: 'drop-container' },
                                    ['test1', 'test2', 'test3', 'test4'].map(function (item, i) {
                                        return React.createElement(
                                            'li',
                                            { key: i * Math.random(), onClick: _this5.props.handler, className: 'btn btn-outline-primary controlLink text-center' },
                                            item
                                        );
                                    })
                                )
                            )
                        )
                    );
                }) : React.createElement(
                    'p',
                    null,
                    'no header rows'
                )
            );
        }
    }]);

    return ConfigRow;
}(React.Component);

/**
 * ConfigContainer is the main launching point to construct the tabbed configuration screen
 */


var ConfigContainer = function (_React$Component5) {
    _inherits(ConfigContainer, _React$Component5);

    function ConfigContainer(props) {
        _classCallCheck(this, ConfigContainer);

        // TODO: state variable needs to contain settings object to be manipulated when an option is changed.
        var _this6 = _possibleConstructorReturn(this, (ConfigContainer.__proto__ || Object.getPrototypeOf(ConfigContainer)).call(this, props));

        _this6.state = {
            tabs: props.tabs,
            tabContent: props.settings.map(function (cur) {
                if (props.tabs.reduce(function (acc, tab) {
                    return tab.ConfigurationArea.toLowerCase() === cur.ConfigurationArea.toLowerCase() ? acc + 1 : acc;
                }, 0) > 0) {
                    return cur;
                }
            }).filter(function (el) {
                return el != undefined;
            }),
            settings: props.settings
        };
        console.log(_this6.state);
        _this6.changeHandler = _this6.changeHandler.bind(_this6);
        _this6.insertRow = _this6.insertRow.bind(_this6);
        _this6.copyRow = _this6.copyRow.bind(_this6);
        _this6.updateRow = _this6.updateRow.bind(_this6);
        _this6.removeRow = _this6.removeRow.bind(_this6);
        _this6.clickRouter = _this6.clickRouter.bind(_this6);
        return _this6;
    }

    /**
     * renders mini pop up option list - on change change calling div
     * @param {DOM} domElement Where the pop up dialog will appear
     * @param {string} id the DOM element to manipulate after selection is made
     * @returns 
     */


    _createClass(ConfigContainer, [{
        key: 'popUpSelection',
        value: function popUpSelection(domElement, id) {
            console.log($(domElement).parent());
            // TODO: Implement listener
            // TODO: Propagate selection back to state of React object 
            // TODO: Make inserted pop up customizable
            // return $(domElement).parent().append('<div className="miniPopUp">test</div>').on('click', function(e) {
            //     console.log(e);
            // });
            // renderPopUp(this.changeHandler, 'test', id)
        }

        /**
         * deals with changes to UI to make sure they are saved to the state
         * //TODO: need to implement code here to deal with changes to selected item
         * @param {Event} e 
         */

    }, {
        key: 'changeHandler',
        value: function changeHandler(e) {
            console.log('changeHandler');
            console.log(e.currentTarget.textContent);
        }

        /**
        * copy current config row to a new row
        * //TODO: code needs implemented
        * @param {Event} e 
        */

    }, {
        key: 'copyRow',
        value: function copyRow(e) {
            console.log('copy Row');
            console.log(e.currentTarget);
        }

        /**
        * update row of current config row to database and local configs
        * //TODO: code needs implemented
        * @param {Event} e 
        */

    }, {
        key: 'updateRow',
        value: function updateRow(e) {
            console.log('update Row');
            console.log(e.currentTarget);
        }

        /**
         * insert new config row to table
         * //TODO: code needs implemented
         * @param {Event} e 
         */

    }, {
        key: 'removeRow',
        value: function removeRow(e) {
            console.log('remove row');
            console.log(e.currentTarget);
        }

        /**
         * insert new config row to table
         * //TODO: code needs implemented
         * @param {Event} e 
         */

    }, {
        key: 'insertRow',
        value: function insertRow(e) {
            console.log('insert Row');
            console.log(e.currentTarget);
        }
    }, {
        key: 'clickRouter',
        value: function clickRouter(e) {
            console.log('modify row - add / remove / update / copy');
            console.log($(e.currentTarget)[0]);

            if ($(e.currentTarget)[0].className.includes('controlLink')) {
                this.changeHandler(e);
            } else if ($(e.currentTarget)[0].className.includes('success')) {
                this.insertRow(e);
            } else if ($(e.currentTarget)[0].className.includes('danger')) {
                this.removeRow(e);
            } else if ($(e.currentTarget)[0].className.includes('info')) {
                this.updateRow(e);
            } else if ($(e.currentTarget)[0].className.includes('warning')) {
                this.copyRow(e);
            } else if ($(e.currentTarget)[0].className.includes('primary')) {
                this.changeHandler(e);
            }
        }
    }, {
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
                                    return React.createElement(TabMenu, { index: i, tab: tab });
                                }) : React.createElement(
                                    'p',
                                    null,
                                    'no tabs to select'
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

/**
 * Renders configuration from React classes declared above.
 * tabNames is a global located in tabConfig.js (edit ./dev version)
 * tabContent is a global located in tabContent.js (edit in ./dev version)
 * 
 * //TODO: load settings from LocalStorage (after they are saved) and then run background task to retrieve from database.
 * after creating tab config, it creates an event listener (used Jquery for speed of deploy) to listen to appropriate tab click and active/deactivate tabs.
 * 
 * //TODO: listen to config page closure to save settings to local storage and when avaialable the database.
 * @param {DOM} root element to render content to
 */


function renderConfig(root, tabNames, configuration) {

    ReactDOM.render(React.createElement(ConfigContainer, {
        tabs: tabNames,
        settings: configuration }), document.getElementById(root));

    $('.tab-select').on('click', function (e) {
        var _this7 = this;

        $('.tab-select').map(function (i, el) {
            if (el === _this7) {
                el.classList && el.classList.add('active');
                el.classList && el.classList.remove('inactive');
            } else {
                el.classList && el.classList.remove('active');
                el.classList && el.classList.add('inactive');
            }
        });
    });
}