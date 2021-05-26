import React from 'react';


class InputItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue : props.userValue
        }

        this.trackChanges = this.trackChanges.bind(this);
    }

    trackChanges(e) {
        e.preventDefault();
        // e.stopPropagation();
        this.setState({
            userValue: e.target.userValue
        });
        // this.setState({userValue: e.target.value});
        // Propagate up call stack
        this.props.trackChanges(this.props.index, e.target.value);
    }

    render() {
        const { index } = this.props;
        return (
            <React.Fragment>
                <div key={`${index}-input`} className="is-centered is-info is-rounded">
                    <input 
                        // onClick={this.setFocus} 
                        type="text"
                        // ref={(input) => { userInput = input; }} 
                        onChange={this.trackChanges}
                        value={this.state.userValue}
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