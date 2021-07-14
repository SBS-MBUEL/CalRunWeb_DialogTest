import React from 'react';
import {ConfigPageRow} from './ConfigPageRow';
import createGUID from '../utils/createGUID';

/**
 * SubOptions - this is the inner panel that displays a sliding tab for those options
 */
 class SubOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages : [],
            currentPane : 0,
            maxSlides : this.props.subOption.length
        }
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.trackChanges = this.trackChanges.bind(this);
    }

    /**
     * propagates changes up call stack
     * @param {string} key of item in object
     * @param {string} val value to replace
     * @param {number} settingIdx outer index position in index array of this object
     * @param {number} controlIdx inner index of control list to update
     */
    trackChanges(key, val, settingIdx, controlIdx) {
        // Propagate up to save to database
        this.props.onChange(key, val, settingIdx, controlIdx); 
    }


    /**
     * slides the sub panel to the right
     * position should use state for setting
     */
    slideRight() {
        
        let index = this.state.currentPane < this.state.maxSlides - 1 ? this.state.currentPane + 1 : 0;
        this.setState({currentPane : index});

    }

    /**
     * slides current pane to the left
     */
    slideLeft() {
        let index = this.state.currentPane > 0 ? this.state.currentPane - 1 : this.state.maxSlides - 1 ;
        this.setState({currentPane : index});

    }


    render() {
        const { subOption, page, settingIndex } = this.props;

        let currentRow = 0
        // TODO: changing dropdown for sub list is not working
        return (
            <div className="columns">
                <div className="column"  style={{"transform": `translateX(${this.state.currentPane * 100 * -1}%)`}}>

                    {/* increment through options */}
                    {subOption.map((optionTab, index) => {
                        return (<ConfigPageRow 
                                    onChange={this.trackChanges} 
                                    key={index} 
                                    row={optionTab} 
                                    settingIndex={settingIndex}
                                    controlIndex={index} 
                                />
                        );
                    })}


                </div>
            </div>
        );
    }
}


/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     module.exports = {
         SubOptions: SubOptions

     };
 }