import React from 'react';

class PanelNavigation extends React.Component {
    constructor(props) {
        super(props)
 
    }

    render() {
        return (
            <div key={`${this.props.currentPane} - ${this.props.optionView}: ${this.props.currentPane + 1}`} className="columns has-text-centered">
                <div className="column is-third">
                    <div onClick={this.props.leftArrow} className="button is-link fa fa-chevron-left"></div>
                </div>
                <div className="column is-third">
                    {`${this.props.panel} - ${this.props.currentPane + 1}: ${this.props.optionView}`}
                </div>
                <div className="column is-third">
                    <div onClick={this.props.rightArrow} className="button is-link fa fa-chevron-right"></div>
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
     module.exports = {
        PanelNavigation: PanelNavigation
     };
 }