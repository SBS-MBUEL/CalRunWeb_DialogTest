import React from 'react';
import { renderGrowl } from '../utils/growl'
import { RemoveItemFromArray } from '../utils/ArrayUtils';
import { ConfigurationDisplayHeading } from './ConfigurationDisplayHeading';
import { RowContentContainer } from './rowContentContainer';
import { ErrorPage } from './ErrorPage';
import { PanelNavigation } from './PanelNavigation';



class PanelContent extends React.Component {

    constructor(props) {
        super(props);
        
        let { mainContent, subContent } = this.parseContent(props.content);

        this.state = {
            tabName: props.tabName,
            tabContent: props.content,
            panelName: '',
            subPanelName: '',
            mainActiveSlide : 0,
            mainMaxSlides: mainContent && mainContent.length,
            subActiveSlide: 0,
            subMaxSlides: subContent && subContent.length
        };
        
        this.setContentValues = this.setContentValues.bind(this);
        this.buttonHandler = this.buttonHandler.bind(this);
        this.duplicateOrAddContent = this.duplicateOrAddContent.bind(this);
        this.duplicateSubPanel = this.duplicateSubPanel.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.removeContent = this.removeContent.bind(this);
        this.parseContent = this.parseContent.bind(this);
        this.filterContent = this.filterContent.bind(this);
        this.changeSlide = this.changeSlide.bind(this);
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.subSlideLeft = this.subSlideLeft.bind(this);
        this.subSlideRight = this.subSlideRight.bind(this);
        this.setPanelName = this.setPanelName.bind(this);
        this.updatePanelContent = this.updatePanelContent.bind(this);

        this.scrollTarget = React.createRef();
    }

    componentDidMount() {

        let { mainContent, subContent } = this.parseContent(this.state.tabContent);
        this.setPanelName(this.state.mainActiveSlide, mainContent, 'panelName');
        this.setPanelName(this.state.subActiveSlide, subContent, 'subPanelName');
    }

    componentDidUpdate() {
        if (this.scrollTarget.current)
            this.scrollTarget.current.scrollIntoView({block: "end", inline: "nearest", behavior: 'smooth'});
    }

    /**
     * set panel name
     * @param {number} activeSlide 
     */
    setPanelName(activeSlide, panel, panelName) {
        
        if (panel) {
            for(let i = 0; i < panel[activeSlide].controls.length; i++) {
                if (panel[activeSlide].controls[i].type !== 'button') {
                    this.setState({
                        [panelName] : panel[activeSlide].controls[i].value
                    });
                    break;
                }
            }
        } else {
            this.setState({
                panelName: undefined
            })
        }

    }

    /**
     * slides the sub panel to the right or left
     * position should use state for setting
    */
    changeSlide(newSlide) {

        if (this.state.tabName.match(/device/i)) {
            this.setState({mainActiveSlide : newSlide});
        } else {
            this.setState({mainActiveSlide : newSlide});
        }
        let { mainContent, subContent } = this.parseContent(this.state.tabContent);
        this.setPanelName(this.state.mainActiveSlide, mainContent, 'panelName');
        this.setPanelName(this.state.subActiveSlide, subContent, 'subPanelName');

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

        let activeSlide = (this.state && this.state.mainActiveSlide >= 0) ? this.state.mainActiveSlide : 0
        if (content && content.length > 0) {

            mainContent = this.filterContent(content, 'calibrationOption');

            subContent = this.filterContent(content, 'calibrationParameter');

        }

        return {
            mainContent, subContent
        }
    }

    /**
     * updates tabContent state with passed in panel object
     * @param {object} panel 
     */
    updatePanelContent(content, fn) {
        if (!content) {
            return null;
        }
        this.props.setContent(undefined, undefined, content, this.props.tabName, fn, 'panel');

        if (!content[content.length - 1].indice) {
            content.pop();
        }
        this.setState({
            tabContent : content
        });

    }

    /**
     * adds panel to CONTENT object
     * //TODO: this will likely need to be refactored to deal with more complex lists
     * @param {array} panel - controls list object
     * @param {string} fn - add / delete / copy
     * @param {number} masterIdx - Where in the content object to place the content
     * @returns 
    */
    duplicateOrAddContent(panel, fn, content, masterIdx = null) {

        // copy panel (main or sub)
        const copiedPanel = JSON.parse(JSON.stringify(panel));
        // copy content
        const existingContent = JSON.parse(JSON.stringify(content));

        if (fn === 'add') {
            copiedPanel.controls.map((el) => {
                if (el.type !== 'button') {
                    el.value = 'Not Set';
                }
            });
        }

        if (masterIdx) {
            copiedPanel.master = masterIdx;
        }

        let idx = existingContent.push(copiedPanel) - 1;
        copiedPanel.indice = idx;

        // this.setState({
        //     tabContent : existingContent
        // });
        // TODO: make passed object match other function - not sending correct object and causing propagation errors.
        // this.props.setContent(undefined, undefined, existingContent, this.props.tabName, fn, 'panel'); // TODO: change signature to pass "add" for fn

        return existingContent;
    }

    /**
     * adds row to selected subContent
     * //TODO: this will likely need to be refactored to deal with more complex lists
     * @param {array} subControls - controls list object
     * @param {string} fn - add / delete / copy
     * @param {number} subIdx - Where in the content object to place the content
     * @returns 
    */
    duplicateSubPanel(subControls, fn, subIdx) {
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
     * remove selected panel from  panelcontent object passed in
     * @param {object} panelContent 
     * @param {string} fn 
     * @param {number} indexToRemove 
     * @param {number} masterIndex
     * @param {boolean} force - forces the panel in indexToRemove to be removed
     * @returns 
    */
    removeContent(panelContent, fn, indexToRemove, masterIndex, force = false) {
        let indicesToRemove = panelContent[indexToRemove].controls.reduce((acc, _, index) => {
            acc.push(_.settingIndex);
            return acc;
        }, []).filter((a, b) => a !== undefined);

        let validRemoval = true;
        if (panelContent[indexToRemove].for === 'calibrationParameter') {
            validRemoval = this.parseContent(panelContent)
                .subContent.filter((a,b) => a.master === masterIndex)
                .length > 1;
        }
        
        if (validRemoval || force) {
            let newTabContent = RemoveItemFromArray(panelContent, indexToRemove).map((item, index) => {
                item.indice = index;
                return item;
            });
    
            // this.setState({
            //     tabContent : newTabContent
            // });
    
            let key = 'Not Set';
            let val = 'Not Set';
    
            newTabContent.push(indicesToRemove);
            return newTabContent;

        } else {
            renderGrowl('growl', 'unable to remove last element of settings object for this tab.', 'warning');
            return null;
        }

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

        let filteredControls = changedControls.filter((control, ind, array) => {
            if (control.type !== 'button') {
                return control;
            }
        });
        
        if (filteredControls.length > 1) {
            changedControls.pop();
        } else {
            renderGrowl('growl', 'There must be at least one option in the sub option list below.', 'warning');
            return;
        }
        
        let key = newTabContent[setIdx].controls[idx].label
        let val = newTabContent[setIdx].controls[idx].value
        newTabContent[setIdx].controls = changedControls;

        // this.setState({
        //     tabContent : newTabContent
        // });

        // this.props.setContent(key, val, newTabContent, this.props.tabName, fn);
    }

    /**
     * controller to duplicate or copy panel
     * @param {string} btnFunction 
     * @param {object} mainContent 
     * @param {object} subContent 
    */
    duplicatePanelContent(btnFunction, mainContent) {
        let currentLength = this.state.tabContent.length;
        let newContent = this.duplicateOrAddContent(mainContent[this.state.mainActiveSlide], btnFunction, this.state.tabContent);
        if (newContent) {
            let { subContent } = this.parseContent(newContent);

            let newMasterIndex = newContent.length - 1;
            
            if (btnFunction === 'copy') {
                subContent.filter((a, b) => a.master === mainContent[this.state.mainActiveSlide].indice).forEach((panel) => {
                    newContent = this.duplicateOrAddContent(panel, btnFunction, newContent, panel.indice);
                
                    newContent[newContent.length - 1].master = newMasterIndex;
                });
            } else {
                newContent = this.duplicateOrAddContent(subContent[0], btnFunction, newContent);
                
                newContent[newContent.length - 1].master = newMasterIndex;
            }
            
            this.updatePanelContent(newContent, btnFunction);

            this.setState({
                mainMaxSlides: this.state.mainMaxSlides + 1,
                mainActiveSlide: this.state.mainMaxSlides,
                subMaxSlides: this.state.subMaxSlides + 1,
                subActiveSlide: 0
            });

        }
    }
    /**
     * slides the sub panel to the right
     * position should use state for setting
    */
    subSlideLeft() {

        let newSlide = this.state.mainActiveSlide > 0 ? (this.state.mainActiveSlide - 1) : (this.state.mainMaxSlides - 1);
        
        this.changeSlide(newSlide);
        
    }
        
    /**
     * slides current pane to the left
    */
    subSlideRight() {

        let newSlide = this.state.mainActiveSlide < (this.state.mainMaxSlides - 1) ? (this.state.mainActiveSlide + 1) : 0;
        
        this.changeSlide(newSlide);

    }
    /**
     * slides the sub panel to the right
     * position should use state for setting
    */
    slideLeft() {

        let newSlide = this.state.mainActiveSlide > 0 ? (this.state.mainActiveSlide - 1) : (this.state.mainMaxSlides - 1);
        
        this.changeSlide(newSlide);
        
    }
        
    /**
     * slides current pane to the left
    */
    slideRight() {

        let newSlide = this.state.mainActiveSlide < (this.state.mainMaxSlides - 1) ? (this.state.mainActiveSlide + 1) : 0;
        
        this.changeSlide(newSlide);

    }

    /**
     * appropriately process button clicked to add / copy or remove sub panel or whole panel
     * @param {dom} btn pressed in ButtonItem
     * @param {number} settingIdx
     */
    buttonHandler(btn, slideIdx) {
        const btnFunction = btn.children[1].textContent.split(' ')[0];

        const parameter = btn.children[1].textContent.split(' ')[1];

        // Determine path of button press
        let { subContent, mainContent } = this.parseContent(this.state.tabContent);

        // TODO: need to determine which panel is currently displayed and appropriately copy / remove / duplicate it or rows in it.
        if ((parameter === 'device' || parameter === 'reference' || parameter === 'setpoint')) { // Need a better way to discern this
            if (btnFunction === 'add' || btnFunction === 'copy') {
                this.duplicatePanelContent(btnFunction, mainContent);
            } else if (btnFunction === 'remove') {
                if (mainContent.length === 1) {
                    renderGrowl('growl', `Unable to remove the last ${this.state.panelName}.`, 'warning');
                    return;
                }
                // start of removal function
                let newContent = this.removeContent(this.state.tabContent.slice(), btnFunction, mainContent[this.state.mainContent].indice, mainContent[this.state.mainActiveSlide].indice, true);
                let newMasterIndex = newContent.length - 1;
                
                if (newContent) {
                    let { subContent } = this.parseContent(newContent);
                    
                    subContent.filter((a, b) => a.master === mainContent[this.state.mainActiveSlide].indice).forEach( (panel) => {
                        newContent = this.removeContent(newContent, btnFunction, panel.indice, mainContent[this.state.mainActiveSlide].indice ,true);
                    
                        newContent[newContent.length - 1].master = newMasterIndex;
                    });
                    
                    if (newContent) {
                        this.updatePanelContent(newContent, btnFunction);
    
                        this.setState({
                            mainMaxSlides: this.state.mainMaxSlides - 1,
                            mainActiveSlide: 0,
                        });
    
                        this.setPanelName(0);

                    }
                }
            }
        } else {
            if (btnFunction === 'add' || btnFunction === 'copy') {
                let newContent = this.duplicateOrAddContent(subContent[slideIdx], btnFunction, this.state.tabContent, mainContent[this.state.mainActiveSlide].indice);

                newContent && this.updatePanelContent(newContent, btnFunction);
            } else if (btnFunction === 'remove') {

                let newContent = this.removeContent(this.state.tabContent.slice(), btnFunction, subContent[slideIdx].indice, mainContent[this.state.mainActiveSlide].indice);
                this.updatePanelContent(newContent, btnFunction);
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
        let { subContent, mainContent } = this.parseContent(this.state.tabContent);

        changedContent[settingIdx].controls[controlIdx].value = val;
        this.setPanelName(this.state.mainActiveSlide, mainContent, 'panelName');
        this.setPanelName(this.state.subActiveSlide, subContent, 'subPanelName');
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
                    
                <ConfigurationDisplayHeading key={`${content[0].defaultName}-heading`} handler={handler} heading={mainContent[0].defaultName.toUpperCase()} />
                <PanelNavigation 
                            panel={mainContent[0].defaultName.toUpperCase()} 
                            optionView={this.state.panelName}
                            currentPane={this.state.mainActiveSlide}
                            leftArrow={this.slideLeft}
                            rightArrow={this.slideRight}
                            length={mainContent.length}
                        />
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
                                    <hr />
                                    
                                    {subContent.filter((a, b) => a.master === panel.indice).map((subPanel, subContentIdx, arr) => {
                                    // if (subPanel.master === contentIdx) {
                                        return (
                                            <div key={`${'sub'}-${tabName}-${subContentIdx}`} className="container column is-11 slide mainPanel-content is-inline" style={{"transform": `translateY(${this.state.subActiveSlide * 100 * -1}%)`}}>
                                                <PanelNavigation 
                                                    panel={subPanel.defaultName.toUpperCase()} 
                                                    optionView={this.state.subPanelName}
                                                    currentPane={this.state.subActiveSlide}
                                                    leftArrow={this.subSlideLeft}
                                                    rightArrow={this.subSlideRight}
                                                    length={subContent.length}
                                                />
                                                <RowContentContainer
                                                    activeSlide={subContentIdx}
                                                    buttonHandler={this.buttonHandler}
                                                    setContentValues={this.setContentValues}
                                                    panelContent={subPanel}
                                                    tabName={tabName}
                                                    contentIdx={subContentIdx}
                                                    onChange={this.setContentValues} 
                                                    changeSlide={this.changeSlide}
                                                    currentPane={activeTab}
                                                    optionView={'sub'}
                                                    maxSlides={this.state.mainMaxSlides}
                                                />
                                            </div>
                                        );
                                    // }
                                    })}
                                </div>)


                        })}
                    </div>
                    <div ref={this.scrollTarget}/>

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