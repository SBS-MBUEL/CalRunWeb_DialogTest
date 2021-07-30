//TODO: move import to this file
import { fireEvent, getByDisplayValue, render, screen } from '@testing-library/react';
import { ConfigPageRow } from '../components/ConfigPageRow';

function testSetup(opts, type="dropdown") {
    let list = opts ? opts : []
    const row = {
        label: "Green",
        value: "Blue",
        type: type,
        list: list
    };

    return row;
}

window.HTMLElement.prototype.scrollIntoView = function() {};

function processChange(key, val, idx, loc) {

}

describe('Normal config renders', () => {
    test('renders config row with no pop ups', () => {
    
        render(<ConfigPageRow row={testSetup()}  onChange={processChange} />);
    
        expect(screen.getByText(/Green/).textContent).toBe('Green');
    
        expect(screen.getByText(/Blue/).textContent).toBe('Blue');
    
        expect(screen.getByRole('dropdownlist-content').children.length).toBe(0);
    });

    test('config row type of text, renders textarea', () => {
        render(<ConfigPageRow row={testSetup([], 'textarea')} onChange={processChange} /> );
    
        expect(screen.getByDisplayValue(/Blue/).value).toBe('Blue');
    
    });

    test('config row type of text, renders button', () => {
        render(<ConfigPageRow row={testSetup([], 'button')} onChange={processChange} /> );
    
        expect(screen.getByText(/Blue/).textContent).toBe('Blue');
    
    });
    
    test('config row type of text, renders input', () => {
        render(<ConfigPageRow row={testSetup([], 'text')} onChange={processChange} /> );
    
        expect(screen.getByDisplayValue(/Blue/).value).toBe('Blue');
    
    });
    
    test('config row with one list item, renders list', () => {
        render(<ConfigPageRow row={testSetup(['test'])} onChange={processChange} /> );
    
        const listItem = screen.getByText(/test/);
    
        expect(listItem.textContent).toBe('test');
        
        const linkItem = screen.getByText(/Blue/);
        expect(linkItem.parentElement.parentElement.parentElement.className).not.toContain('is-active');
        expect(screen.getByRole('dropdownlist-content').children.length).toBe(1);
        
        // TODO: need to figure out why this isn't changing class - it works in the browser window
    
    });
});

describe('Interacting with the rendered output', () => {
    test('hide dropdown on doubleclick', () => {
        render(<ConfigPageRow row={testSetup(['test'])} onChange={processChange} /> );
    
        const span = screen.getByText(/Blue/);
    
        fireEvent.click(span);
        fireEvent.click(span);
    
        expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
    });
    
    test('display dropdown on single-click', () => {
        render(<ConfigPageRow row={testSetup(['test'])} onChange={processChange} /> );
    
        const span = screen.getByText(/Blue/);
    
        fireEvent.click(span);
    
        expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown is-active');
    });
});

describe('Properly deal with bogus input', () => {
    test('Renders correct error for bad input', () => {
        render(<ConfigPageRow row={undefined} onChange={processChange} /> );

        expect(screen.getByText(/Row Has No Data/).textContent).toBe('Row Has No Data');
    });
});
    

