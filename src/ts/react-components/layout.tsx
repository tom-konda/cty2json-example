import * as React from 'react';
import {FC, useState, useEffect} from 'react'
import {analyze} from '@tom-konda/cty2json';
import { TabLayout } from './tab';

export const Layout:FC<{ctyjson ?: number}> = () => {
  const initValue = getInitValue();
  console.log(initValue);
  const [ctyjson, setCtyJSON] = useState(initValue);
  useEffect(
    () => {
      setCtyJSON(initValue);
    },
    [initValue]
  )
  console.log(
    [ctyjson, setCtyJSON]
  )
  return <section>
    <input type="file" onChange={(event) => changeEventMethod(event, setCtyJSON)} />
    {ctyjson ? <TabLayout ctyjson={ctyjson} /> : ''}
  </section>
}

const getInitValue = () => {
  const [cty2json, setCtyJSON] = useState(undefined) as [undefined|cty2JSONDataFormat, React.Dispatch<React.SetStateAction<undefined|cty2JSONDataFormat>>];

  useEffect(
    () => {
      const setInitState = async() => {
        const request = await fetch('./fixtures/cty2jsonTest.cty');
        const ctyData = await request.arrayBuffer();
        if(ctyData) {
          setCtyJSON(analyze(ctyData));
        }
      }
      setInitState();
    },
    []
  );
  return cty2json;
}

const changeEventMethod = async(event: React.ChangeEvent<HTMLInputElement>, setCtyJSON: React.Dispatch<React.SetStateAction<undefined|cty2JSONDataFormat>>) => {
  const {files} = event.target;
  if (files && files.length) {
    const file = files.item(0) as File;
    const result = await fileHandlar(file);
    if (result) {
      setCtyJSON(analyze(result));
    }
  }
  return ;
}

const fileHandlar = (file: File) => {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result as ArrayBuffer)
        }
      )
      reader.addEventListener(
        'error',
        (event) => {
          reject(event);
        }
      )
      reader.readAsArrayBuffer(file);
    }
  ) as Promise<ArrayBuffer>
}