import React from 'react';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { ConfigPageRow } from './ConfigPageRow';
import { SubOptions } from './SubOptions';
import { ErrorPage } from './ErrorPage';
import { renderGrowl } from '../utils/growl'
class ConfigurationSetup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabContent: props.content,
        }

        this.setContentValues = this.setContentValues.bind(this);
        this.buttonHandler = this.buttonHandler.bind(this);
        this.duplicateOrAddRow = this.duplicateOrAddRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
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
     * @param {array} subControls - controls list object
     * @returns 
    */
    duplicateOrAddRow(subControls, fn) {
        // change state from content
        // const fn = 'add';
        let changedControls = JSON.parse(JSON.stringify(subControls));
        let newContent = JSON.parse(JSON.stringify(changedControls[changedControls.length - 1]));
        newContent.label = newContent.label.replace(/([0-9][0-9][0-9]|[0-9][0-9]|[0-9])/g, changedControls.length);
        newContent.value = fn === 'add' ? 'Not Set' : newContent.value;
        
        let idx = changedControls.push(newContent) - 1;

        let setIdx = 1;

        let newTabContent = this.state.tabContent.slice();
        newTabContent[setIdx].controls = changedControls;
        // 1 is for subContent
        // TODO: this will not work for subcontent with a list of options
        newTabContent[setIdx].controls = changedControls;

        let key = newTabContent[setIdx].controls[idx].label
        let val = newTabContent[setIdx].controls[idx].value

        this.props.setContent(key, val, newTabContent, this.props.tabName, fn); // TODO: change signature to pass "add" for fn

        return idx;
    }


    removeRow(subControls, fn) {
        let changedControls = JSON.parse(JSON.stringify(subControls));

        let newTabContent = this.state.tabContent.slice();

        let setIdx = 1;
        let idx = changedControls.length - 1
        
        if (changedControls.length > 1) {
            changedControls.pop();
        } else {
            renderGrowl('growl', 'There must be at least one option in the sub option list below.', 'warning');
            return;
        }
        
        let key = newTabContent[setIdx].controls[idx].label
        let val = newTabContent[setIdx].controls[idx].value
        newTabContent[setIdx].controls = changedControls;

        this.props.setContent(key, val, newTabContent, this.props.tabName, fn);
    }

    /**
     * appropriately process button clicked
     * @param {dom} btn pressed in ButtonItem
     */
    buttonHandler(btn) {
        const btnFunction = btn.children[1].textContent.split(' ')[0];

        // Determine path of button press
        let { subContent } = this.parseContent(this.state.tabContent);

        if (btnFunction === 'add') {
            let idx = this.duplicateOrAddRow(subContent, btnFunction);
        }
        if (btnFunction === 'copy') {
            let idx = this.duplicateOrAddRow(subContent, btnFunction);
        }
        if (btnFunction === 'remove') {
            let idx = this.removeRow(subContent, btnFunction);
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

        } else {
            renderGrowl('growl', 'Problem retrieving or displaying tabContent variable. This is likely a bug.', 'danger', 'Unable to Load Page');
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