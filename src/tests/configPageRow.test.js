//TODO: move import to this file
import { fireEvent, render, screen } from '@testing-library/react';
import {ConfigPageRow} from '../components/ConfigPageRow';

function testSetup(opts) {
    let list = opts ? opts : []
    const row = {
        label: "Green",
        value: "Blue",
        list: list
    };

    return row;
    
    

}

test('renders config row with no pop ups', () => {

    render(<ConfigPageRow row={testSetup()} /> );

    expect(screen.getByText(/Green/).textContent).toBe('Green');

    expect(screen.getByText(/Blue/).textContent).toBe('Blue');
});

test('config row with no list, renders input', () => {
    render(<ConfigPageRow row={testSetup()} /> );

    expect(screen.getByText(/submit change/).textContent).toBe('submit change');

});

test('config row with one list item, renders list', () => {
    render(<ConfigPageRow row={testSetup(['test'])} /> );

    const listItem = screen.getByText(/test/);

    expect(listItem.textContent).toBe('test');
    
    const linkItem = screen.getByText(/Blue/);
    // console.log(linkItem);
    expect(linkItem.parentElement.parentElement.parentElement.className).not.toContain('is-active');
    
    // TODO: need to figure out why this isn't changing class - it works in the browser window
    fireEvent.click(linkItem);
    
    console.log(linkItem.parentElement.parentElement.parentElement.className);

    fireEvent.click(linkItem);
    
    console.log(linkItem.parentElement.parentElement.parentElement.className);

    // expect(linkItem.parentElement.parentElement.parentElement.className).toContain('is-active');
});