import React from 'react';
import ConfigPageRow from './ConfigPageRow';

class RowContentContainer extends React.Component {
    constructor(props) {
        super();
        this.state = {
            panelContent : props.panelContent
        }
    }

    render() {

        return (
            <div className="columns">
                <div className="column"  style={{"transform": `translateX(${this.state.currentPane * 100 * -1}%)`}}>
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
                </div>
            </div>
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