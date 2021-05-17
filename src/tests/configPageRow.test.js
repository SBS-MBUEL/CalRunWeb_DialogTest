//TODO: move import to this file
import { render, screen } from '@testing-library/react';
import {ConfigPageRow} from '../components/ConfigPageRow';

test('renders config row with no pop ups', () => {
    const row = {
        label: "Green",
        value: "Blue",
        list: []
    };

    render(<ConfigPageRow row={row} /> );
    screen.debug();
    console.log(screen.queryAllByText(/Green/));

    const linkElement = screen.getByText(/Green/);
    console.log(linkElement);
    expect(screen.getByText(/Green/).textContent).toBe('Green');

    expect(screen.getByText(/Blue/).textContent).toBe('Blue');
});