import React from 'react';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { ConfigPageRow } from './ConfigPageRow';
import { SubOptions } from './SubOptions';
import { ErrorPage } from './ErrorPage';
class ConfigurationSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainContent : props.content.reduce((sum, cur) => {
                if(cur.for === 'calibrationOption') {
                    sum.push(cur) 
                } 
                return sum;
            }, [])[0].controls,
            subContent : props.content.reduce((sum, cur) => {
                if (cur.for === 'calibrationParameter') {
                    sum.push(cur)
                }
                return sum;
            }, [])[0].controls,
            dropStateContent : new Array(props.content.reduce((sum, cur) => {
                if(cur.for === 'calibrationOption') {
                    sum.push(cur) 
                } 
                return sum;
            }, [])[0].controls.length).fill(false),
            dropStateSubContent : new Array(props.content.reduce((sum, cur) => {
                if (cur.for === 'calibrationParameter') {
                    sum.push(cur)
                }
                return sum;
            }, [])[0].controls.length).fill(false)
        }
    }

    resetAllTabs() {
        this.setState({
            dropStateContent : new Array(props.content.reduce((sum, cur) => {
                if(cur.for === 'calibrationOption') {
                    sum.push(cur) 
                } 
                return sum;
            }, [])[0].controls.length).fill(false),
            dropStateSubContent : new Array(props.content.reduce((sum, cur) => {
                if (cur.for === 'calibrationParameter') {
                    sum.push(cur)
                }
                return sum;
            }, [])[0].controls.length).fill(false)
        });
    }

    setContentValues(key, val, settingIdx, controlIdx) {
        let changedContent = this.state.tabContent.slice();
        changedContent[settingIdx].controls[controlIdx].value = val;
        // TODO: causing sub pages to forget content
        // this.setState({
        //     value:  changedContent
        // })
        console.log(key, val, changedContent, this.props.tabName);
        this.props.setContent(key, val, changedContent, this.props.tabName);
    }

    changeActiveDropDown(control, index, state) {
        this.resetAllTabs();
        let changedState = this.state[control];
        changedState[index] = state;
        this.setState({
            [control] : changedState
        })
    }
    
    render() {
        const {content, index, tabName, handler} = this.props;

        let content = this.state.tabContent;

        let mainContent = undefined;
        let subContent = undefined;

        if (content && content.length > 0) {
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
                
                <ConfigurationDisplayHeading 
                    key={content[0].defaultName} 
                    handler={handler} 
                    heading={content[0].defaultName.toUpperCase()}
                />
                <div className="overflow">
                    {this.state.mainContent.map((row, index) => {

                        return (
                            <ConfigPageRow 
                                dropState={this.state.dropStateContent[index]}
                                changeActiveDropDown={this.changeActiveDropDown}
                                key={index} 
                                index={index} 
                                onChange={this.setContentValues} 
                                row={row} 
                                settingIndex={0}
                                controlIndex={index} 
                            />
                        )
                    })}
                    <hr />
                    {this.state.subContent.length > 0 ?
                        <SubOptions 
                            dropState={this.state.dropStateSubContent}
                            changeActiveDropDown={this.changeActiveDropDown}
                            subOption={this.state.subContent} 
                        />
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