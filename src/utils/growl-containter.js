import React from 'react';

// TODO: needs comments
// The purpose of this function is to create a container for the unit tests on the Growl functions
export default function Growl(props) {

    return (

        <div id="growl-container" className="tile is-ancestor">
            <div className="tile is-vertical is-8">
                <div className="tile">
                    <div id="growl" className="tile is-parent is-vertical">
                        {/* <!-- Growl appears here --> */}
                    </div>
                </div>
            </div>
        </div>
    )
}