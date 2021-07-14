//TODO: move import to this file
import { render, screen, fireEvent } from '@testing-library/react';
import databaseMockContent, { databaseContent, databaseTabs } from '../mocks/databaseMockContent';
import configMocks, { objectCollection } from '../mocks/configMocks'
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';

import App from '../App';

var localSettings = getLocalStorage('SystemName-Settings');
var localConfig = getLocalStorage('SystemName-Config');

function setup() {
    localStorage.clear('SystemName-Config');

    localStorage.clear('SystemName-Settings');

    if (!localSettings) { // retrieve database immediately
        setLocalStorage('SystemName-Settings', databaseContent);
        localSettings = databaseContent;
    }

    if (!localConfig) { // retrieve configuration from database
        setLocalStorage('SystemName-Config', objectCollection);
        localConfig = objectCollection;
    }
}

// Basic render test, renders the whole configuration stack

describe('value errors not popping up.', () => {
    test('changing sub option 0 propagates appropriately with no errors.', () => {
        setup();
        render(<App /> );

        const _sub_drop_items = screen.getAllByText(/Not Set/);

        const initial_length = _sub_drop_items.length;

        console.log(initial_length);

        const _sub_drop_item = _sub_drop_items[6];

        fireEvent.click(_sub_drop_item);

        const _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);


        _sub_item_list.forEach(el => {
            fireEvent.click(el);
        });

        const new_length = screen.getAllByText(/Not Set/).length;

        expect(new_length).toBe(initial_length - 1);
    });
});

describe('normal functions', () => {
    test('renders config', () => {
        setup();

        render(<App /> );
        const linkElement = screen.getAllByText(/SYSTEM/)[0];
    
        expect(linkElement).toBeDefined();
    });
    
        
    // Verifies from the stack that we can click a tab and the class appropriately changes
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

    // At this stage it does add it to the list
    test('add sub item propagates, has no undefined values.', () => {
        setup();

        render(<App /> );

        let _sub_drop_items = screen.getAllByText(/Not Set/);
        expect(_sub_drop_items.length).toBe(57);

        const _sub_drop_item = _sub_drop_items[5];

        fireEvent.click(_sub_drop_item);
        // _sub_drop_items = screen.getAllByText(/Not Set/);


        let _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);
        expect(_sub_item_list.length).toBe(2);

        _sub_item_list.forEach(el => {
            fireEvent.click(el);
        });

        _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);
        _sub_drop_items = screen.getAllByText(/Not Set/);

        expect(_sub_item_list.length).toBe(2);
        expect(_sub_drop_items.length).toBe(57);

        const _add_item = screen.getAllByText(/add device/)[0];
        fireEvent.click(_add_item);


        _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);
        _sub_drop_items = screen.getAllByText(/Not Set/);

        expect(_sub_item_list.length).toBe(3);
        expect(_sub_drop_items.length).toBe(59);
        
    });

    // At this stage it does add it to the list
    test('Keys are correct after adding item.', () => {
        
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/add device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device/);

        expect(_sub_list.length).toBe(16);

        _sub_list.forEach((el, i) => {
            expect(el.textContent).toMatch(/Device/i);
        });
    });

    // at this stage it does add it to the list
    test('copy sub item propagates, has no undefined values.', () => {
        setup();

        render(<App /> );

        let _sub_drop_items = screen.getAllByText(/Not Set/);
        let _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);

        const _copy_button = screen.getAllByText(/copy device/)[0];
        fireEvent.click(_copy_button);

        expect(_sub_item_list.length).toBe(4);
        expect(_sub_drop_items.length).toBe(61);
        
        const _sub_list = screen.getAllByText(/Device/);

        expect(_sub_list.length).toBe(17);

        _sub_item_list = screen.getAllByText(/DeepSeapHoxV2/);
        _sub_drop_items = screen.getAllByText(/Not Set/);

        expect(_sub_item_list.length).toBe(5);
        expect(_sub_drop_items.length).toBe(63);
    });

    // at this stage it does add it to the list
    test('Keys are correct after copying item.', () => {
        
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/copy device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device/);

        expect(_sub_list.length).toBe(18);

        _sub_list.forEach((el, i) => {
            console.log('devices' + el.textContent);
            expect(el.textContent).toMatch(/Device/i);
        });
        
    });

    // at this stage it does add it to the list
    test('remove sub item propagates, has no undefined values.', () => {
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/remove device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device/);

        expect(_sub_list.length).toBe(17);
    });

    // at this stage it does add it to the list
    test('Keys are correct after removing last item.', () => {
        setup();

        render(<App /> );

        const _sub_item = screen.getAllByText(/remove device/)[0];
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Device/);

        expect(_sub_list.length).toBe(16);

        _sub_list.forEach((el, i) => {
            expect(el.textContent).toMatch(/Device/i);
        });
    });

});

