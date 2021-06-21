import React from 'react';
import { ConfigPageRow } from './ConfigPageRow';
import { PanelNavigation } from './PanelNavigation';

class RowContentContainer extends React.Component {
    constructor(props) {
        super();
        this.state = {
            panelContent : props.panelContent,
            maxSlides: props.maxSlides,
            currentPane : 0,
            activeTab : props.activeTab
        }

    }

    render() {
        const { index, tabName, handler, optionView } = this.props;
        return (
            <div key={`${tabName}-${optionView}-${index}`}>
                    {/* TODO: Max Slides should be dynamic should come from content length */}
                    <PanelNavigation 
                        panel={tabName} 
                        optionView={optionView}
                        currentPane={this.state.currentPane}
                        slideLeft={this.props.slideLeft}
                        slideRight={this.props.slideRight}
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
            </div>
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