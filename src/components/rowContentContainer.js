import React from 'react';
import { ConfigPageRow } from './ConfigPageRow';
import { PanelNavigation } from './PanelNavigation';

class RowContentContainer extends React.Component {
    constructor(props) {
        super();
        this.state = {
            panelContent : props.panelContent,
            maxSlides: props.maxSlides,
            currentView: props.optionView,
        }

        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
    }

    /**
     * slides the sub panel to the right
     * position should use state for setting
    */
         slideRight() {

            let newSlide = this.props.activeSlide > 0 ? (this.props.activeSlide - 1) : (this.props.maxSlides - 1);
            
            
             
            console.log(this.state.currentView, newSlide);
            this.props.changeSlide(this.state.currentView, newSlide);
            
        }
    
        /**
         * slides current pane to the left
        */
        slideLeft() {

            let newSlide = this.props.activeSlide < (this.state.maxSlides - 1) ? (this.props.activeSlide + 1) : 0;
            

            console.log(this.state.currentView, newSlide);
            this.props.changeSlide(this.state.currentView, newSlide);

        }

    render() {
        const { index, tabName, handler, optionView } = this.props;
        return (
                    <React.Fragment>
                        <PanelNavigation 
                            panel={tabName} 
                            optionView={optionView}
                            currentPane={this.props.currentPane}
                            slideLeft={this.slideLeft}
                            slideRight={this.slideRight}
                        />
                        {this.state.panelContent.controls.map((row, rowIdx) => {
                            return (
                                <div key={`${row.label}-${rowIdx}`}>
                                    <ConfigPageRow 
                                        contentIdx={rowIdx}
                                        onChange={this.props.setContentValues} 
                                        row={row} 
                                        settingIndex={this.state.panelContent.indice}
                                        controlIndex={rowIdx} 
                                        buttonHandler={this.props.buttonHandler}
                                    />
                                </div>
                            )
                        })}
                    </React.Fragment>
        );
    }

}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = {
        RowContentContainer: RowContentContainer
     };
 }