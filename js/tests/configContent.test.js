'use strict';

var _react = require('@testing-library/react');





function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO: move import to this file
test('renders config', function () {
    var application = 'TEST';

    (0, _react.render)(React.createElement(_App2.default, null));
    var linkElement = _react.screen.findByText(/SYSTEM/);
    expect(linkElement).toBeDefined();
});