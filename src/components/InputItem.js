import React from 'react';


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
        if (this.props.isNumeric) {
            if (!isNaN(e.target.value)) { // This is a number
                this.props.trackChanges(this.props.index, e.target.value);
            } else {
                // TODO: display some sort error message about not entering a number.
                // Currently, upon trying to enter text instead of a number, and ErrorRow appears here.
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
        // input type: number doesn't allow for these properties to be used
        if (!this.props.isNumeric) {
            this.settingInput.selectionStart = 0;
            this.settingInput.selectionEnd = this.settingInput.value.length;
        }
        this.settingInput.select();
    }

    render() {
        const { index } = this.props;
        if (this.props.isNumeric) {
            return (
            <React.Fragment>
                <div key={`${index}-input`} className="is-centered is-info is-rounded">
                    <input 
                        value={this.state.userValue}
                        type="number"
                        ref={(input) => { this.settingInput = input; }} 
                        onClick={this.setFocus}
                        onChange={this.trackChanges}
                    ></input>
                </div>          
            </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <div key={`${index}-input`} className="is-centered is-info is-rounded">
                        <input 
                            value={this.state.userValue}
                            type="text"
                            ref={(input) => { this.settingInput = input; }} 
                            onClick={this.setFocus}
                            onChange={this.trackChanges}
                        ></input>
                    </div>          
                </React.Fragment>
            );
        }
        
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