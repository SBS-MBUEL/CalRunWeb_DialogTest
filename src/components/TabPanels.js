import React from 'react';
import {ConfigurationSetup} from './ConfigurationSetup';
import createGUID from '../utils/createGUID';
import {ErrorPage} from './ErrorPage';

class TabPanels extends React.Component {
    constructor(props) {
        super(props);

        this.getContent = this.getContent.bind(this);
        this.setContent = this.setContent.bind(this);
    }

    setContent(content) {
        this.props.setContent(content);
    }

    getContent() {
        console.log(this.content, this.currentTab, this.filterOptions);
        return this.content[`_${this.tab}`].reduce((acc, cur) => cur.for === this.filterOptions ? acc.push(cur) : acc).controls;
    }


    render() {
        const { tabs, content, clickRouter, activeTab } = this.props;
        // let content = undefined;
        // const mainContent = 
        // const subContent = content[`_${tab.ConfigurationArea}`].reduce((acc, cur) => cur.for === 'calibrationParameter' ? acc.push(cur) : acc).controls;
        return (
            <div className="columns ">
                <div className="column">
                    <div className="panel-content">
                    { /* TODO: this is where we will map the data */ }
                    { tabs && tabs.length && tabs.length > 0 ? 
                            tabs.map((tab, i) => {
                                return (
                                    <div 
                                        key={createGUID()} 
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
                                        {content ? 
                                            <ConfigurationSetup 
                                                index={i} 
                                                content={content[`_${tab.ConfigurationArea}`]}
                                                setContent={this.setContent}
                                                tabName={tab.ConfigurationArea}
                                                // mainContent={content[`_${tab.ConfigurationArea}`].reduce((sum, cur) => cur.for === 'calibrationOptions' ? sum.push(cur) : sum, []).controls}
                                                // subContent={content[`_${tab.ConfigurationArea}`].reduce((sum, cur) => cur.for === 'calibrationParameter' ? sum.push(cur) : sum, []).controls}
                                                handler={clickRouter}
                                            />
                                        :
                                            <ErrorPage variableName="content" pageName="CalRun Configuration Page" />
                                        }
                                    </div>
                                );
                            }) 
                        : 
                            <ErrorPage variableName="tabs" pageName="CalRun Configuration Page" />
                    }
                            
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
