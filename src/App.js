import React from 'react';
import { ConfigContainer } from './ConfigContainer';
import { databaseContent, databaseTabs } from './mocks/databaseMockContent';
import { objectCollection } from './mocks/configMocks'
import { getLocalStorage, setLocalStorage } from './utils/LocalStorage';
import Growl from './utils/growl-containter';

export default function App(props) {
    var localSettings = getLocalStorage('SystemName-Settings');
    var localConfig = getLocalStorage('SystemName-Config');

    if (!localSettings) { // retrieve database immediately
        setLocalStorage('SystemName-Settings', databaseContent);
        localSettings = databaseContent;
    }

    if (!localConfig) { // retrieve configuration from database
        setLocalStorage('SystemName-Config', objectCollection);
        localConfig = objectCollection;
    }

    return (
        <div>
            <ConfigContainer 
                tabs={databaseTabs} 
                settings={localSettings}
                configurations={localConfig}
            />
            {/* <!-- This is required for the growl to display correctly --> */}
            <Growl />
        </div>
    )
}