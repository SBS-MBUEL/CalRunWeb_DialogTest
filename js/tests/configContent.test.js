'use strict';

var _react = require('@testing-library/react');







function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Basic render test, renders the whole configuration stack
test('renders config', function () {

    (0, _react.render)(React.createElement(_App2.default, null));
    var linkElement = _react.screen.getByText(/SYSTEM/);

    expect(linkElement).toBeDefined();
});

// verifies from the stack that we can click a tab and the class appropriately changes
//TODO: move import to this file
test('switch tabs', function () {
    (0, _react.render)(React.createElement(_App2.default, null));

    var linkElement = _react.screen.getAllByText('reference')[0];

    var currentClassName = linkElement.parentElement.className;

    expect(currentClassName).not.toContain('is-active');

    _react.fireEvent.click(linkElement);

    currentClassName = linkElement.parentElement.className;

    expect(currentClassName).toContain('is-active');
});