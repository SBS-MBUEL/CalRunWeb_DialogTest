import React from 'react';
import ConfigPageRow from './ConfigPageRow';

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
        const { index, tabName, handler } = this.props;
        return (
            <React.Fragment>
                    {/* TODO: Max Slides should be dynamic should come from content length */}
                    <PanelNavigation 
                        panel={tabName} 
                        optionView={'main'}
                        currentPane={this.state.currentPane}
                        slideLeft={this.props.slideLeft}
                        slideRight={this.props.slideRight}
                    />
                    {this.state.panelContent.map((panel, contentIdx) => {
                        return (
                            <div key={`mainContent-panel.defaultName-${i}`} className="mainPanel-content">
                                {panel.controls.map((mainRow, rowIdx) => {
                                    return (
                                        <ConfigPageRow 
                                            contentIdx={contentIdx}
                                            key={index} 
                                            onChange={this.props.setContentValues} 
                                            row={mainRow} 
                                            settingIndex={panel.indice}
                                            controlIndex={rowIdx} 
                                            buttonHandler={this.props.buttonHandler}
                                        />
                                    )
                                })}
                            </div>
                        );
                    })}
        </React.Fragment>
        )
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