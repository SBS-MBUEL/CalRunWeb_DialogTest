import React from 'react';

class TextArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value : props.value != null ? props.value : "Not Set"
        }
        
        this.trackChanges = this.trackChanges.bind(this);
        // this.setCursorPos = this.setCursorPos.bind(this);
    }

    // setCursorPos() {
    //     const textarea = document.querySelector(`#${this.props.label}-inputForNotes`);
    //     console.log(`#${this.props.label}-inputForNotes`);
    //     console.log(textarea);
    //     const cursor_pos = this.state.value.length;
    
    //     textarea.setSelectionRange(cursor_pos, cursor_pos);
    //     textarea.focus();
    // }

    trackChanges(e) {
        e.preventDefault()

        e.stopPropagation();
        console.log(e.target);
        this.setState({
            value: e.target.textContent
        })

        this.props.trackChanges(this.props.label, e.target.textContent);
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
                    // ref={this.setCursorPos} 
                    selectionStart={startingPoint}
                    selectionEnd={startingPoint + this.state.value.length}
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