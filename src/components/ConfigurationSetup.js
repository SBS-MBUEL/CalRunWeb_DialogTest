import React from 'react';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { ConfigPageRow } from './ConfigPageRow';
import { SubOptions } from './SubOptions';
import { ErrorPage } from './ErrorPage';
class ConfigurationSetup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabContent: props.content,
        }

        this.setContentValues = this.setContentValues.bind(this);
    }

    setContentValues(key, val, settingIdx, controlIdx) {
        let changedContent = this.state.tabContent.slice()[settingIdx].controls[controlIdx].value = val;
        // TODO: causing sub pages to forget content
        // this.setState({
        //     value:  changedContent
        // })
        this.props.setContent(key, val, changedContent, this.props.tabName);
        console.log(this.state.tabContent);
    }

    render() {
        const {index, tabName, handler} = this.props;

        let content = this.state.tabContent;

        let mainContent = undefined;
        let subContent = undefined;

        if (content) {
            mainContent = content.reduce((sum, cur) => {
                if(cur.for === 'calibrationOption') {
                    sum.push(cur) 
                } 
                return sum;
            }, [])[0].controls;
            subContent = content.reduce((sum, cur) => {
                if (cur.for === 'calibrationParameter') {
                    sum.push(cur)
                }
                return sum;
            }, [])[0].controls;

        }
        let display = <ErrorPage variableName="content" pageName="CalRun Configuration Page" />
        display = content &&  content[0].defaultName && (
            <div>
                
                <ConfigurationDisplayHeading key={content[0].defaultName} handler={handler} heading={content[0].defaultName.toUpperCase()}/>
                <div className="overflow">
                    {mainContent.map((row, index) => {

                        return (
                            <ConfigPageRow onChange={this.setContentValues} key={index} row={row} index={index} />
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

    /**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
     if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
     {
         module.exports = 
         {
            ConfigurationSetup: ConfigurationSetup
    
         };
     }