import React from 'react';

class PanelNavigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            panel : this.props.panel,
            optionView : this.props.optionView,
            currentPane : this.props.currentPane,
            maxSlides : this.props.maxSlides
        }

        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
    }

    /**
     * slides the sub panel to the right
     * position should use state for setting
     */
    slideRight() {
        let newPane = this.state.currentPane < this.state.maxSlides - 1 ? this.state.currentPane + 1 : 0;
        this.setState({currentPane : newPane});
    }

    /**
     * slides current pane to the left
     */
    slideLeft() {
        let index = this.state.currentPane > 0 ? this.state.currentPane - 1 : this.state.maxSlides - 1 ;
        this.setState({currentPane : index});
    }

    render() {
        return (
            <div key={`${this.state.currentPane} - ${this.state.optionView}: ${this.state.currentPane + 1}`} className="columns has-text-centered">
                <div className="column is-third">
                    <div onClick={this.slideLeft} className="button is-link fa fa-chevron-left"></div>
                </div>
                <div className="column is-third">
                    {`${this.state.panel} - ${this.state.optionView}: ${this.state.currentPane + 1}`}
                </div>
                <div className="column is-third">
                    <div onClick={this.slideRight} className="button is-link fa fa-chevron-right"></div>
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