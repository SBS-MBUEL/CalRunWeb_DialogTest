'use strict';

var _react = require('@testing-library/react');

var _configContent = require('../configContent');

test('renders config', function () {
    var application = 'TEST';
    var tabNames = [{
        "ConfigurationArea": "TEST",
        "VisibleToUser": "1",
        "Icon": "fa fa-wrench"
    }];
    var settings = [{
        "ConfigurationID": "882",
        "ConfigurationName": "DryChloro",
        "ConfigurationArea": "TEST",
        "OptionIndex": "0",
        "ParameterIndex": "-1",
        "ItemName": "Initial Entry",
        "ItemValue": "2021-04-13"
    }, {
        "ConfigurationID": "882",
        "ConfigurationName": "DryChloro",
        "ConfigurationArea": "TEST",
        "OptionIndex": "0",
        "ParameterIndex": "-1",
        "ItemName": "Port",
        "ItemValue": "COM5"
    }, {
        "ConfigurationID": "882",
        "ConfigurationName": "DryChloro",
        "ConfigurationArea": "TEST",
        "OptionIndex": "0",
        "ParameterIndex": "-1",
        "ItemName": "Baud",
        "ItemValue": "19200"
    }, {
        "ConfigurationID": "882",
        "ConfigurationName": "DryChloro",
        "ConfigurationArea": "TEST",
        "OptionIndex": "0",
        "ParameterIndex": "-1",
        "ItemName": "Device",
        "ItemValue": "ECOV2"
    }, {
        "ConfigurationID": "882",
        "ConfigurationName": "DryChloro",
        "ConfigurationArea": "TEST",
        "OptionIndex": "0",
        "ParameterIndex": "-1",
        "ItemName": "Settings",
        "ItemValue": "N,8"
    }];
    (0, _react.render)(React.createElement(_configContent.ConfigContainer, { tabs: tabNames, settings: settings }));
    var linkElement = _react.screen.findByText(/TEST/);
    // const linkElement = screen.getByText(/TEST/i);
    expect(linkElement).toBeDefined();
});