// Production version of code needs this remarked out

// TODO: check if React module is loaded before importing?
// TODO: can I use LoDash for some of these functions?

import React from 'react';
import { setLocalStorage, getLocalStorage } from './utils/LocalStorage'
import { TabLinkContainer } from './components/TabLinkContainer';
import { TabPanels } from './components/TabPanels';
import { RemoveItemFromArray } from './utils/ArrayUtils';

/**
 * ConfigContainer is the main launching point to construct the tabbed configuration screen
 */
class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);
        // TODO: state variable needs to contain settings object to be manipulated when an option is changed.
        if(props.tabs && props.tabs.length > 0) {
            this.state = {
                tabs : props.tabs
                .filter(el => el != undefined),
                content : props.configurations,
                settings: props.settings,
                activeTab: 0
            };
        } else {
            console.error('no config tabs defined');
            this.state = {
                tabs : [],
                settings: props.settings
            };
        }
        
        this.changeHandler = this.changeHandler.bind(this);
        this.insertRow = this.insertRow.bind(this);
        this.copyRow = this.copyRow.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.clickRouter = this.clickRouter.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);
        this.setContent = this.setContent.bind(this);
    }

    /**
     * renders mini pop up option list - on change change calling div
     * @param {DOM} domElement Where the pop up dialog will appear
     * @param {string} id the DOM element to manipulate after selection is made
     * @returns 
    */
    popUpSelection(domElement, id) {
        console.log($(domElement).parent());
        // TODO: Implement listener
        // TODO: Propagate selection back to state of React object 
        // TODO: Make inserted pop up customizable

    }

    /**
     * deals with changes to UI to make sure they are saved to the state
     * //TODO: need to implement code here to deal with changes to selected item
     * @param {Event} e 
    */
    changeHandler(e) {
        console.log('changeHandler');
        console.log(e.currentTarget.textContent);

    }

    /**
     * setContent takes the changes from the tabs, updates the real-time objects and saves them to local-storage
     * @param {string} key 
     * @param {string} value 
     * @param {object} content 
     * @param {string} tabName 
     * @param {string} fn - default is update mode / options "update", "delete", "add" (copy is dealt with as an add)
     * @param {string} mode - default is update single / options "single" (copy / add single element), "panel" (copy or add entire grouping)
     * // TODO: try /catch
     * 
     * // TODO: refactor to be more atomic
     */
    setContent(key, value, panelContent, tabName, fn='update', mode='single') {
        let changedContent = JSON.parse(JSON.stringify(this.state.content));
        
        const last_position = changedContent[`_${tabName}`].length - 1;
        
        
        let copiedSettings = JSON.parse(JSON.stringify(this.state.settings.slice()));
        let successfulUpdate = false;
        
        if (fn === 'update') {
            let index = copiedSettings.map((el, index) => el.ItemName === key && el.ConfigurationArea === tabName.toLowerCase() ? index : undefined).filter((a, b) => a !== undefined)[0];
            
            if (index) {
                copiedSettings[index].value = value; // TODO: this needs error checking so it's not trying to set something that doesn't exist
                successfulUpdate = true;
            } else {
                console.error(`Error trying to set value:`);
                // console.log(`key:`);
                // console.log(key);
                // console.log(`value:`);
                // console.log(value);
                // console.log(`content:`);
                // console.log(changedContent);
                // console.log(`settings:`);
                // console.log(copiedSettings);
                // console.log(`tabName:`);
                // console.log(tabName);
                // console.log(`fn:`);
                // console.log(fn);
                // console.log(`index:`);
                // console.log(index);
            }
        }
        
        if (fn === 'add' || fn === 'copy') {
            let index = copiedSettings.map((el, index) => el.ConfigurationArea === tabName.toLowerCase() ? index : undefined).filter((a, b) => a !== undefined)[0];
            
            const control_list_length = changedContent[`_${tabName}`][last_position].controls.length - 1;
            // Copy object
            let copiedObject = JSON.parse(JSON.stringify(copiedSettings[index]));
            
            if (mode === 'single') {
                // update individual field
                // Change copied object
                copiedObject.ItemName = key;
                copiedObject.value = value;
                
                // Add copied object to copiedSettings
                let settingIndex = copiedSettings.push(copiedObject);
                changedContent[`_${tabName}`][last_position].controls[control_list_length].settingIndex = settingIndex;
            } else if (mode === 'panel') {

                // Change grouped object
                changedContent[`_${tabName}`][last_position].controls.map((el) => {
                    let field = JSON.parse(JSON.stringify(copiedObject));
                    field.ItemName = el.label;
                    field.value = el.value;
                    el.settingIndex = copiedSettings.push(field) - 1;
                });
            }
            
            successfulUpdate = true;
        }
        
        // This is for removing a single item from the array
        if (fn === 'remove') {
            if (mode === 'single') {
                let index = copiedSettings.map((el, index) => el.ItemName === key && el.ConfigurationArea === tabName.toLowerCase() ? index : undefined).filter((a, b) => a !== undefined)[0];
                copiedSettings = RemoveItemFromArray(copiedSettings, index);
                successfulUpdate = true;
            } else if (mode === 'panel') {
                // Change grouped object
                panelContent[last_position].map((el) => {
                    copiedSettings = RemoveItemFromArray(copiedSettings, el);
                });
                panelContent.pop();
            }
        }
        changedContent[`_${tabName}`] = JSON.parse(JSON.stringify(panelContent));
        
        if (successfulUpdate) {
            this.setState({
                settings: copiedSettings
            });

            this.setState({
                content: changedContent
            });

            // TODO: need "SystemName" to be dynamic
            setLocalStorage('SystemName-Settings', copiedSettings);
            setLocalStorage('SystemName-Config', changedContent);
            
        }

        return panelContent;

    }



    /**
        * copy current config row to a new row
        * //TODO: code needs implemented
        * @param {Event} e 
    */
    copyRow(e) {
        console.log('copy Row');
        console.log(e.currentTarget);
    }

    /**
        * update row of current config row to database and local configs
        * //TODO: code needs implemented
        * @param {Event} e 
    */
    updateRow(e) {
        console.log('update Row');
        console.log(e.currentTarget);
    }

    /**
     * insert new config row to table
     * //TODO: code needs implemented
     * @param {Event} e 
    */
    removeRow(e) {
        console.log('remove row');
        console.log(e.currentTarget);
    }

    /**
     * insert new config row to table
     * //TODO: code needs implemented
     * @param {Event} e 
    */
    insertRow(e) {
        console.log('insert Row');
        console.log(e.currentTarget);
    }

    changeActiveTab(e) {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.setState({activeTab:tab});
    }

    //TODO: remove unused functions
    clickRouter(e) {
        console.log('modify row - add / remove / update / copy');
        console.log(e);

        // TODO: need to change this from JQUERY 
        // if ($(e.currentTarget)[0].className.includes('popup-link')) {
        //     this.changeHandler(e);
        // }
        // else if ($(e.currentTarget)[0].className.includes('success')) {
        //     this.insertRow(e);
        // }
        // else if ($(e.currentTarget)[0].className.includes('danger')) {
        //     this.removeRow(e);
        // }
        // else if ($(e.currentTarget)[0].className.includes('info')) {
        //     this.updateRow(e);
        // }
        // else if ($(e.currentTarget)[0].className.includes('warning')) {
        //     this.copyRow(e);
        // }
        // else if ($(e.currentTarget)[0].className.includes('primary')) {
        //     this.changeHandler(e);
        // }
    }

    render() {
        const { tabs, content, activeTab } = this.state;
        // TODO: make "pages"
        // TODO: columns wrapper for all of config content?
        return (
            <div className="columns">
                <div className="column">
                    <TabLinkContainer tabs={tabs} changeActiveTab={this.changeActiveTab} activeTab={activeTab} />
                    <TabPanels tabs={tabs} content={content} setContent={this.setContent} activeTab={activeTab} clickRouter={this.clickRouter} />
                </div>
            </div>
        );
    }

}


/**
 * Renders configuration from React classes declared above.
 * tabNames is a global located in tabConfig.js (edit ./dev version)
 * tabContent is a global located in tabContent.js (edit in ./dev version)
 * 
 * //TODO: load settings from LocalStorage (after they are saved) and then run background task to retrieve from database.
 * after creating tab config, it creates an event listener to listen to appropriate tab click and active/deactivate tabs.
 * 
 * //TODO: listen to config page closure to save settings to local storage and when avaialable the database.
 * // TODO: need other params listed here
 * // TODO can tab control be moved inside of react object?
 * @param {DOM} root element to render content to
 */
function renderConfig(root, tabNames, configuration, panelSettings) {

    ReactDOM.render(
    <ConfigContainer 
        tabs={tabNames} 
        settings={configuration}
        configurations={panelSettings} />,
    document.getElementById(root)
    );
    
}


/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = 
     {
         ConfigContainer: ConfigContainer

     };
 }