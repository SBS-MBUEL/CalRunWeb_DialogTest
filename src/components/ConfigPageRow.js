import React from 'react';
import createGUID from '../utils/createGUID';

import {DropDownList} from './DropDownList';
import {InputItem} from './InputItem';

/**
 * ConfigPageRow - renders each row of the config page
 * setup in a "key/value" pair arrangement - pop ups are still generic, need to be mapped to an object
 */
 class ConfigPageRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: props.row.value,
            settingIndex: props.settingIndex,
            controlIndex: props.controlIndex
        }
        this.trackChanges = this.trackChanges.bind(this);
    }


    trackChanges(key, val) {
        // Propagate up to save to database
        this.props.onChange(key, val, this.state.settingIndex, this.state.controlIndex); // (0 is setting index)
    }

    /**
     * Builds each row of the configurator
     * @returns ConfigPageRow object
     */
    render() {
        const { row, index } = this.props;
        return (
            <div key={row.label + row.value} className="columns content font-weight-bold is-vcentered">
                <div key={`${row.label}`} className={`column pr-1 heading is-half text-right`}>
                    {row.label}
                </div>
                <div key={`${row.label}-input-container`} className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                    {row.list.length > 0 ? 
                        <DropDownList index={row.label} userValue={this.state.userValue} trackChanges={this.trackChanges} row={row} />
                    : 
                        <InputItem index={row.label} userValue={this.state.userValue} inputChange={this.trackChanges} trackChanges={this.trackChanges} />
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