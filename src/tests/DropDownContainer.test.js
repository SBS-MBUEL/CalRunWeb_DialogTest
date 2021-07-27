import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { DropDownContainer } from '../components/DropDownContainer';

const testRowObject = {
    label: 'DropDownList-test',
    value: 'span-test',
    list: ['drop1', 'drop2', 'drop3', 'drop4']
}

window.HTMLElement.prototype.scrollIntoView = function() {};

const processClick = (k, v) => {

}

test('row renders span', () => {
    render(<DropDownContainer userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    expect(screen.getByText('span-test').textContent).toBe('span-test');
});

test('row renders span with class set correctly (inactive)', () => {
    render(<DropDownContainer userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});

test('row renders span with class set correctly (active) when clicked', () => {
    render(<DropDownContainer userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown is-active');
});

test('row renders span with class set correctly (inactive) when clicked twice', () => {
    render(<DropDownContainer userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);
    fireEvent.click(span);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});

test('row renders span with class set correctly (inactive) when body clicked', () => {
    render(<DropDownContainer userValue={testRowObject.value} row={testRowObject} index={testRowObject.label} /> );

    const span = screen.getByText('span-test');

    fireEvent.click(span);
    fireEvent.click(span.parentNode.parentNode.parentNode.parentNode);

    expect(span.parentNode.parentNode.parentNode.className).toBe('dropdown ');
});


