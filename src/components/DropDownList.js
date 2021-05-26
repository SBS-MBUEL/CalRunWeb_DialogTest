import React from 'react';
import createGUID from '../utils/createGUID';
import { DropDownItem } from './DropDownItem';

class DropDownList extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            userValue : props.userValue,
            dropState: false
        }
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

    handleBodyClick(e)
    {
        if (e.className !== "drop-item" && this._isMounted) {
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
                <div className="dropdown-trigger options">
                    <span onClick={this.toggleDropdown} className="controlLink" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{this.state.userValue}</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </span>
                </div>
                <div className="dropdown-menu modalPopUp" id="dropdown-menu" role="menu">
                    <div role="dropdownlist-content" className="dropdown-content">
                        {/* Need to figure out how to populate this with actual data */}
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
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = 
     {
        DropDownList: DropDownList

     };
 }