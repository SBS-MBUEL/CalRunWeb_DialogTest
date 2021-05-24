import React from 'react';
import createGUID from '../utils/createGUID';

import { DropDownList } from './DropDownList';
import { InputItem } from './InputItem';

/**
 * ConfigPageRow - renders each row of the config page
 * setup in a "key/value" pair arrangement - pop ups are still generic, need to be mapped to an object
 */
 class ConfigPageRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: props.row.value,
            dropState : props.dropState,
            config : props.configPage
        }
        this.changeDropItem = this.changeDropItem.bind(this);
        this.trackChanges = this.trackChanges.bind(this);
    }

    changeActiveDropDown(control, index, state) {
        this.resetAllTabs();
        let changedState = this.state[control];
        changedState[index] = state;
        this.setState({
            [control] : changedState
        })
    }

    /**
     * propagates changes up call stack
     * @param {string} key of item in setting object
     * @param {string} val value to replace
     */
     trackChanges(key, val) {
        // Propagate up to save to database
        this.props.onChange(key, val, this.state.settingIndex, this.state.controlIndex); // (0 is setting index)
    }

    trackChanges(e) {
        // e.preventDefault();
        // e.stopPropagation();
        // console.log(e.target);

        // this.setState({userValue: e.target.value})

        // Propagate up to save to database
    }



    /**
     * Builds each row of the configurator
     * @returns ConfigPageRow object
     */
    render() {
        const { row, index } = this.props;
        
        return (
            <div key={row.label + row.value} className="columns content font-weight-bold is-vcentered">
                <div key={createGUID()} className={`column pr-1 heading is-half text-right`}>
                    {row.label}
                </div>
                <div key={`row-${index}`} className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                    {row.list.length > 0 ? 
                        <DropDownList 
                            dropDownState={this.state.dropState}
                            userValue={this.state.userValue} 
                            dropChange={this.changeDropItem} 
                            row={row} 
                        />
                    : 
                        <InputItem 
                            userValue={this.state.userValue} 
                            inputChange={this.trackChanges} 
                            trackChanges={this.trackChanges} 
                        />
                    }
                </div>
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
     module.exports = 
     {
         ConfigPageRow: ConfigPageRow

     };
 }