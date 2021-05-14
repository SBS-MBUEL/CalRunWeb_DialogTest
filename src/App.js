import React from 'react';
import { ConfigContainer } from './ConfigContainer';
import { databaseContent, databaseTabs } from './mocks/databaseMockContent';
import {objectCollection} from './mocks/configMocks'

export default function App(props) {
    return (
        <ConfigContainer 
            tabs={databaseTabs} 
            settings={databaseContent}
            configurations={objectCollection}
        />
    )
}