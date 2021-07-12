import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { TabPanels } from '../components/TabPanels';
import { objectCollection } from '../mocks/configMocks'

function getTabs() {
    return [
        {
            "ConfigurationArea": "system",
            "VisibleToUser": "1",
            "Icon": "fa fa-wrench"
        },
        {
            "ConfigurationArea": "device",
            "VisibleToUser": "1",
            "Icon": "fa fa-gamepad"
        },
        {
            "ConfigurationArea": "reference",
            "VisibleToUser": "1",
            "Icon": "fa fa-thermometer-half"
        },
        {
            "ConfigurationArea": "datapoint",
            "VisibleToUser": "1",
            "Icon": "fa fa-map-marker"
        }
    ];
}

test('renders TabPanels with functional data', () => {
    let result = '';
    render(<TabPanels tabs={getTabs()} content={objectCollection} activeTab={0} clickRouter={(e) => result = e.target.classList}  /> );

    const tabPanel = screen.getAllByRole(/Landmark/i)[0];

    expect(tabPanel.className).toMatch(/is-active/);
    
});

test('renders ErrorPage with tabs null', () => {
    let result = '';
    render(<TabPanels tabs={undefined} content={objectCollection} activeTab={0} clickRouter={(e) => result = e.target.classList}  /> );

    const tabPanel = screen.getAllByText(/CalRun Configuration Page/i)[1];
    console.log(tabPanel);
    expect(tabPanel.textContent).toMatch(/CalRun Configuration Page/);
    
});