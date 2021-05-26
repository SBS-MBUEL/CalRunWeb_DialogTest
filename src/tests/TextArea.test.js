import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { TextArea } from '../components/TextArea';

function testSetup(opts) {
    let list = opts ? opts : []
    const row = {
        label: "Green",
        value: "Blue",
        list: list
    };

    return row;

}

function trackChanges(key, val) {
    return val;
}

test('renders Text Area with "Blue"', () => {
    let result = '';
    render(<TextArea label={testSetup().label} value={testSetup().value} index={0} trackChanges={trackChanges}  /> );

    const textInput_rendered = screen.getByText(/Blue/);

    expect(textInput_rendered.textContent).toBe("Blue");
    
});

test('renders Text Area with "Blue"', () => {
    let result = '';
    render(<TextArea label={testSetup().label} value={testSetup().value} index={0} trackChanges={(k, v) => {
        results = trackChanges(k, v);
        expect(results).toBe('NewContent');
    }
    }  /> );

    const textInput_rendered = screen.getByText(/Blue/);

    textInput_rendered.textContent = 'NewContent';

    expect(textInput_rendered.textContent).toBe("NewContent");
    
});

