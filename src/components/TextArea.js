import React from 'react';

class TextArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value : props.value
        }
        
        this.trackChanges = this.trackChanges.bind(this);
    }

    trackChanges(e) {
        this.setState({
            value: e.target.textContent
        })

        this.props.trackChanges(this.props.index, e.target.textContent);
    }
    
    render() {
        const { value, index } = this.props;
        return (
            // TEXT AREA
            <textarea 
                onChange={this.trackChanges} 
                id={`${index}-inputForNotes`}
                value={value}
            />
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
        TextArea: TextArea

     };
 }