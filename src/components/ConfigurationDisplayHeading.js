import React from 'react';
import createGUID from '../utils/createGUID';
/**
 * ConfigurationDisplayHeading - renders title heading of each tab and the control buttons
 */
 class ConfigurationDisplayHeading extends React.Component {

    
    render() {
        const { heading, handler } = this.props;

        // this should likely come from an external source
        const buttonMap = [
            {
                type: "success",
                icon: "plus",
                text: "ADD"
            },
            {
                type: "warning",
                icon: "copy",
                text: "COPY"
            },
            {
                type: "info",
                icon: "save",
                text: "SAVE"
            },
            {
                type: "danger",
                icon: "remove",
                text: "REMOVE"
            },
        ]

        return (
            <React.Fragment>
                <div key={createGUID()} className="columns">

                    <div className="column">
                        <h1 className="title is-2 has-text-centered">{heading}</h1>
                    </div>
                </div>
                <div key={createGUID()} className="columns is-centered">
                    <div key={createGUID()} className={`column is-one-fifth`}>
                    </div>
                    {buttonMap.map((el, index) => {
                        return (
                            <div key={createGUID()} className={`column has-text-centered is-one-fifth`}>
                                <div onClick={handler} className={`button is-${el.type}`}>
                                    <span
                                        
                                        className={`fa fa-${el.icon}`}
                                    >
                                        &nbsp;
                                    </span>
                                    {el.text}

                                </div>
                            </div>
                        )
                    })}
                    <div key={createGUID()} className={`column is-one-fifth`}>
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