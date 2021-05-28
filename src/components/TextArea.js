import React from 'react';

class TextArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value : props.value != "" ? props.value : "Not Set"
        }
        
        this.trackChanges = this.trackChanges.bind(this);
    }

    trackChanges(e) {

        this.setState({
            value: e.target.value
        })

        this.props.trackChanges(this.props.label, e.target.value);
    }
    
    render() {
        const { value, index, label } = this.props;
        const startingPoint = 0;

        return (
            // TEXT AREA
            <div
                key={`${index}-${label}`}   
            >
                <textarea 
                    onChange={this.trackChanges} 
                    id={`${label}-inputForNotes`}
                    value={this.state.value}
                >
                    
                </textarea>
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
        TextArea: TextArea

     };
 }