import React from 'react';
import createGUID from '../utils/createGUID';

/**
 * ConfigPageRow - renders each row of the config page
 * setup in a "key/value" pair arrangement - pop ups are still generic, need to be mapped to an object
 */
 class ConfigPageRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropState: ""
        }
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }
    toggleDropdown(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.dropState == "") {
            this.setState({dropState: "is-active"});
        } else {
            this.setState({dropState: ""});
        }
    }
    render() {
        const { row, index } = this.props;
        
        return (
            <div key={row.label + row.value} className="columns content font-weight-bold is-vcentered">
                <div key={createGUID()} className={`column pr-1 heading is-half text-right`}>
                    {row.label}
                </div>
                <div key={createGUID()} className={`column pl-1 pb-1 is-half text-left is-vcentered`}>
                    <div onClick={this.toggleDropdown} class={`dropdown ${this.state.dropState}`}>
                        <div className="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span className={`dropdown-toggle`} data-toggle="dropdown">{row.value}</span>
                                <span class="icon is-small">
                                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                                {/* Need to figure out how to populate this with actual data */}
                                {row.list.length > 0 ? row.list.map((item, i) => {
                                    return (
                                        <a
                                            href="#"
                                            key={item + i} 
                                            onClick={this.props.handler} 
                                            className={`button button-outline-primary popup-link dropdown-item`}>
                                                {item}
                                        </a>
                                    );
                                }) : <p></p>}
                            </div>
                        </div>
                    </div>
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
         ConfigPageRow: ConfigPageRow

     };
 }