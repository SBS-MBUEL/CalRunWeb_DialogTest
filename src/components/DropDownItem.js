import React from 'react';
import createGUID from '../utils/createGUID';

class DropDownItem extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     userValue : props.userValue
        // }

        this.changeDropItem = this.changeDropItem.bind(this);
    }

    changeDropItem(e) {
        // Prevent default
        e.preventDefault();

        // stop bubbling
        e.stopPropagation();

        // set changes locally
        // this.setState({
        //     userValue: e.target.textContent
        // });

        this.props.dropChange(e.target.textContent);

    }

    render() {
        const { row } = this.props;
        
        return (
            row.list.map((item, i) => {
                return (
                    <div key={createGUID()} className="container is-clearfix is-centered ml-1 mr-1 mb-1">
                        <a
                            href="#"
                            key={item + i} 
                            onClick={this.changeDropItem} 
                            className={`button is-info ${this.props.userValue === item ? '' : 'is-outlined'} popup-link dropdown-item has-text-centered pl-1 pr-1`}>
                                {item}
                        </a>
                    </div>
                );
            })
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
         DropDownItem: DropDownItem

     };
 }