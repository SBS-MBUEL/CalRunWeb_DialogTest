import React from 'react';
import { ConfigContainer } from './ConfigContainer';
import databaseMockContent, { databaseContent, databaseTabs } from './mocks/databaseMockContent';
import configMocks, { objectCollection } from './mocks/configMocks'

import Growl from './utils/growl-containter';



export default function App(props) {



    return (
        <div>
            <ConfigContainer 
                tabs={databaseTabs} 
                settings={databaseContent}
                configurations={objectCollection}
            />
            {/* <!-- This is required for the growl to display correctly --> */}
            <Growl />
        </div>
    )
}