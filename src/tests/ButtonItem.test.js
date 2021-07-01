import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { ButtonItem } from '../components/ButtonItem';

function testSetup(opts, type="dropdown", value="add device") {
    let list = opts ? opts : []
    const row = {
        label: "Green",
        value: value,
        type: type,
        list: list
    };

    return row;
}

function processClick(key, val) {
    return val;
}

describe('rendering with add device works', () => {
    test('renders button with correct addition text', () => {
        render(<ButtonItem value={testSetup().value} handler={processClick} /> );
    
        const getButton = screen.getByText(/add device/);
        expect(getButton.textContent).toBe('add device');
    });
    
    test('renders button with correct addition icon', () => {
        render(<ButtonItem value={testSetup().value} handler={processClick} /> );
    
        const getButton = screen.getByText(/add device/).parentNode.firstChild;
        expect(getButton.className).toBe('fa fa-plus');
    });
    
    test('renders button with correct add color', () => {
        render(<ButtonItem value={testSetup([],undefined,'add device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/add device/).parentNode;
        expect(getButton.className).toBe('button is-success row');
    });
});

describe('rendering with remove button works', () => {
    test('renders button with correct delete text', () => {
        render(<ButtonItem value={testSetup([],undefined,'remove device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/remove device/);
        expect(getButton.textContent).toBe('remove device');
    });
    
    test('renders button with correct delete icon', () => {
        render(<ButtonItem value={testSetup([],undefined,'remove device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/remove device/).parentNode.firstChild;
        expect(getButton.className).toBe('fa fa-remove');
    });
    
    test('renders button with correct delete color', () => {
        render(<ButtonItem value={testSetup([],undefined,'remove device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/remove device/).parentNode;
        expect(getButton.className).toBe('button is-danger row');
    });
});

describe('rendering with custom text works', () => {
    test('renders button with correct custom text', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/custom device/);
        expect(getButton.textContent).toBe('custom device');
    });
    
    test('renders button with correct custom (save) icon', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/custom/).parentNode.firstChild;
        expect(getButton.className).toBe('fa fa-save');
    });
    
    test('renders button with correct add color', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={processClick} /> );
    
        const getButton = screen.getByText(/custom device/).parentNode;
        expect(getButton.className).toBe('button is-info row');
    });
});

describe('Button clicks work as expected', () => {
    test('Button event propagates correct object back when span for text is clicked', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={(e) => {
                expect(e.className).toBe('button is-info row');
            }
         } /> );
    
        const getButton = screen.getByText(/custom device/);
    
        fireEvent.click(getButton);
    
    });
    test('Button event propagates correct object back when span for icon is clicked', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={(e) => {
                expect(e.className).toBe('button is-info row');
            }
         } /> );
    
        const getButton = screen.getByText(/custom device/).parentNode.firstChild;
    
        fireEvent.click(getButton);
    
    });
    test('Button event propagates correct object back when div for button is clicked', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={(e) => {
                expect(e.className).toBe('button is-info row');
            }
        } /> );

        const getButton = screen.getByText(/custom device/).parentNode;

        fireEvent.click(getButton);
    });
    
});


describe('Button properly deals with missing propagated listener', () => {
    test('Button has no listener passed in, doesn\'t cause error', () => {
        render(<ButtonItem value={testSetup([],undefined,'custom device').value} handler={undefined} /> );
        const getButton = screen.getByText(/custom device/).parentNode;
        let actualErrorMsg;
        try {
            fireEvent.click(getButton);
        } catch(e) {
            actualErrorMsg = e.message;
        }

        expect(actualErrorMsg).toBe(undefined);
    });
});
