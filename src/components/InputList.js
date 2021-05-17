import React from 'react';


class InputList extends React.Component {
    render() {
        const { setFocus, trackInput, userValue, row } = this.props;

        return (
            <React.Fragment>
                <div className="pl-5 is-centered">
                    <input 
                        onClick={setFocus} 
                        type="text"
                        // ref={(input) => { userInput = input; }} 
                        onChange={trackInput}
                        value={userValue}
                    ></input>
                    <hr/>
                    <button className="button button-outline-primary popup-link text-input">
                        submit change
                    </button>
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
        InputList: InputList

     };
 }