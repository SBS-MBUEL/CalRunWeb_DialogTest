import React from 'react';
import { ConfigContainer } from './ConfigContainer';
import { databaseContent, databaseTabs } from './mocks/databaseMockContent';
import { objectCollection } from './mocks/configMocks'
import { getLocalStorage, setLocalStorage } from './utils/LocalStorage';

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
        <ConfigContainer 
            tabs={databaseTabs} 
            settings={localSettings}
            configurations={localConfig}
        />
    )
}