import React from 'react';
import createGUID from '../utils/createGUID';

import { DropDownList } from './DropDownList';
import { InputItem } from './InputItem';
import { TextArea } from './TextArea';

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

    handler() {

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

    /**
     * Builds each row of the configurator
     * @returns ConfigPageRow object
     */
    render() {
        const { row, index } = this.props;
        return (
            <div key={`${row.label}-row-data`} className="columns content font-weight-bold is-vcentered">
                <div key={`${row.label}`} className={`column pr-1 heading is-half text-right`}>
                    {row.label}
                </div>
                <div key={`${row.label}-input-container`} className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                    {row.type === 'dropdown' ?
                        <DropDownList index={row.label} userValue={this.state.userValue} trackChanges={this.trackChanges} row={row} />
                    : row.type === 'text' ?
                        <InputItem index={row.label} userValue={this.state.userValue} inputChange={this.trackChanges} trackChanges={this.trackChanges} />
                    : row.type === 'textarea' ?
                        // <TextArea label={row.label} value={this.state.userValue} index={index} trackChanges={this.trackChanges} />
                        // TEXT AREA
                        <textarea 
                            onChange={this.trackChanges} 
                            id={`${row.label}-${index}`}
                            value={row.value}
                        />
                    :
                        // Render button
                        <div onClick={this.handler} className={`button is-${row.value.includes('add') ? "success" : row.value.includes('remove') ? 'danger' : 'info'}`}>
                            <span
                                
                                className={`fa fa-${row.value.includes('add') ? "plus" : row.value.includes('remove') ? 'remove' : 'save'}`}
                            >
                                &nbsp;
                            </span>
                            {row.value}
                        </div>
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