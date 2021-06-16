/*
    TabPanels is the container for the inner tab content
    created: Morris Buel
    Owner: Sea-Bird Scientific
    License: proprietary
*/
import React from 'react';
import { PanelContent } from './PanelContent';
import createGUID from '../utils/createGUID';
import { ErrorPage } from './ErrorPage';
import { renderGrowl } from '../utils/growl'

class TabPanels extends React.Component {
    constructor(props) {
        super(props);

        this.getContent = this.getContent.bind(this);
        this.setContent = this.setContent.bind(this);
    }

    setContent(key, val, content, tabName, fn) {
        this.props.setContent(key, val, content, tabName, fn);
    }

    getContent() {
        return this.content[`_${this.tab}`].reduce((acc, cur) => cur.for === this.filterOptions ? acc.push(cur) : acc).controls;
    }


    render() {
        const { tabs, content, clickRouter, activeTab } = this.props;
        let main = <ErrorPage variableName="tabs" pageName="CalRun Configuration Page" />;;

        if (tabs && tabs.length && tabs.length > 0) {
            if (content) {
                main = tabs.map((tab, i) => {
                    return (
                        <PanelContent 
                            index={i} 
                            content={content[`_${tab.ConfigurationArea}`]}
                            setContent={this.setContent}
                            tabName={tab.ConfigurationArea}
                            handler={clickRouter}
                            activeTab={i == activeTab}
                        />
                    );
                });
            } else {
                renderGrowl('growl', 'Cannot display ConfigurationSetup - content variable is not processing correctly. Please file a bug.', 'danger', 'Program Error');
            }
        } else {
            renderGrowl('growl', 'Cannot display ConfigurationSetup - tabs variable is not processing correctly. Please file a bug.', 'danger', 'Program Error')
        }

        return (
            <div className="columns ">
                <div className="column">
                    <div className="panel-content">
                        { main }
                    </div>
                </div>
            </div>
        )
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
         TabPanels: TabPanels

     };
 }
