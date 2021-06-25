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
            tabName: props.tabName,
            tabContent: props.content,
            calibrationOption: 'calibrationOption',
            calibrationParameter: 'calibrationParameter',
            mainActiveSlide : 0,
            subActiveSlide: 0,
        }

        this.setContentValues = this.setContentValues.bind(this);
        this.buttonHandler = this.buttonHandler.bind(this);
        this.duplicateOrAddContent = this.duplicateOrAddContent.bind(this);
        this.duplicateOrAddRow = this.duplicateOrAddRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.removeContent = this.removeContent.bind(this);
        this.parseContent = this.parseContent.bind(this);
        this.filterContent = this.filterContent.bind(this);
        
        this.changeSlide = this.changeSlide.bind(this);
    }

    componentDidMount() {

    }

    /**
     * slides the sub panel to the right or left
     * position should use state for setting
    */
    changeSlide(view, newSlide) {

        if (this.state.tabName.match(/device/i)) {
            this.setState({mainActiveSlide : newSlide});
            this.setState({subActiveSlide: newSlide});
        } else {
            this.setState({[`${view}ActiveSlide`] : newSlide});
        }

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
     * adds panel to CONTENT object
     * //TODO: this will likely need to be refactored to deal with more complex lists
     * @param {array} content - controls list object
     * @param {string} fn - add / delete / copy
     * @param {number} subIdx - Where in the content object to place the content
     * @returns 
    */
    duplicateOrAddContent(content, fn, subIdx) {

        // copy panel (main or sub)
        const copiedPanel = JSON.parse(JSON.stringify(content));
        // copy content
        const existingContent = JSON.parse(JSON.stringify(this.state.tabContent));

        if (fn === 'add') {
            copiedPanel.controls.map((el) => {
                el.value = 'Not Set';
            })
        }

        let idx = existingContent.push(copiedPanel);

        this.props.setContent(undefined, undefined, copiedPanel, this.props.tabName, fn, 'panel'); // TODO: change signature to pass "add" for fn

        return idx;
    }

    /**
     * adds row to selected subContent
     * //TODO: this will likely need to be refactored to deal with more complex lists
     * @param {array} subControls - controls list object
     * @param {string} fn - add / delete / copy
     * @param {number} subIdx - Where in the content object to place the content
     * @returns 
    */
    duplicateOrAddRow(subControls, fn, subIdx) {
        // change state from content
        // const fn = 'add';
        let changedControls = JSON.parse(JSON.stringify(subControls));

        let newContent = JSON.parse(JSON.stringify(changedControls[changedControls.length - 1]));
        
        newContent.label = newContent.label.replace(/([0-9][0-9][0-9]|[0-9][0-9]|[0-9])/g, changedControls.length);
        newContent.value = fn === 'add' ? 'Not Set' : newContent.value;
        
        let idx = changedControls.push(newContent) - 1;

        let newTabContent = this.state.tabContent.slice();
        newTabContent[subIdx].controls = changedControls;
        // 1 is for subContent
        // TODO: this will not work for subcontent with a list of options
        newTabContent[subIdx].controls = changedControls;

        let key = newTabContent[subIdx].controls[idx].label
        let val = newTabContent[subIdx].controls[idx].value

        this.props.setContent(key, val, newTabContent, this.props.tabName, fn); // TODO: change signature to pass "add" for fn

        return idx;
    }

    /**
     * 
     * @param {*} subControls 
     * @param {*} fn 
     * @param {*} subIdx 
     * @returns 
     */
    removeContent(subControls, fn, subIdx) {
        let changedControls = JSON.parse(JSON.stringify(subControls));

        let newTabContent = this.state.tabContent.slice();

        let setIdx = subIdx;
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
     * 
     * @param {*} subControls 
     * @param {*} fn 
     * @param {*} subIdx 
     * @returns 
     */
    removeRow(subControls, fn, subIdx) {
        let changedControls = JSON.parse(JSON.stringify(subControls));

        let newTabContent = this.state.tabContent.slice();

        let setIdx = subIdx;
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
    buttonHandler(btn, settingIdx) {
        const btnFunction = btn.children[1].textContent.split(' ')[0];

        const parameter = btn.children[1].textContent.split(' ')[1];

        console.log(`parameter: ${parameter}`);

        // Determine path of button press
        let { subContent, mainContent } = this.parseContent(this.state.tabContent);

        // TODO: need to determine which panel is currently displayed and appropriately copy / remove / duplicate it or rows in it.
        if (parameter !== 'device' || this.state.tabName.match(/device/) === null ) {
            if (btnFunction === 'add') {
                let idx = this.duplicateOrAddRow(subContent[this.state.subActiveSlide].controls, btnFunction, subContent[this.state.subActiveSlide].indice);
            }
            if (btnFunction === 'copy') {
                let idx = this.duplicateOrAddRow(subContent[this.state.subActiveSlide].controls, btnFunction, subContent[this.state.subActiveSlide].indice);
            }
            if (btnFunction === 'remove') {
                let idx = this.removeRow(subContent[this.state.subActiveSlide].controls, btnFunction, subContent[this.state.subActiveSlide].indice);
            }
        } else if (parameter === 'device' && this.state.tabName.match(/device/) !== null) {
            if (btnFunction === 'add') {
                let idx = this.duplicateOrAddContent(subContent[this.state.subActiveSlide], btnFunction, subContent[this.state.subActiveSlide].indice);
                if (idx) {
                    idx = this.duplicateOrAddContent(mainContent[this.state.mainActiveSlide], btnFunction, mainContent[this.state.mainActiveSlide].indice);
                }
            }
            if (btnFunction === 'copy') {
                let idx = this.duplicateOrAddContent(subContent[this.state.subActiveSlide], btnFunction, subContent[this.state.subActiveSlide].indice);
                if (idx) {
                    idx = this.duplicateOrAddContent(mainContent[this.state.mainActiveSlide], btnFunction, mainContent[this.state.mainActiveSlide].indice);
                }
            }
            if (btnFunction === 'remove') {
                idx = this.removeContent(subContent[this.state.subActiveSlide], btnFunction, subContent[this.state.subActiveSlide].indice);
                if (idx) {
                    idx = this.duplicateOrAddContent(mainContent[this.state.mainActiveSlide], btnFunction, mainContent[this.state.mainActiveSlide].indice);
                }
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
                    className={`tab-pane ${activeTab ? 'is-active show fade-in' : 'fade-out'}`}  
                    id={`${tabName}`}
                >
                    
                <ConfigurationDisplayHeading key={`${content[0].defaultName}-heading`} handler={handler} heading={content[0].defaultName.toUpperCase()}/>
                <div className="container overflow">
                    <div className="container columns is-flex">
                        {mainContent.map((panel, contentIdx, arr) => {
                            return (
                                <div key={`${'main'}-${tabName}-${contentIdx}`} className="container column is-11 slide mainPanel-content is-inline" style={{"transform": `translateX(${this.state.mainActiveSlide * 100 * -1}%)`}}>
                                    {/* TODO: Max Slides should be dynamic should come from content length */}
                                    <RowContentContainer
                                        activeSlide={this.state.mainActiveSlide}
                                        buttonHandler={this.buttonHandler}
                                        setContentValues={this.setContentValues}
                                        panelContent={panel}
                                        tabName={tabName}
                                        contentIdx={contentIdx}
                                        onChange={this.setContentValues} 
                                        changeSlide={this.changeSlide}
                                        currentPane={activeTab}
                                        optionView={panel.controls[0].value}
                                        maxSlides={arr.length}
                                    />
                                </div>)


                        })}
                    </div>
                    <hr />
                    <div className="container columns is-flex">
                        {subContent.map((subPanel, subContentIdx, arr) => {
                            return (
                                <div key={`${'sub'}-${tabName}-${subContentIdx}`} className="container column is-11 slide mainPanel-content is-inline" style={{"transform": `translateX(${this.state.subActiveSlide * 100 * -1}%)`}}>
                                    <RowContentContainer
                                            activeSlide={this.state.subActiveSlide}
                                            setContentValues={this.setContentValues}
                                            panelContent={subPanel}
                                            tabName={tabName}
                                            contentIdx={subContentIdx}
                                            onChange={this.setContentValues} 
                                            changeSlide={this.changeSlide}
                                            currentPane={activeTab}
                                            optionView={'sub'}
                                            maxSlides={arr.length}
                                    />
                                </div>
                                );
                        })}
                    </div>
                </div>
            </div>

            ) : 
            display;

        } else {
            renderGrowl('growl', 'Problem retrieving or displaying tabContent variable. This is likely a bug.', 'danger', 'Unable to Load Page');
        }

        return display;
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