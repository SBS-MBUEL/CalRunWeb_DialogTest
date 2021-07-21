import React from 'react';
import { renderGrowl } from '../utils/growl'

class InputItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: this.props.userValue !== undefined && this.props.userValue !== null ? this.props.userValue : 'Not Set'
        }

        this.trackChanges = this.trackChanges.bind(this);
        this.setFocus = this.setFocus.bind(this);
    }

    trackChanges(e) {
        e.preventDefault();

        this.setState({
            userValue: e.target.value
        });
        if (this.props.type === 'number') {
            if (e.target.value && !isNaN(e.target.value)) { // This is a number
                this.props.trackChanges(this.props.index, e.target.value);
            } else {
                renderGrowl('growl', 'Text entered for number-only field', 'warning');
                // Setting value to 0, so that this overwrites the last valid number entered
                this.props.trackChanges(this.props.index, 0);
            }
        } else {
            this.props.trackChanges(this.props.index, e.target.value);
        }  
    }

    /**
     * highlights selected input (hopefully)
     */
    setFocus() {
        this.settingInput.focus();
        this.settingInput.select();
    }

    render() {
        const { index } = this.props;
        return (
        <React.Fragment>
            <div key={`${index}-input`} className="is-centered is-info is-rounded">
                <input 
                    value={this.state.userValue}
                    type={this.props.type || 'text'}
                    ref={(input) => { this.settingInput = input; }} 
                    onClick={this.setFocus}
                    onChange={this.trackChanges}
                ></input>
            </div>          
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
     module.exports = 
     {
        InputItem: InputItem

     };
 }