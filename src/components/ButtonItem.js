import React from 'react';

class ButtonItem extends React.Component {
    render() {
        const { value, handler} = this.props;

        return (
            <div onClick={handler} className={`button is-${value.includes('add') ? "success" : value.includes('remove') ? 'danger' : 'info'}`}>
                <span
                    
                    className={`fa fa-${value.includes('add') ? "plus" : value.includes('remove') ? 'remove' : 'save'}`}
                >
                    &nbsp;
                </span>
                <span>
                    {value}
                </span>
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
     module.exports = {
        ButtonItem: ButtonItem

     };
 }

