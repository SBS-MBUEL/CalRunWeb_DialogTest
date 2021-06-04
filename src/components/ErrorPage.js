import React from 'react';

class ErrorPage extends React.Component {
    render() {
        const { variableName, pageName } = this.props;
        return (
            <div className="container">
                <div className="tile is-ancestor">
                    <div className="tile is-parent">
                        <article className="tile is-child notification is-danger is-rounded">
                            <p className="title">Unable to process variable for <strong>{pageName}</strong></p>
                            <p className="subtitle">the variable for <strong>{variableName}</strong> is not available</p>
                            <div className="is-danger">
                                
                                The page was unable to process the data from {variableName} to render the {pageName}.
                                <hr />
                                Try the following, if you are still having issues or think this is an application problem, file a bug.
                                <ul>
                                    <li>
                                        1. Make sure you are properly connected to the network through the VPN or locally. (SBS)
                                    </li>
                                    <li>
                                        2. Try to hard refresh the page. (CTRL + F5)
                                    </li>
                                    <li>
                                        3. Try to restart your computer.
                                    </li>
                                    <li>
                                        4. If you are still having issues viewing this content correctly, please file a bug.
                                    </li>
                                </ul>
                                
                            </div>
                        </article>
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
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        ErrorPage: ErrorPage
    };
}