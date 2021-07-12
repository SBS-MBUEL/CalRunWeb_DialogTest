import React from 'react';
import { ConfigPageRow } from './ConfigPageRow';

class RowContentContainer extends React.Component {
    constructor(props) {
        super();
        this.state = {
            panelContent : props.panelContent,
            maxSlides: props.maxSlides,
            currentView: props.optionView
            
        }

        this.setContentValues = this.setContentValues.bind(this);
    }

    /**
     * Sets the content values locally then passes up the chain to change the object in the database and localstorage
     * @param {string} key "header" that helps locate the item in the control list
     * @param {string} val value to add to the table
     * @param {number} settingIdx whether upper (main) or lower (sub)
     * @param {number} controlIdx numeric position in control list
    */
    setContentValues(key, val, settingIdx, controlIdx) {
        if (settingIdx === 0 && controlIdx === 0) {
            this.setState({
                currentView : val
            });
        }

        this.props.setContentValues(key, val, settingIdx, controlIdx);
    }

    render() {
        const { index, tabName, handler, optionView } = this.props;
        return (
                    <React.Fragment>
                        {/* <PanelNavigation 
                            panel={tabName} 
                            optionView={this.state.currentView}
                            currentPane={this.props.currentPane}
                            leftArrow={this.slideLeft}
                            rightArrow={this.slideRight}
                        /> */}
                        {this.state.panelContent.controls.map((row, rowIdx) => {
                            return (
                                <div className="column content" key={`${row.label}-${rowIdx}`}>
                                    <ConfigPageRow 
                                        contentIdx={rowIdx}
                                        onChange={this.setContentValues} 
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
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     module.exports = {
        RowContentContainer: RowContentContainer
     };
 }