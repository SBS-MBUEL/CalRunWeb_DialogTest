import React from 'react';
import createGUID from '../utils/createGUID';
import { DropDownItem } from './DropDownItem';

class DropDownContainer extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            userValue : props.userValue,
            dropState: false
        }

        this.wrapperRef = React.createRef();

        this.changeDropItem = this.changeDropItem.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.toggleState = this.toggleState.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

      }

      componentWillUnmount() {
        this._isMounted = false;
      }

      /**
       * when an element outside of ref (in return below) is clicked, it will toggle the state of the drop down
       * @param {DOM} e 
       */
    handleBodyClick(e) {

        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(e.target)) {
            this.toggleState(true);
        }

    }

    /**
     * toggle the displayed drop down list
     * @param {Event} e 
     */
     changeDropItem(key, val) {
         
        // set changes locally
        this.props.trackChanges(key, val);

        this.setState({
            userValue: val, 
        })

        this.toggleState(true);

        // propagate changes up the chain so the settings object gets changed
    }
    //TODO: is it being triggered on mouse down and mouse up?
    toggleState(state) {
        if (!state) {
            document.body.addEventListener('click', this.handleBodyClick);
            this.setState({
                dropState: true
            });
        } else {
            document.body.removeEventListener('click', this.handleBodyClick);
            this.setState({
                dropState: false
            });
        }
    }

    /**
     * toggle the displayed drop down list
     * @param {Event} e 
     */
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        this.toggleState(this.state.dropState);

    }

    render() {
        const { row, index } = this.props;
        return (
            <div key={`${index}-dropdown-container`} className={`dropdown ${this.state.dropState ? 'is-active' : ''}`}>
                <div ref={this.wrapperRef} className="dropdown-trigger options">
                    <span onClick={this.toggleDropdown} className="controlLink" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{this.state.userValue}</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </span>
                </div>
                <div className="dropdown-menu modalPopUp" id="dropdown-menu" role="menu">
                    <div role="dropdownlist-content" className="dropdown-content">
                        <DropDownItem index={index} userValue={this.state.userValue} trackChanges={this.changeDropItem} row={row} />
                    </div>
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
        DropDownContainer: DropDownContainer

     };
 }