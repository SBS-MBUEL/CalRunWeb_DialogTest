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

var popUpSelection = function popUpSelection(domElement) {
    console.log($(domElement).parent());
    // TODO: Implement listener
    // TODO: Propagate selection back to state of React object 
    // TODO: Make inserted pop up customizable
    return $(domElement).parent().append('<div class="miniPopUp">test</div>');
};

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

var InputRow = function (_React$Component3) {
    _inherits(InputRow, _React$Component3);

    function InputRow() {
        _classCallCheck(this, InputRow);

        return _possibleConstructorReturn(this, (InputRow.__proto__ || Object.getPrototypeOf(InputRow)).apply(this, arguments));
    }

    _createClass(InputRow, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props3 = this.props,
                content = _props3.content,
                index = _props3.index;


            return React.createElement(
                'div',
                { key: index, className: 'input ' + content.id },
                React.createElement(
                    'div',
                    { className: 'pl-1 row mb-1 content' },
                    content.inputRow.length > 0 ? content.inputRow.map(function (input, index) {
                        return React.createElement(
                            'div',
                            { key: index, className: 'col-' + input.colSize },
                            !input.subContent ? React.createElement(input.element, {
                                onClick: _this4.props.handler,
                                key: index + 10,
                                className: input.className
                            }, input.textContent) : input.subContent.length > 0 ? React.createElement(
                                'div',
                                {
                                    className: input.className },
                                input.subContent.map(function (sub, index) {
                                    return React.createElement(
                                        'div',
                                        {
                                            key: index,
                                            className: 'col-' + input.colSize },
                                        React.createElement(
                                            'div',
                                            {
                                                onClick: _this4.props.addRow,
                                                className: sub.className },
                                            React.createElement(
                                                'i',
                                                {
                                                    className: sub.subClassName,
                                                    'aria-hidden': 'true' },
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

    return InputRow;
}(React.Component);

var ConfigContainer = function (_React$Component4) {
    _inherits(ConfigContainer, _React$Component4);

    function ConfigContainer(props) {
        _classCallCheck(this, ConfigContainer);

        var _this5 = _possibleConstructorReturn(this, (ConfigContainer.__proto__ || Object.getPrototypeOf(ConfigContainer)).call(this, props));

        _this5.state = {
            tabs: props.tabs,
            tabContent: props.tabContent
        };

        _this5.changeHandler = _this5.changeHandler.bind(_this5);
        _this5.insertRow = _this5.insertRow.bind(_this5);
        return _this5;
    }

    /**
     * deals with changes to UI to make sure they are saved to the state
     * @param {Event} e 
     */


    _createClass(ConfigContainer, [{
        key: 'changeHandler',
        value: function changeHandler(e) {
            console.log('changeHandler');
            console.log(e);
            popUpSelection(e.currentTarget);
        }
    }, {
        key: 'insertRow',
        value: function insertRow(e) {
            console.log('insertRow');
            console.log(e.currentTarget);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

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
                                            className: 'tab-pane active fade in ' + (i === 0 ? 'show' : ''),
                                            id: '' + content.id
                                        },
                                        React.createElement(HeaderRow, { index: i, content: content }),
                                        React.createElement(InputRow, { handler: _this6.changeHandler, addRow: _this6.insertRow, index: i, content: content })
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
        var _this7 = this;

        $('.tab-select').map(function (i, el) {
            if (el === _this7) {
                el.classList && el.classList.add('active');
            } else {
                el.classList && el.classList.remove('active');
            }
        });
    });
}
