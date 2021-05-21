// Production version of code needs this remarked out

// TODO: try traditional require?
// TODO: check if React module is loaded before importing?

import React from 'react';
import { setLocalStorage, getLocalStorage } from './utils/LocalStorage'
import { TabLinkContainer } from './components/TabLinkContainer';
import { TabPanels } from './components/TabPanels';

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

    setContent(key, value, content, tabName) {
        let changedContent = this.state.content;
        changedContent[`_${tabName}`] = content;

        this.setState({
            content: changedContent
        });

        let copiedSettings = this.state.settings.slice();
        index = this.state.settings.map((el, index) => el.ItemName === key ? index : undefined).filter((a, b) => a !== undefined)[0];
        copiedSettings[index].value = value;

        this.setState({
            settings: copiedSettings
        });

        setLocalStorage('SystemName-Settings', copiedSettings);
        setLocalStorage('SystemName-Config', changedContent);
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