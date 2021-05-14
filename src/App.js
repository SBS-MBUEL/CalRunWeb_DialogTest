import React from 'react';
import configContent from './ConfigContainer';
import { databaseContent, databaseTabs } from './mocks/databaseMockContent';

export default function App(props) {
    return (
        <ConfigContainer 
        tabs={databaseTabs} 
        settings={databaseContent}/>
    )
}