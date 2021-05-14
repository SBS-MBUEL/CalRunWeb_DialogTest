'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = App;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ConfigContainer = require('./ConfigContainer');

var _ConfigContainer2 = _interopRequireDefault(_ConfigContainer);

var _databaseMockContent = require('./mocks/databaseMockContent');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App(props) {
    return _react2.default.createElement(ConfigContainer, {
        tabs: _databaseMockContent.databaseTabs,
        settings: _databaseMockContent.databaseContent });
}