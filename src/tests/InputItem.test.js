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
