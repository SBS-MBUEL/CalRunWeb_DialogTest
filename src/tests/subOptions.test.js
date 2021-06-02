import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { SubOptions } from '../components/SubOptions';

describe('Sub Options populated as expected.', () => {
    let subOptionControls = [
		{label:'Device-0', type:'dropdown', list:['Not Set', 'AC-S',	'DeepSeapHoxV2',	'Digiquartz',	'Druck', 'ECOV2',	'FloatpH',	'Keithley',	'Kistler',	'SBE3',
            'SBE37',	'SBE39',	'SBE4',	'SBE63',	'SKR-Mini'], width:'100px', height:'30px', control:null, value:'test-1', maxLength:0, titleOrder:0},
        {label:'Device-1', type:'dropdown', list:['Not Set', 'AC-S',	'DeepSeapHoxV2',	'Digiquartz',	'Druck', 'ECOV2',	'FloatpH',	'Keithley',	'Kistler',	'SBE3',
            'SBE37',	'SBE39',	'SBE4',	'SBE63',	'SKR-Mini'], width:'100px', height:'30px', control:null, value:'test-2', maxLength:0, titleOrder:0}
	];

    const processChange = (e) => {

    }

    test('sub option row 0 and 1 have correct keys.', () => {
        render(<SubOptions subOption={subOptionControls} page='testing' onChange={processChange} /> );

        expect(screen.getByText(/Device-0/).textContent).toBe('Device-0');
        expect(screen.getByText(/Device-1/).textContent).toBe('Device-1');
    });

    test('sub option row 0 and 1 have correct values.', () => {
        render(<SubOptions subOption={subOptionControls} page='testing' onChange={processChange} /> );

        expect(screen.getByText(/test-1/).className).toBe('dropdown-toggle');
        expect(screen.getByText(/test-2/).className).toBe('dropdown-toggle');
    });

    test('sub option row 0 and 1 have correct values.', () => {
        render(<SubOptions subOption={subOptionControls} page='testing' onChange={processChange} /> );

        expect(screen.getByText(/Device-0/).textContent).toBe('Device-0');
        expect(screen.getByText(/Device-1/).textContent).toBe('Device-1');
    });
});