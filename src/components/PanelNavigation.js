import React from 'react';

class PanelNavigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            panel : this.props.panel,
            optionView : this.props.optionView,
            currentPane : this.props.currentPane
        }

    }

    render() {
        return (
            <div key={`${this.state.currentPane} - ${this.state.optionView}: ${this.state.currentPane + 1}`} className="columns has-text-centered">
                <div className="column is-third">
                    <div onClick={this.props.slideLeft} className="button is-link fa fa-chevron-left"></div>
                </div>
                <div className="column is-third">
                    {`${this.state.panel} - ${this.state.optionView}: ${this.state.currentPane + 1}`}
                </div>
                <div className="column is-third">
                    <div onClick={this.props.slideRight} className="button is-link fa fa-chevron-right"></div>
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