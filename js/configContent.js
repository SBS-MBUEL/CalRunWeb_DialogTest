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
                {
                    key: index,
                    className: index === 0 ? 'tab-select active' : 'tab-select',
                    role: 'presentation' },
                React.createElement(
                    'a',
                    { href: '#' + tab.id, 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab', 'aria-expanded': 'true' },
                    React.createElement('i', { className: '' + tab.classIcon }),
                    tab.name
                )
            );
        }
    }]);

    return ListMenu;
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

/**
 * OptionRow restores the previously saved options per tab
 */


var OptionRow = function (_React$Component3) {
    _inherits(OptionRow, _React$Component3);

    function OptionRow() {
        _classCallCheck(this, OptionRow);

        return _possibleConstructorReturn(this, (OptionRow.__proto__ || Object.getPrototypeOf(OptionRow)).apply(this, arguments));
    }

    _createClass(OptionRow, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props3 = this.props,
                row = _props3.row,
                index = _props3.index,
                id = _props3.id;

            console.log(row, index, id);
            return React.createElement(
                'div',
                { key: index, className: 'input ' + id },
                React.createElement(
                    'div',
                    { className: 'pl-1 row mb-1 content' },
                    row.length > 0 ? row.map(function (col, index) {
                        return React.createElement(
                            'div',
                            { key: index, className: 'col-' + col.colSize },
                            !col.subContent ? React.createElement(col.element, {
                                onClick: _this4.props.handler,
                                key: index + 10,
                                className: col.className
                            }, col.textContent) : col.subContent.length > 0 ? React.createElement(
                                'div',
                                {
                                    className: col.className
                                },
                                col.subContent.map(function (sub, index) {
                                    return React.createElement(
                                        'div',
                                        {
                                            key: index,
                                            className: 'col-' + sub.colSize + '  pr-1'
                                        },
                                        React.createElement(
                                            'div',
                                            {
                                                onClick: _this4.props.handler,
                                                className: '' + sub.className
                                            },
                                            React.createElement(
                                                'i',
                                                {
                                                    className: sub.subClassName,
                                                    'aria-hidden': 'true'
                                                },
                                                sub.textContent
                                            )
                                        )
                                    );
                                })
                            ) : React.createElement(
                                'p',
                                null,
                                'no sub cols'
                            )
                        );
                    }) : React.createElement(
                        'p',
                        null,
                        'no header rows'
                    )
                )
            );
        }
    }]);

    return OptionRow;
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
            var _this6 = this;

            var _props4 = this.props,
                content = _props4.content,
                index = _props4.index;

            console.warn(content);
            return React.createElement(
                'div',
                { key: index, className: 'input ' + content.id },
                React.createElement(
                    'div',
                    { className: 'pl-1 row mb-1 content' },
                    content.length > 0 ? content.map(function (input, index) {
                        return React.createElement(
                            'div',
                            { key: index, className: 'col-' + input.colSize },
                            !input.subContent ? React.createElement(input.element, {
                                onClick: _this6.props.handler,
                                key: index + 10,
                                className: input.className
                            }, input.textContent) : input.subContent.length > 0 ? React.createElement(
                                'div',
                                { className: input.className },
                                input.subContent.map(function (col, index) {
                                    return React.createElement(
                                        'div',
                                        {
                                            key: index,
                                            className: 'col-' + col.colSize
                                        },
                                        React.createElement(
                                            'div',
                                            {
                                                onClick: _this6.props.handler,
                                                className: col.className
                                            },
                                            React.createElement(
                                                'i',
                                                {
                                                    className: col.subClassName,
                                                    'aria-hidden': 'true'
                                                },
                                                col.textContent
                                            )
                                        )
                                    );
                                })
                            ) : React.createElement(
                                'p',
                                null,
                                'no sub cols'
                            )
                        );
                    }) : React.createElement(
                        'p',
                        null,
                        'no header rows'
                    )
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

        var _this7 = _possibleConstructorReturn(this, (ConfigContainer.__proto__ || Object.getPrototypeOf(ConfigContainer)).call(this, props));

        _this7.state = {
            tabs: props.tabs,
            tabContent: props.tabContent,
            dataRows: props.tabContent,
            newRowContent: []
        };

        _this7.changeHandler = _this7.changeHandler.bind(_this7);
        _this7.insertRow = _this7.insertRow.bind(_this7);
        _this7.copyRow = _this7.copyRow.bind(_this7);
        _this7.updateRow = _this7.updateRow.bind(_this7);
        _this7.removeRow = _this7.removeRow.bind(_this7);
        _this7.clickRouter = _this7.clickRouter.bind(_this7);
        return _this7;
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
            // return $(domElement).parent().append('<div class="miniPopUp">test</div>').on('click', function(e) {
            //     console.log(e);
            // });
            renderPopUp(this.changeHandler, 'test', id);
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
            console.log(e);
            this.popUpSelection(e.currentTarget, e.currentTarget.id);
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
            }
            if ($(e.currentTarget)[0].className.includes('success')) {
                this.insertRow(e);
            }
            if ($(e.currentTarget)[0].className.includes('danger')) {
                this.removeRow(e);
            }
            if ($(e.currentTarget)[0].className.includes('info')) {
                this.updateRow(e);
            }
            if ($(e.currentTarget)[0].className.includes('warning')) {
                this.copyRow(e);
            }
            if ($(e.currentTarget)[0].className.includes('primary')) {
                this.changeHandler(e);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this8 = this;

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
                                        {
                                            key: i,
                                            role: 'tabpanel',
                                            className: 'tab-pane ' + (i === 0 ? 'fade in active show' : 'fade out inactive'),
                                            id: '' + content.id
                                        },
                                        React.createElement(HeaderRow, { index: i, content: content }),
                                        React.createElement(ConfigRow, { handler: _this8.clickRouter, index: i, content: content.inputRow }),
                                        content && content.dataRows.length > 0 && content.dataRows.map(function (row, i) {
                                            return React.createElement(ConfigRow, { handler: _this8.clickRouter, index: i, id: content.id, content: row });
                                        })
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


function renderConfig(root) {

    ReactDOM.render(React.createElement(ConfigContainer, {
        tabs: tabNames,
        tabContent: tabContent }), document.getElementById(root));

    $('.tab-select').on('click', function (e) {
        var _this9 = this;

        $('.tab-select').map(function (i, el) {
            if (el === _this9) {
                el.classList && el.classList.add('active');
                el.classList && el.classList.remove('inactive');
            } else {
                el.classList && el.classList.remove('active');
                el.classList && el.classList.add('inactive');
            }
        });
    });
}