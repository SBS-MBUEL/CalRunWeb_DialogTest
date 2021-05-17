
import React from 'react';
import {TabListItem} from './TabListItem';
class TabLinkContainer extends React.Component{
    render() {
        const { tabs, changeActiveTab, activeTab } = this.props;

        return (
            <div className="columns">
                <div className="column">
                    <ul className="panel-tabs" role="tablist">
                        {
                            tabs.length > 0 ? 
                                tabs.map((tab, i) => {
                                    return <TabListItem key={i + tab} changeTab={changeActiveTab} activeTab={activeTab} index={i} tab={tab} />
                                }) : 
                                    <p>no tabs to select</p>
                        }
                    </ul>
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
         TabLinkContainer: TabLinkContainer

     };
 }