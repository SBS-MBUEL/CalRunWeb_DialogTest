//TODO: move import to this file
import { render, screen, fireEvent } from '@testing-library/react';
import { link } from 'fs';

import App from '../App';
import LocalStorage from '../utils/LocalStorage';

function setup() {
    localStorage.clear('SystemName-Config');

    localStorage.clear('SystemName-Settings');
}

// Basic render test, renders the whole configuration stack

describe('value errors not popping up.', () => {
    test('changing sub option 0 propagates appropriately with no errors.', () => {

        render(<App /> );

        const _sub_drop_items = screen.getAllByText(/Not Set/);

        const _sub_drop_item = _sub_drop_items[_sub_drop_items.length - 1];

        fireEvent.click(_sub_drop_item);

        const _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);

        _sub_item_list.forEach(el => {
            console.log(`processing click: ${el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.textContent}`)
            fireEvent.click(el);
        });

        expect(_sub_drop_item.textContent).toBe('DeepSeapHoxV2');
    });
});

describe('normal functions', () => {
    test('renders config', () => {
        setup();

        render(<App /> );
        const linkElement = screen.getByText(/SYSTEM/);
    
        expect(linkElement).toBeDefined();
    });
    
    // verifies from the stack that we can click a tab and the class appropriately changes
    test('switch tabs', () => {
        setup();

        render(<App /> );
    
        const linkElement = screen.getAllByText('reference')[0];
        
        let currentClassName = linkElement.parentElement.className;
    
        expect(currentClassName).not.toContain('is-active')
        
        fireEvent.click(linkElement);
    
        currentClassName = linkElement.parentElement.className;
    
        expect(currentClassName).toContain('is-active');
    });

    // at this stage it does add it to the list
    test('add sub item propagates, has no undefined values.', () => {
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/add device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device-[0-9]/);

        expect(_sub_list.length).toBe(2);
    });

    // at this stage it does add it to the list
    test('Keys are correct after adding item.', () => {
        
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/add device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device-[0-9]/);

        expect(_sub_list.length).toBe(3);

        _sub_list.forEach((el, i) => {
            expect(el.textContent).toBe("Device-" + i);
        });
    });

});

