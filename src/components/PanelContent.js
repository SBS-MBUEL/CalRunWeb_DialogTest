import React from 'react';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { ConfigPageRow } from './ConfigPageRow';
import { SubOptions } from './SubOptions';
import { ErrorPage } from './ErrorPage';
import { renderGrowl } from '../utils/growl'
import { PanelNavigation } from './PanelNavigation';
import { RowContentContainer } from './rowContentContainer';


class PanelContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabContent: props.content,
            calibrationOption: 'calibrationOption',
            calibrationParameter: 'calibrationParameter',
            mainActiveTab : 0,
            mainMaxSlides: 1,
            subActiveTab: 0,
            subMaxSlides: 1
        }

        this.setContentValues = this.setContentValues.bind(this);
        this.buttonHandler = this.buttonHandler.bind(this);
        this.duplicateOrAddRow = this.duplicateOrAddRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.parseContent = this.parseContent.bind(this);
        this.filterContent = this.filterContent.bind(this);
        
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
    }

    componentDidMount() {
        
    }

    /**
     * slides the sub panel to the right
     * position should use state for setting
    */
    slideRight() {
        let newPane = this.state.activeTab < this.state.maxSlides - 1 ? this.state.activeTab + 1 : 0;
        this.setState({activeTab : newPane});
    }

    /**
     * slides current pane to the left
    */
    slideLeft() {
        let newPane = this.state.activeTab > 0 ? this.state.activeTab - 1 : this.state.maxSlides - 1 ;
        this.setState({activeTab : newPane});
    }

    /**
     * filter content object
     * @param {object} content 
     * @param {string} filter 
     * @returns 
    */
    filterContent(content, filter) {
        return content.reduce((sum, cur, i) => {
            if(cur.for === filter) {
                cur.indice = i;
                sum.push(cur);
            } 
            return sum;
        }, []);
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

            mainContent = this.filterContent(content, this.state.calibrationOption);

            subContent = this.filterContent(content, this.state.calibrationParameter);

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
    buttonHandler(btn, settingIdx, parameter = '') {
        const btnFunction = btn.children[1].textContent.split(' ')[0];

        // Determine path of button press
        let { subContent, mainContent } = this.parseContent(this.state.tabContent);

        console.log(parameter, btnFunction, settingIdx, subContent[0].indice);

        // TODO: need to determine which panel is currently displayed and appropriately copy / remove / duplicate it or rows in it.
        if (parameter === '') {
            console.dir(subContent);
            console.dir(subContent[subContent[0].indice]);
            if (btnFunction === 'add') {
                let idx = this.duplicateOrAddRow(subContent[0].controls, btnFunction);
            }
            if (btnFunction === 'copy') {
                let idx = this.duplicateOrAddRow(subContent[0].controls, btnFunction);
            }
            if (btnFunction === 'remove') {
                let idx = this.removeRow(subContent[0].controls, btnFunction);
            }
        } else if (parameter === 'device') {
            if (btnFunction === 'add') {
                let idx = this.duplicateOrAddContent(subContent[settingIdx].controls, btnFunction);
            }
            if (btnFunction === 'copy') {
                let idx = this.duplicateOrAddContent(subContent[settingIdx].controls, btnFunction);
            }
            if (btnFunction === 'remove') {
                let idx = this.removeContent(subContent[settingIdx].controls, btnFunction);
            }
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
        const { index, tabName, handler, activeTab } = this.props;
        let content = this.state.tabContent;

        
        let display = <ErrorPage variableName="content" pageName="CalRun Configuration Page" />
        
        if (content) {
            let { mainContent, subContent } = content && this.parseContent(content);
            display = content[0].defaultName ? (
                <div 
                    key={`${tabName}-panel`} 
                    role="tabpanel" 
                    className={`tab-pane ${activeTab ? 'fade in is-active show' : 'fade out'}`}  
                    id={`${tabName}`}
                >
                    
                    <ConfigurationDisplayHeading key={`${content[0].defaultName}-heading`} handler={handler} heading={content[0].defaultName.toUpperCase()}/>
                    <div className="container overflow">
                        <div className="columns" >
                            <div className="column is-12">
                                {mainContent.map((panel, contentIdx) => {
                                    return (
                                        <div key={`mainContent-${panel.defaultName}-${contentIdx}`} className="mainPanel-content column is-12" style={{"transform": `translateX(${this.state.mainActiveTab * 100 * -1}%)`}}>
                                        {/* TODO: Max Slides should come from content length */}
                                        <RowContentContainer
                                            buttonHandler={this.buttonHandler}
                                            setContentValues={this.setContentValues}
                                            panelContent={panel}
                                            tabName={tabName}
                                            contentIdx={contentIdx}
                                            onChange={this.setContentValues} 
                                            slideLeft={this.slideLeft}
                                            slideRight={this.slideRight}
                                            currentPane={this.state.mainActiveTab}
                                            optionView={'main'}
                                        />

                                    </div>);
                                })
                                }
                                
                            </div>

                        </div>
                        <hr />
                        <div className="columns">
                            <div className="column is-12">
                                {subContent.map((subPanel, subContentIdx) => {
                                    return (
                                    <div key={`subContent-${subPanel.defaultName}-${subContentIdx}`} className="mainPanel-content column is-12" style={{"transform": `translateX(${this.state.mainActiveTab * 100 * -1}%)`}}>
                                        <RowContentContainer
                                            setContentValues={this.setContentValues}
                                            panelContent={subPanel}
                                            tabName={tabName}
                                            contentIdx={subContentIdx}
                                            onChange={this.setContentValues} 
                                            slideLeft={this.slideLeft}
                                            slideRight={this.slideRight}
                                            currentPane={this.state.mainActiveTab}
                                            optionView={'subContent'}
                                        />

                                    </div>);
                                })}

                            </div>
                        </div>

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
    PanelContent: PanelContent

    };
}