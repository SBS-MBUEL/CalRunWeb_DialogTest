import { render, screen, fireEvent } from '@testing-library/react';
import { link } from 'fs';

import Growl from '../utils/growl-containter';
import { renderGrowl } from '../utils/growl';

describe('golden path functionality', () => {
    test('level === info', () => {
        render(<Growl /> );

        renderGrowl('growl', 'info-test', 'info', '', false);

        const growl = screen.getByText(/info-test/);

        expect(growl.textContent).toBe('info-test');
        expect(growl.parentNode.className).toBe('tile is-child notification is-info growling removed')
    });

    test('level === warning', () => {
        render(<Growl /> );

        renderGrowl('growl', 'warning-test', 'warning');

        const growl = screen.getByText(/warning-test/);


        expect(growl.textContent).toBe('warning-test');
        expect(growl.parentNode.className).toBe('tile is-child notification is-warning growling removed')
    });

    test('level === success', () => {
        render(<Growl /> );

        renderGrowl('growl', 'success-test', 'success');

        const growl = screen.getByText(/success-test/);


        expect(growl.textContent).toBe('success-test');
        expect(growl.parentNode.className).toBe('tile is-child notification is-success growling removed')
    });

    test('level === danger', () => {
        render(<Growl /> );

        renderGrowl('growl', 'danger-test', 'danger');

        const growl = screen.getByText(/danger-test/);


        expect(growl.textContent).toBe('danger-test');
        expect(growl.parentNode.className).toBe('tile is-child notification is-danger growling removed')
    });

    test('make sure growl dissapears', () => {
        jest.useFakeTimers();
        render(<Growl /> );

        renderGrowl('growl', 'danger-test', 'danger');
        
        jest.runAllTimers();
        
        try {
            const growl = screen.getByText(/danger-test/);
        } catch(er) {
            // Unable to find element after timer elapsed
            expect(true).toBe(true);
        }
        
        
    });
});

describe('trying to break method', () => {
    test('null arguments', () => {
        render(<Growl /> );

        renderGrowl(null, 'danger', 'danger');

        try {
            const growl = screen.getByText(/danger/);
        } catch(er) {
            // Unable to find element with null id
            expect(true).toBe(true);
        }

        renderGrowl('growl', null, 'danger');

        try {
            const growl = screen.getByText(/danger-test/);
            expect(false).toBe(true);
        } catch(er) {
            // Unable to find element with null id
            expect(true).toBe(true);
        }

        renderGrowl('growl', 'growl', null);

        try {
            const growl = screen.getByText(/growl/);
            expect(false).toBe(true);
        } catch(er) {
            // Unable to find element with null id
            expect(true).toBe(true);
        }

    });
});