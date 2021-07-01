import React from 'react';
import { renderGrowl } from '../utils/growl'
import { RemoveItemFromArray } from '../utils/ArrayUtils';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { RowContentContainer } from './rowContentContainer';
import { ErrorPage } from './ErrorPage';


class PanelContent extends React.Component {

    constructor(props) {
        super(props);

        let { mainContent, subContent } = this.parseContent(props.content);

        this.state = {
            tabName: props.tabName,
            tabContent: props.content,
            mainActiveSlide : 0,
            mainMaxSlides: mainContent && mainContent.length,
            subActiveSlide: 0,
            subMaxSlides: subContent && subContent.length
        };

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

            mainContent = this.filterContent(content, 'calibrationOption');

            subContent = this.filterContent(content, 'calibrationParameter');

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
                if (el.type !== 'button') {
                    el.value = 'Not Set';
                }
            })
        }

        let idx = existingContent.push(copiedPanel) - 1;
        copiedPanel.indice = idx;
        this.setState({
            tabContent : existingContent
        });
        // TODO: make passed object match other function - not sending correct object and causing propagation errors.
        this.props.setContent(undefined, undefined, existingContent, this.props.tabName, fn, 'panel'); // TODO: change signature to pass "add" for fn

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

        this.setState({
            tabContent : newTabContent
        });

        this.props.setContent(key, val, newTabContent, this.props.tabName, fn); // TODO: change signature to pass "add" for fn

        return newTabContent;
    }

    /**
     * remove panel content
     * @param {*} content 
     * @param {*} fn 
     * @param {*} subIdx 
     * @returns 
     */
    removeContent(panelContent, fn, subIdx) {
        let indicesToRemove = panelContent[subIdx].controls.reduce((acc, _, index) => {
            acc.push(_.settingIndex);
            return acc;
        }, []);
        
        let newTabContent = RemoveItemFromArray(panelContent, subIdx).map((item, index) => {
            item.indice = index;
            return item;
        });

        this.setState({
            tabContent : newTabContent
        });


        let key = 'Not Set';
        let val = 'Not Set';

        newTabContent.push(indicesToRemove);

        newTabContent = this.props.setContent(key, val, newTabContent, this.props.tabName, fn, 'panel');

        return newTabContent;
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

        this.setState({
            tabContent : newTabContent
        });

        this.props.setContent(key, val, newTabContent, this.props.tabName, fn);
    }

    /**
     * controller to duplicate or copy panel
     * @param {string} btnFunction 
     * @param {object} mainContent 
     * @param {object} subContent 
     */
    duplicatePanelContent(btnFunction, mainContent, subContent) {
        let currentLength = this.state.tabContent.length;
        let idx = this.duplicateOrAddContent(subContent[this.state.subActiveSlide], btnFunction, subContent[this.state.subActiveSlide].indice);
        if (idx) {
            let timeout = null;
            let interval = setInterval(() => {
                if (currentLength === this.state.tabContent.length) {
                    return;
                } else {
                    clearTimeout(timeout);
                    timeout = null;
                    clearInterval(interval);
                    interval = null;
                    idx = this.duplicateOrAddContent(mainContent[this.state.mainActiveSlide], btnFunction, mainContent[this.state.mainActiveSlide].indice);

                    this.setState({
                        mainMaxSlides: this.state.mainMaxSlides + 1,
                        subMaxSlides: this.state.subMaxSlides + 1,
                        mainActiveSlide: this.state.mainMaxSlides,
                        subActiveSlide: this.state.subMaxSlides
                    });
                }
            }, 15);

            timeout = setTimeout(() => {
                clearInterval(interval);
                interval = null;
                console.error('unable to add content');
            }, 2000);
        }
    }

    /**
     * appropriately process button clicked to add / copy or remove sub panel or whole panel
     * @param {dom} btn pressed in ButtonItem
     * @param {number} settingIdx
     */
    buttonHandler(btn, settingIdx) {
        const btnFunction = btn.children[1].textContent.split(' ')[0];

        const parameter = btn.children[1].textContent.split(' ')[1];

        console.log(`parameter: ${parameter}`);

        // Determine path of button press
        let { subContent, mainContent } = this.parseContent(this.state.tabContent);

        // TODO: need to determine which panel is currently displayed and appropriately copy / remove / duplicate it or rows in it.
        if (parameter !== 'device' || this.state.tabName.match(/device/) === null ) {
            if (btnFunction === 'add' || btnFunction === 'copy') {
                let idx = this.duplicateOrAddRow(subContent[this.state.subActiveSlide].controls, btnFunction, subContent[this.state.subActiveSlide].indice);
            } else if (btnFunction === 'remove') {
                let idx = this.removeRow(subContent[this.state.subActiveSlide].controls, btnFunction, subContent[this.state.subActiveSlide].indice);
            }
        } else if (parameter === 'device' && this.state.tabName.match(/device/) !== null) {
            if (btnFunction === 'add' || btnFunction === 'copy') {
                this.duplicatePanelContent(btnFunction, mainContent, subContent);
            } else if (btnFunction === 'remove') {
                let cntnt = this.removeContent(this.state.tabContent.slice(), btnFunction, subContent[this.state.subActiveSlide].indice);
                if (cntnt) {
                    let { mainContent } = this.parseContent(cntnt);
                    cntnt = this.removeContent(cntnt, btnFunction, mainContent[this.state.mainActiveSlide].indice);

                    this.setState({
                        mainMaxSlides: this.state.mainMaxSlides - 1,
                        subMaxSlides: this.state.subMaxSlides - 1,
                        mainActiveSlide: 0,
                        subActiveSlide: 0
                    });
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
                                        maxSlides={this.state.mainMaxSlides}
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
                                        maxSlides={this.state.subMaxSlides}
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