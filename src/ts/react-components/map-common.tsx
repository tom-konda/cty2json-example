import * as React from 'react';
import {FC} from 'react'
import styled from '@emotion/styled';

const MapWrapperBase:FC<{tileSize: number, className?: string}> = ({children, className}) => {
  return <div className={`l-map ${className}`}>
    {children}
  </div>
}

export const MapWrapper = styled(MapWrapperBase)`
  line-height: ${({tileSize}) => tileSize - 2}px;
  width: ${({tileSize}) => tileSize * 120}px;
  grid-template-columns: repeat(120, ${({tileSize}) => tileSize}px);
  grid-template-rows: repeat(100, ${({tileSize}) => tileSize}px);
`

const TileWrapperBase:FC<{className: string, tileSize: number, building: number}> = ({children, className, building, tileSize}) => {
  if (typeof (children as any).props.children === 'string') {
    return <span className={`map__tile ${className}`} data-tile={building}>
      {children}
    </span>
  }
  else {
    return <svg viewBox={`0 0 ${tileSize} ${tileSize}`} xmlns="http://www.w3.org/2000/svg" className={`map__tile ${className}`} data-tile={building}>{children}</svg>
  }
}

export const TileWrapper = styled(TileWrapperBase)`
  font-size: ${({tileSize}) => tileSize - 2}px;
  width:${({tileSize}) => tileSize}px;
  height:${({tileSize}) => tileSize}px;
  display:inline-block;
  box-sizing: border-box;
  text-align: center;
  vertical-align: center;
  overflow: hidden;
`
