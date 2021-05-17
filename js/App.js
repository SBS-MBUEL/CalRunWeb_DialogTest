'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = App;











function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App(props) {
    return React.createElement(_ConfigContainer.ConfigContainer, {
        tabs: _databaseMockContent.databaseTabs,
        settings: _databaseMockContent.databaseContent,
        configurations: _configMocks.objectCollection
    });
}