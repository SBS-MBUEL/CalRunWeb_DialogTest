import React from 'react';
import {ConfigurationDisplayHeading} from './ConfigurationDisplayHeading';
import {ConfigPageRow} from './ConfigPageRow';
import {SubOptions} from './SubOptions';
class ConfigurationSetup extends React.Component {
    render() {
        const {content, index, tabName, handler} = this.props;
        const mainContent = content.reduce((sum, cur) => {
            if(cur.for === 'calibrationOption') {
                sum.push(cur) 
            } 
            return sum;
        }, [])[0].controls;
        const subContent = content.reduce((sum, cur) => {
            if (cur.for === 'calibrationParameter') {
                sum.push(cur)
            }
            return sum;
        }, [])[0].controls;

        let display = <p>no content</p>;
        display = content &&  content[0].defaultName && (
            <div>
                
                <ConfigurationDisplayHeading key={content[0].defaultName} handler={handler} heading={content[0].defaultName.toUpperCase()}/>
                <div className="overflow">
                    {mainContent.map((row, index) => {

                        return (
                            <ConfigPageRow key={index} row={row} index={index} />
                        )
                    })}
                    <hr />
                    {subContent.length > 0 ?
                        <SubOptions subOption={subContent} page={content[0].defaultName.toUpperCase()}/>
                        :
                        <React.Fragment>
                            {/* Empty div to display nothing */}
                        </React.Fragment>
                    }
                    {/* {rows.length > 0 ? rows.map((col, index) => <SubOptions />) : <p>No configs below this.</p>} */}
                </div>
            </div>
        );
        return (
            <React.Fragment>
                {display}
            </React.Fragment>
        );
    }
}