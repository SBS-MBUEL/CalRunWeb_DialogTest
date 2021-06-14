import React from 'react';
import { ConfigurationSetup } from './ConfigurationSetup';
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
                        <div 
                            key={`${tab.ConfigurationArea}-panel`} 
                            role="tabpanel" 
                            className={`tab-pane ${i == activeTab ? 'fade in is-active show' : 'fade out'}`}  
                            id={`${tab.ConfigurationArea}`}
                        >
                            {/* {this.content = content}
                            {this.tab = tab.ConfigurationArea}
                            {this.filterOptions = 'calibrationOptions'}
                            {this.mainContent = this.getContent.apply(this)}
                            {this.filterOptions = 'calibrationParameter'}
                            {this.subContent = this.getContent.apply(this)} */}
                            <ConfigurationSetup 
                                index={i} 
                                content={content[`_${tab.ConfigurationArea}`]}
                                setContent={this.setContent}
                                tabName={tab.ConfigurationArea}
                                handler={clickRouter}
                            />
                        </div>
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
