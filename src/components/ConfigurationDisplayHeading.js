import React from 'react';
import createGUID from '../utils/createGUID';
/**
 * ConfigurationDisplayHeading - renders title heading of each tab and the control buttons
 */
 class ConfigurationDisplayHeading extends React.Component {

    
    render() {
        const { heading, handler } = this.props;

        return (
            <React.Fragment>
                <div key={createGUID()} className="columns">

                    <div className="column">
                        <h1 className="title is-2 has-text-centered">{heading}</h1>
                    </div>
                </div>

            </React.Fragment>
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
         ConfigurationDisplayHeading: ConfigurationDisplayHeading

     };
 }