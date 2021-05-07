//TODO: move import to this file
import { render, screen } from '@testing-library/react';

import { ConfigContainer } from '../configContent';

test('renders config', () => {
    const application = 'TEST';
    const tabNames = [
        {
            "ConfigurationArea": "TEST",
            "VisibleToUser": "1",
            "Icon": "fa fa-wrench"
        }
    ];
    const settings = [
        {
            "ConfigurationID": "882",
            "ConfigurationName": "DryChloro",
            "ConfigurationArea": "TEST",
            "OptionIndex": "0",
            "ParameterIndex": "-1",
            "ItemName": "Initial Entry",
            "ItemValue": "2021-04-13"
        },
        {
            "ConfigurationID": "882",
            "ConfigurationName": "DryChloro",
            "ConfigurationArea": "TEST",
            "OptionIndex": "0",
            "ParameterIndex": "-1",
            "ItemName": "Port",
            "ItemValue": "COM5"
        },
        {
            "ConfigurationID": "882",
            "ConfigurationName": "DryChloro",
            "ConfigurationArea": "TEST",
            "OptionIndex": "0",
            "ParameterIndex": "-1",
            "ItemName": "Baud",
            "ItemValue": "19200"
        },
        {
            "ConfigurationID": "882",
            "ConfigurationName": "DryChloro",
            "ConfigurationArea": "TEST",
            "OptionIndex": "0",
            "ParameterIndex": "-1",
            "ItemName": "Device",
            "ItemValue": "ECOV2"
        },
        {
            "ConfigurationID": "882",
            "ConfigurationName": "DryChloro",
            "ConfigurationArea": "TEST",
            "OptionIndex": "0",
            "ParameterIndex": "-1",
            "ItemName": "Settings",
            "ItemValue": "N,8"
        }
    ];
    render(<ConfigContainer tabs={tabNames} settings={settings} /> );
    const linkElement = screen.findByText(/TEST/);
    // const linkElement = screen.getByText(/TEST/i);
    expect(linkElement).toBeDefined();
});