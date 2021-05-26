import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { DropDownList } from '../components/DropDownList';

const testRowObject = {
    label: 'DropDownList-test',
    value: 'span-test',
    list: ['drop1', 'drop2', 'drop3', 'drop4']
}

const processClick = (k, v) => {

}

test('row renders span', () => {
    render(<DropDownList userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    expect(screen.getByText('span-test').textContent).toBe('span-test');
});

test('row renders span with class set correctly (inactive)', () => {
    render(<DropDownList userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});

test('row renders span with class set correctly (active) when clicked', () => {
    render(<DropDownList userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown is-active');
});

test('row renders span with class set correctly (inactive) when clicked twice', () => {
    render(<DropDownList userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);
    fireEvent.click(span);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});

test('row renders span with class set correctly (inactive) when body clicked', () => {
    render(<DropDownList userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);
    fireEvent.click(span.parentNode.parentNode.parentNode.parentNode);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});


