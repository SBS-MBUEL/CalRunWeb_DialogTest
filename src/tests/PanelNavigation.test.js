import { fireEvent, render, screen, userEvent } from '@testing-library/react';
import { PanelNavigation } from '../components/PanelNavigation';

function switchPane() {

}

const testPanel = 'panelNavTest';
const optionView = 'optionParameter';
const currentPane = 0;

describe('normal input', () => {
    test('able to render passed in content', () => {
        render(<PanelNavigation             
                panel = {testPanel}
                optionView = {optionView}
                currentPane = {currentPane} 
                />);

        const pane = screen.getByText(/panelNavTest - 1: optionParameter/);
        
        expect(pane.textContent).toBe('panelNavTest - 1: optionParameter');

    });

    test('left arrow is available', () => {
        render(<PanelNavigation             
                panel = {testPanel}
                optionView = {optionView}
                currentPane = {currentPane} 
                />);

        const pane = screen.getByText(/panelNavTest - 1: optionParameter/);
        const clickLeft = pane.parentNode.firstChild.firstChild;
        
        expect(clickLeft.className).toBe('button is-link fa fa-chevron-left');

    });

    test('right arrow is available', () => {
        render(<PanelNavigation             
            panel = {testPanel}
            optionView = {optionView}
            currentPane = {currentPane} 
            />);

        const pane = screen.getByText(/panelNavTest - 1: optionParameter/);
        const clickRight = pane.parentNode.lastChild.firstChild;
        
        expect(clickRight.className).toBe('button is-link fa fa-chevron-right');
    });
});