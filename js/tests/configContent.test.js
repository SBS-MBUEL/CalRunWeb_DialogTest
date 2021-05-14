//TODO: move import to this file
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders config', () => {
    const application = 'TEST';

    render(<App /> );
    const linkElement = screen.findByText(/SYSTEM/);
    expect(linkElement).toBeDefined();
});