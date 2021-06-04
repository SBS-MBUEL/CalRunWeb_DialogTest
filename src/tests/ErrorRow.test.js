import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorRow } from '../components/ErrorRow';

describe('Rendering an error row if row data is invalid', () => {
    test('Row has correct header', () => {
        render(<ErrorRow /> );

        expect(screen.getByText(/Problem with row data/).textContent).toBe('Problem with row data');
    });
    test('Row has correct value', () => {
        render(<ErrorRow /> );

        expect(screen.getByText(/Row Has No Data/).textContent).toBe('Row Has No Data');
    });
    test('Row has correct classes', () => {
        render(<ErrorRow /> );

        expect(screen.getByText(/Row Has No Data/).parentNode.className).toBe('columns has-text-white has-background-danger content font-weight-bold is-vcentered');
    });
});