import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { DropDownItem } from '../components/DropDownItem';

function testSetup(opts) {
    let list = opts ? opts : []
    const row = {
        label: "Green",
        value: "Blue",
        list: list
    };

    return row;

}

function processClick(key, val) {
    return val;
}

test('renders drop item with passed in value', () => {
    let localValue = '';
    render(<DropDownItem row={testSetup(['test'])} userValue={testSetup().value} trackChanges={(k, v) => {
        localValue = processClick(k, v);
    }}/> );

    // Grab the item
    const rowItem = screen.getByText('test');
    expect(rowItem.textContent).toBe('test');
});

test('renders drop item with passed in value, can be changed', () => {
    let localValue = '';
    render(<DropDownItem row={testSetup(['test'])} userValue={testSetup().value} trackChanges={(k, v) => {
        localValue = processClick(k, v);
    }}/> );

    // Grab the item
    const rowItem = screen.getByText('test');
    fireEvent.click(rowItem);

    expect(localValue).toBe('test');
});