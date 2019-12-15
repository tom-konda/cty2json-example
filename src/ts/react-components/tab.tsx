import * as React from 'react';
import {FC} from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { DetailedMap } from './detailed-map';

export const TabLayout:FC<{ctyjson:cty2JSONDataFormat}> = ({ctyjson}) => {
  console.log(ctyjson)
  const {tileData} = ctyjson;
  return <Tabs>
    <TabList>
      <Tab>マップ詳細</Tab>
    </TabList>
    <TabPanel>
      <DetailedMap tileData={tileData} />
    </TabPanel>
  </Tabs>
}
