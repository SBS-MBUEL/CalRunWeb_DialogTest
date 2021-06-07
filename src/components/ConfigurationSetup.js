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
        this.buttonHandler = this.buttonHandler.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    componentDidMount() {
        
    }

    /**
     * takes content and divides it between main and sub content
     * @param {object} content 
     * @returns 
     */
    parseContent(content) {
        let mainContent = undefined;
        let subContent = undefined;

        if (content && content.length > 0) {

            mainContent = content.reduce((sum, cur) => {
                if(cur.for === 'calibrationOption') {
                    sum.push(cur) 
                } 
                return sum;
            }, [])[0].controls.slice();

            subContent = content.reduce((sum, cur) => {
                if (cur.for === 'calibrationParameter') {
                    sum.push(cur)
                }
                return sum;
            }, [])[0].controls.slice();
        }

        return {
            mainContent, subContent
        }
    }

    /**
     * adds row to selected subContent
     * //TODO: this will likely need to be refactored to deal with more complex lists
     * @param {array} subContent - controls list object
     * @returns 
     */
    addRow(subContent) {
        // change state from content
        const fn = 'add';

        let idx = subContent.push(subContent[0]) - 1;
        let setIdx = 1;

        let changedContent = this.state.tabContent.slice();

        // 1 is for subContent
        changedContent[setIdx].controls = subContent;
        // TODO: this will not work for subcontent with a list of options

        changedContent[setIdx].controls[idx].label = subContent[idx].label.replace(/([0-9][0-9]|[0-9])/, idx);
        let key = changedContent[setIdx].controls[idx].label
        let val = 'Not Set'

        changedContent[setIdx].controls[idx].value = val;
        
        this.props.setContent(key, val, changedContent, this.props.tabName, fn); // TODO: change signature to pass "add" for fn

        return idx;
    }

    /**
     * appropriately process button clicked
     * @param {dom} btn pressed in ButtonItem
     */
    buttonHandler(btn) {
        const btnFunction = btn.children[1].textContent.split(' ')[0];
        // Determine path of button press
        console.log(btnFunction);

        let { subContent } = this.parseContent(this.state.tabContent);

        if (btnFunction === 'add') {
            let idx = this.addRow(subContent);
        }


    }

    /**
     * 
     * @param {string} key "header" that helps locate the item in the control list
     * @param {string} val value to add to the table
     * @param {number} settingIdx whether upper (main) or lower (sub)
     * @param {number} controlIdx numeric position in control list
     */
    setContentValues(key, val, settingIdx, controlIdx) {
        let changedContent = this.state.tabContent.slice();
        changedContent[settingIdx].controls[controlIdx].value = val;

        this.props.setContent(key, val, changedContent, this.props.tabName);
    }

    render() {
        const { index, tabName, handler } = this.props;
        let content = this.state.tabContent;

        
        let display = <ErrorPage variableName="content" pageName="CalRun Configuration Page" />
        
        if (content) {
            let { mainContent, subContent } = content && this.parseContent(content);
            display = content[0].defaultName ? (
                <div>
                    
                    <ConfigurationDisplayHeading key={`${content[0].defaultName}-heading`} handler={handler} heading={content[0].defaultName.toUpperCase()}/>
                    <div className="overflow">
                        <div className="container">
                            {mainContent.map((row, index) => {
    
                                return (
                                    <ConfigPageRow 
                                        key={index} 
                                        onChange={this.setContentValues} 
                                        row={row} 
                                        settingIndex={0}
                                        controlIndex={index} 
                                        buttonHandler={this.buttonHandler}
                                    />
                                )
                            })}
    
                        </div>
                        <hr />
                        <div className="container">
                            {subContent.length > 0 ?
                                <SubOptions 
                                    onChange={this.setContentValues} 
                                    subOption={subContent} 
                                    page={content[0].defaultName.toUpperCase()}
                                />
                                :
                                <React.Fragment>
                                    {/* Empty div to display nothing */}
                                </React.Fragment>
                            }
                        </div>
                        {/* {rows.length > 0 ? rows.map((col, index) => <SubOptions />) : <p>No configs below this.</p>} */}
                    </div>
                </div>
            ) : 
            display;

        }

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
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
    ConfigurationSetup: ConfigurationSetup

    };
}