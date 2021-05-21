import React from 'react';
import createGUID from '../utils/createGUID';
import { DropDownItem } from './DropDownItem';

class DropDownList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue : props.userValue,
            dropState: false
        }
        this.changeDropItem = this.changeDropItem.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    /**
     * toggle the displayed drop down list
     * @param {Event} e 
     */
     changeDropItem(val) {
        // set changes locally
        this.props.trackChanges(val);

        this.setState({
            userValue: val, 
            dropState: false
        })

        // propagate changes up the chain so the settings object gets changed
    }

    /**
     * toggle the displayed drop down list
     * @param {Event} e 
     */
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.state.dropState) {
            this.setState({dropState: true});
        } else {
            this.setState({dropState: false});
        }
    }

    render() {
        const { row } = this.props;
        console.log(`UserValue: ${this.state.userValue}`);
        return (
            <div key={`${row.label}-dropdown-container`} className={`dropdown ${this.state.dropState ? 'is-active' : ''}`}>
                <div className="dropdown-trigger options">
                    <span onClick={this.toggleDropdown} className="controlLink" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{this.state.userValue}</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </span>
                </div>
                <div className="dropdown-menu modalPopUp" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {/* Need to figure out how to populate this with actual data */}
                        <DropDownItem userValue={this.state.userValue} dropChange={this.changeDropItem} row={row} />
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