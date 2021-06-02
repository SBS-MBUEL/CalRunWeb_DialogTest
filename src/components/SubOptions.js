import React from 'react';
import {ConfigPageRow} from './ConfigPageRow';
import createGUID from '../utils/createGUID';

/**
 * SubOptions - this is the inner panel that displays a sliding tab for those options
 */
 class SubOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages : [],
            currentPane : 0,
            maxSlides : this.props.subOption.length
        }
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.trackChanges = this.trackChanges.bind(this);
    }

    /**
     * propagates changes up call stack
     * @param {string} key of item in object
     * @param {string} val value to replace
     * @param {number} settingIdx outer index (0 or 1)
     * @param {number} controlIdx inner index of control list to update
     */
    trackChanges(key, val, settingIdx, controlIdx) {
        // Propagate up to save to database
        this.props.onChange(key, val, settingIdx, controlIdx); // (0 is setting index)
    }


    /**
     * slides the sub panel to the right
     * position should use state for setting
     */
    slideRight() {
        
        let index = this.state.currentPane < this.state.maxSlides - 1 ? this.state.currentPane + 1 : 0;
        this.setState({currentPane : index});

    }

    /**
     * slides current pane to the left
     */
    slideLeft() {
        let index = this.state.currentPane > 0 ? this.state.currentPane - 1 : this.state.maxSlides - 1 ;
        this.setState({currentPane : index});

    }


    render() {
        const { subOption, page } = this.props;

        let currentRow = 0
        // TODO: changing dropdown for sub list is not working
        return (
            <div className="columns">
                <div className="column">

                    {/* increment through options */}
                    {subOption.map((optionTab, index) => {
                        return (
                            <div key={page + index} style={{"transform": `translateX(${this.state.currentPane * 100 * -1}%)`}}>
                                <ConfigPageRow 
                                    onChange={this.trackChanges} 
                                    key={index} 
                                    row={optionTab} 
                                    settingIndex={1}
                                    controlIndex={index} 
                                />
                            </div>
                        );
                    })}
                    {/* TODO: Don't like styling of these  */}
                    {/* TODO: Make sure they only display if the instrument has sub configs - makes a tab confusing */}
                    {(subOption.length > 1 ? 
                        <React.Fragment>
                            <button key={page+createGUID()} onClick={this.slideLeft} className="slider__btn slider__btn--left">
                                <span className="fa fa-arrow-left"></span>
                            </button>
                            <button key={page+createGUID()} onClick={this.slideRight} className="slider__btn slider__btn--right">
                                <span className="fa fa-arrow-right"></span>
                            </button>
                            <div className="columns" >
                                <div key={page+createGUID()} className="column has-text-centered dots">
                                    {subOption.map((pane, index) => {
                                        return (
                                            <span key={pane + index} className={`${(index === this.state.currentPane) ? 'active' : 'inactive'}--dot fa fa-circle`}></span>
                                        );

                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    :
                        <React.Fragment>
                            {subOption.map((_, index) => {
                                return (
                                    <div className="columns" key={_ + index}>
                                        <div className="column has-text-centered dots">
                                            <span className={`${(index === this.state.currentPane) ? 'active' : 'inactive'}--dot fa fa-circle`}></span>

                                        </div>
                                    </div>
                                );

                            })}
                        </React.Fragment>
                    )}

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
     module.exports = 
     {
         SubOptions: SubOptions

     };
 }