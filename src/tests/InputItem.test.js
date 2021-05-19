import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import {InputItem} from '../components/InputItem';

test('renders input box with passed in value', () => {
    render(<InputItem userValue="Input-Test" trackChanges={(e) => {
        e.persist();
        result = e.target.value;
    }} /> );

    const inputBox = screen.getByDisplayValue(/Input-Test/);

    expect(inputBox.value).toBe('Input-Test');


});

test('renders input box, verifies value can be changed', () => {
    let result = '';
    render(<InputItem userValue="Input-Test" trackChanges={(e) => {
        
        console.log(e);
        result = e;
    }} /> );

    const inputBox = screen.getByDisplayValue(/Input-Test/);

    fireEvent.change(inputBox, { target: { value: 'NewValue' } });

    expect(result).toBe('NewValue');

});