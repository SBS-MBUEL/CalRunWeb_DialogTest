import React from 'react';
import { ConfigContainer } from './ConfigContainer';
import databaseMockContent, { databaseContent, databaseTabs } from './mocks/databaseMockContent';
import configMocks, { objectCollection } from './mocks/configMocks'
import getLocalStorage from './utils/LocalStorage';

import Growl from './utils/growl-containter';



export default function App(props) {
    return (  
        <div>
            <ConfigContainer 
                tabs={databaseTabs} 
                settings={props.mockLS ? databaseContent : getLocalStorage(getLocalStorage("SystemName") + "-Settings")}
                configurations={objectCollection}
            />
            {/* <!-- This is required for the growl to display correctly --> */}
            <Growl />
        </div>
    )
}