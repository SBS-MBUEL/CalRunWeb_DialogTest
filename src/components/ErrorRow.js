import React from 'react';

class ErrorRow extends React.Component {


    render() {
        return (
            <div key="ErrorRow" className="columns has-text-white has-background-danger content font-weight-bold is-vcentered">
                <div className={`column pr-1 heading is-half text-right`}>
                    Problem with row data
                </div>
                <div className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                    Row Has No Data
                </div>
            </div>
        )
    }



}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        ErrorRow: ErrorRow
    };
}