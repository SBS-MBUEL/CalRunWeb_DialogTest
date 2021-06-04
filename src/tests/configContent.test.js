//TODO: move import to this file
import { render, screen, fireEvent } from '@testing-library/react';
import { link } from 'fs';
import App from '../App';

// Basic render test, renders the whole configuration stack
test('renders config', () => {

    render(<App /> );
    const linkElement = screen.getByText(/SYSTEM/);

    expect(linkElement).toBeDefined();
});

// verifies from the stack that we can click a tab and the class appropriately changes
test('switch tabs', () => {
    render(<App /> );

    const linkElement = screen.getAllByText('reference')[0];
    
    let currentClassName = linkElement.parentElement.className;

    expect(currentClassName).not.toContain('is-active')
    
    fireEvent.click(linkElement);

    currentClassName = linkElement.parentElement.className;

    expect(currentClassName).toContain('is-active');
});