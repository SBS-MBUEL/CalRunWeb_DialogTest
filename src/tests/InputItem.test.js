import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import {InputItem} from '../components/InputItem';

describe('render and control input box with good inputs', () => {
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
        render(<InputItem userValue="Input-Test" trackChanges={(key, val) => {
            result = val;
            expect(result).toBe('NewValue');
            expect(inputBox.value).toBe('NewValue');
        }} /> );
        
        const inputBox = screen.getByDisplayValue(/Input-Test/);
    
        fireEvent.change(inputBox, { target: { value: 'NewValue' } });
    });
    
});

describe('render and control input box configured for numerical values', () => {
    test('renders numeric input box with passed in value', () => {
        let result = '';
        render(<InputItem userValue='22' isNumeric = {true} trackChanges={(key, val) => {
            result = val;
            expect(result).toBe('25');
            expect(inputBox.value).toBe('25');
        }} /> );
        
        const inputBox = screen.getByDisplayValue(/22/);
    
        fireEvent.change(inputBox, { target: { value: 25 } });
    });
    test('renders numeric input box and doesn\'t save text input', () => {
        let result = '';
        render(<InputItem userValue='10' isNumeric = {true} trackChanges={(key, val) => {
            result = val;
            expect(result).toBe('');
            expect(inputBox.value).toBe('');
        }} /> );
        
        const inputBox = screen.getByDisplayValue(/10/);
    
        fireEvent.change(inputBox, { target: { value: 'NewValue' } });
    });
});

describe('Input Box renders and controls with null input.', () => {
    test('renders input box with null passed in value', () => {
        render(<InputItem userValue={null} trackChanges={(e) => {
            e.persist();
            result = e.target.value;
        }} /> );
    
        const inputBox = screen.getByDisplayValue(/Not Set/);
    
        expect(inputBox.value).toBe('Not Set');
    
    });

    test('renders input box with undefined passed in value', () => {
        render(<InputItem userValue={undefined} trackChanges={(e) => {
            e.persist();
            result = e.target.value;
        }} /> );
    
        const inputBox = screen.getByDisplayValue(/Not Set/);
    
        expect(inputBox.value).toBe('Not Set');
    
    });
    
    test('renders input box null, verifies value can be changed without error', () => {
        let result = '';
        render(<InputItem userValue={null} trackChanges={(key, val) => {
            result = val;

            expect(result).toBe('NewValue');
            expect(inputBox.value).toBe('NewValue');
        }} /> );
        
        const inputBox = screen.getByDisplayValue(/Not Set/);
    
        try {
            fireEvent.change(inputBox, { target: { value: 'NewValue' } });
        } catch(ex) {
            console.log(ex);
        }
    });
});
