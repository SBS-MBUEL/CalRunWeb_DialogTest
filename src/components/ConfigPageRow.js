import React from 'react';
import createGUID from '../utils/createGUID';

import { DropDownContainer } from './DropDownContainer';
import { InputItem } from './InputItem';
import { TextArea } from './TextArea';
import { ButtonItem } from './ButtonItem';
import { ErrorRow } from './ErrorRow';

/**
 * ConfigPageRow - renders each row of the config page
 * setup in a "key/value" pair arrangement - pop ups are still generic, need to be mapped to an object
 */
 class ConfigPageRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: props && props.row && props.row.value ? props.row.value : undefined,
            settingIndex: props.settingIndex,
            controlIndex: props.controlIndex,
            objectIndex: props.contentIdx
        }
        this.trackChanges = this.trackChanges.bind(this);
        this.btnClickHandler = this.btnClickHandler.bind(this);
    }

    btnClickHandler(btn) {
        this.props.buttonHandler(btn, this.state.settingIndex);
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

        let content = <ErrorRow />;
        let subContent = '';
        if (row && row.value && row.label) {
        
            subContent = row.type === 'dropdown' ?
                    <DropDownContainer index={row.label} userValue={this.state.userValue} trackChanges={this.trackChanges} row={row} />
                : row.type === 'text' ?
                    <InputItem index={row.label} userValue={this.state.userValue} inputChange={this.trackChanges} trackChanges={this.trackChanges} />
                : row.type === 'textarea' ?
                    <TextArea index={row.label} value={this.state.userValue} label={row.label} trackChanges={this.trackChanges} />
                :
                    <ButtonItem value={row.value} handler={this.btnClickHandler} />;
        
            content = ( 
                <div key={`${row.label}-row-data`} className="columns font-weight-bold is-vcentered">
                    <div key={`${row.label}`} className={`column pr-1 heading is-half text-right`}>
                        {row.label}
                    </div>
                    <div key={`${row.label}-input-container`} className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                        {subContent}
                    </div>
                </div> ) 
        }
        
        return content;
    }
}


/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = {
         ConfigPageRow: ConfigPageRow
     };
 }