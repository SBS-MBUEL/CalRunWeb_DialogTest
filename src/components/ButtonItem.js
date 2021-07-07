import React from 'react';

class ButtonItem extends React.Component {

    /**
     * constructor for ButtonItem
     * @param {object} props - passed in properties
     */
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * handleClick - for the button pressed determines which part of the UI was clicked and passes up appropriate UI element to next level.
     * @param {DOM} e - element clicked on
     */
    handleClick(e) {
        const el = !(e.target.className.includes('button')) ? e.target.parentElement : e.target;

        this.props.handler ? this.props.handler(el) : console.error('unable to propagate button click up stack');
    }
    render() {
        const { value } = this.props;

        return (
            <div onClick={this.handleClick} className={`button is-${value.includes('add') ? "success" : value.includes('remove') ? 'danger' : 'info'} row`}>
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

