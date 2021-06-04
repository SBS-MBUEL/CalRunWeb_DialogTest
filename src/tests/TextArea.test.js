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
    render(<TextArea value={testSetup().value} index={0} label={testSetup().label} trackChanges={trackChanges}  /> );

    const textInput_rendered = screen.getByText(/Blue/);

    expect(textInput_rendered.value).toBe("Blue");
    
});

test('renders Text Area with "Blue" changed', () => {
    let result = '';
    render(<TextArea value={testSetup().value} index={0} label={testSetup().label} trackChanges={(k, v) => {
        result = trackChanges(k, v);
        expect(result).toBe('NewContent');
    }
    }  /> );

    const textInput_rendered = screen.getByText(/Blue/);

    fireEvent.change(textInput_rendered, {target:{value:'NewContent'}});

    expect(textInput_rendered.value).toBe("NewContent");
    
});

