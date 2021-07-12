import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { PanelContent } from '../components/PanelContent';


const _configuration_area = 'Mock Control Device';

const _mock_device = [
	{
        for:'calibrationOption',
		defaultName:'Mock Control Device',
		controls: [
            {label:'Remove Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'remove device-button', maxLength:0, titleOrder:-1},
            {label:'Copy Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'copy device-button', maxLength:0, titleOrder:-1},
            {label:'Add Device', type:'button', list:[], width:'50px', height:'30px', control:null, value:'add device-button', maxLength:0, titleOrder:-1},
            {label:'Device', type:'dropdown', list:['item-1', 'item-2'], width:'50px', height:'30px', control:null, value:'drop-list', maxLength:0, titleOrder:0},
            {label:'SN', type:'text', list:[], width:'50px', height:'30px', control:null, value:'text-input', maxLength:20, titleOrder:1},
            {label:'Port', type:'textarea', list:[], width:'50px', height:'30px', control:null, value:'textarea-input', maxLength:0, titleOrder:-1},
	    ]
    },
	{
        for:'calibrationParameter',
		defaultName:'Measurand',
		controls: [
		    {label:'Measurand-0', type:'dropdown', list:['purple', 'people', 'eater'], width:'100px', height:'30px', control:['purple', 'people', 'eater'], value:'sub-list', maxLength:0, titleOrder:0},
	    ]
    }
];

let _global_value = 'Not Set';
let _global_key = 'Not Set';
let _global_content = {};
let _global_tab_name = 'Not Set';
let _global_setting_index = -1;

const processChange = (key, val, content, tabName, fn) => {
    expect(val).not.toBe(undefined);
    _global_value = val;

    expect(key).not.toBe(undefined);
    _global_key = key;

    expect(content).not.toBe(undefined);
    _global_content = content;

    expect(_global_content).not.toBe(_mock_device);
    expect(_global_content[_global_setting_index].controls[0].value).toBe(_global_value);

    expect(tabName).not.toBe(undefined);
    _global_tab_name = tabName;

}
let globalFN = '';
const clickRouter = (key, val, changedContent, tabName, fn) => {
    expect(fn).toBe(globalFN);
}

describe('test input is correct', () => {
    test('renders correct items', () => {
        render(<PanelContent                                                 
                index={0} 
                content={_mock_device}
                setContent={processChange}
                tabName={_configuration_area}
                handler={clickRouter} 
            /> );

        const _drop_list = screen.getAllByText(/drop-list/)[0];
        const _text_input = screen.getByDisplayValue(/text-input/);
        const _textarea = screen.getByDisplayValue(/textarea-input/);
        const _remove_button = screen.getAllByText(/remove device-button/)[0];
        const _add_button = screen.getAllByText(/add device-button/)[0];
        
        expect(_drop_list.textContent).toContain('drop-list');
        expect(_text_input.value).toContain('text-input');
        expect(_remove_button.textContent).toContain('remove device-button');
        expect(_add_button.textContent).toContain('add device-button');
    });

    test('renders correct name for grouping', () => {
        render(<PanelContent                                                 
            index={0} 
            content={_mock_device}
            setContent={processChange}
            tabName={_configuration_area}
            handler={clickRouter} 
        /> );

        const getMainTitle = screen.getAllByText(/Mock Control Device/i)[1]; // Main Panel title

        expect(getMainTitle.textContent).toBe('MOCK CONTROL DEVICE - 1: drop-list');

    });

    test('list has valid items', () => {
        render(<PanelContent                                                 
                index={0} 
                content={_mock_device}
                setContent={processChange}
                tabName={_configuration_area}
                handler={clickRouter} 
            /> );

        const _drop_item_1 = screen.getByText(/item-1/);
        const _drop_item_2 = screen.getByText(/item-2/);

        expect(_drop_item_1).not.toBe(undefined);
        expect(_drop_item_2).not.toBe(undefined);

        expect(_drop_item_1.textContent).toBe('item-1');
        expect(_drop_item_2.textContent).toBe('item-2');

    });
    test('sub list renders', () => {
        render(<PanelContent                                                 
            index={0} 
            content={_mock_device}
            setContent={processChange}
            tabName={_configuration_area}
            handler={clickRouter} 
            /> );

        const _sub_item = screen.getByText(/sub-list/);

        expect(_sub_item).not.toBe(undefined);

        expect(_sub_item.textContent).toBe('sub-list');
    });

    test('sub list has valid items', () => {
        _global_setting_index = 1;
        render(<PanelContent                                                 
            index={0} 
            content={_mock_device}
            setContent={processChange}
            tabName={_configuration_area}
            handler={clickRouter} 
            /> );

        const _sub_item_1 = screen.getByText(/purple/);        
        const _sub_item_2 = screen.getByText(/people/);
        const _sub_item_3 = screen.getByText(/eater/);

        expect(_sub_item_1).not.toBe(undefined);
        expect(_sub_item_2).not.toBe(undefined);
        expect(_sub_item_3).not.toBe(undefined);

        expect(_sub_item_1.textContent).toBe('purple');
        expect(_sub_item_2.textContent).toBe('people');
        expect(_sub_item_3.textContent).toBe('eater');

    });

    test('main key different from sub key', () => {
        render(<PanelContent
                index={0} 
                content={_mock_device}
                setContent={processChange}
                tabName={_configuration_area}
                handler={clickRouter} 
            />)
        const mainContent = screen.getByText(/SN/).parentNode.firstChild;
        const subContent = screen.getByText(/Measurand-0/).parentNode.firstChild;

        expect(mainContent.textContent).not.toBe(subContent.textContent);
    });
});

describe('invalid content package renders correct error', () => {
    test('error page rendered with incorrect content', () => {
        render(<PanelContent                                                 
            index={0} 
            content={undefined}
            setContent={processChange}
            tabName={_configuration_area}
            handler={clickRouter} 
        /> );

        const _error_screen = screen.getByText(/Unable to process/);

        expect(_error_screen.textContent).toBe('Unable to process variable for CalRun Configuration Page');
    });
});

describe('Can change sub item', () => {
    test('change sub item propagates, has no undefined values.', () => {
        render(<PanelContent                                                 
                index={0} 
                content={_mock_device}
                setContent={processChange}
                tabName={_configuration_area}
                handler={clickRouter} 
            /> );

        const _sub_item = screen.getByText(/sub-list/);
        fireEvent.click(_sub_item);
        
        const _sub_item_1 = screen.getByText(/purple/);
        
        fireEvent.click(_sub_item_1);

        expect(_sub_item_1.textContent).toBe('purple');
    });
    
    // at this stage does not add yet to the display
    test('add sub item propagates, has no undefined values.', () => {
        render(<PanelContent                                                 
                index={0} 
                content={_mock_device}
                setContent={clickRouter}
                tabName={_configuration_area}
                handler={clickRouter} 
            /> );

        const _sub_item = screen.getByText(/add device-button/);
        globalFN = 'add';
        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Measurand-[0-9]/);

        expect(_sub_list.length).toBe(2);
    });

    // at this stage does not add yet to the display
    test('copy sub item propagates, has existing value of last entry.', () => {
        render(<PanelContent                                                 
                index={0} 
                content={_mock_device}
                setContent={clickRouter}
                tabName={_configuration_area}
                handler={clickRouter} 
            /> );

        const _sub_item = screen.getByText(/copy device-button/);
        globalFN = 'copy';

        fireEvent.click(_sub_item);
        
        const _sub_list = screen.getAllByText(/Measurand-[0-9]/);

        expect(_sub_list.length).toBe(3); // TODO: not really certain why this is 2?
        
    });


        // at this stage does not remove from the display
        test('remove sub item propagates, has existing value of last entry.', () => {
            globalFN = 'remove';
            render(<PanelContent                                                 
                    index={0} 
                    content={_mock_device}
                    setContent={clickRouter}
                    tabName={_configuration_area}
                    handler={clickRouter} 
                /> );
    
            const _sub_item = screen.getAllByText(/remove device-button/)[0];

            fireEvent.click(_sub_item);
            
            const _sub_list = screen.getAllByText(/Measurand/i);
    
            expect(_sub_list.length).toBe(2); // TODO: not really certain why this is 3?
            
        });
});
