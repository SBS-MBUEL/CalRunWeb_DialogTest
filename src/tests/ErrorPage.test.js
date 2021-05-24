import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorPage } from '../components/ErrorPage';

// Basic render test, renders the whole configuration stack
test('renders error page', () => {
    render(<ErrorPage variableName="Test-Variable" pageName='Unit-Testing' /> );
    
    const variableCheck = screen.getAllByText(/Test-Variable/)[0];

    const pageNameCheck = screen.getAllByText(/Unit-Testing/)[0];

    expect(variableCheck.textContent).toMatch(/Test-Variable/);
    expect(pageNameCheck.textContent).toMatch(/Unit-Testing/);

});