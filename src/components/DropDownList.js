import React from 'react';
class DropDownList extends React.Component {
    render() {
        const {dropState, toggleDropdown, row} = this.props;
        
        return (
            <div className={`dropdown ${dropState ? 'is-active' : ''}`}>
                <div className="dropdown-trigger">
                    <button onClick={(e) => toggleDropdown(e)} className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{row.value}</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu modalPopUp mr-1 ml-1 pr-2" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {/* Need to figure out how to populate this with actual data */}
                        {/* {this.state.dropState && this.userValue !== undefined ? this.userValue.focus() : ''} */}
                        {row.list.map((item, i) => {
                            return (
                                <a
                                    href="#"
                                    key={item + i} 
                                    className={`button button-outline-primary popup-link has-text-centered dropdown-item ml-1 mb-1`}>
                                        {item}
                                </a>
                            );
                        })
                            
                        }
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