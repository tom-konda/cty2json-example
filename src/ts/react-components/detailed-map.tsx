import * as React from 'react';
import {FC, Fragment} from 'react'
import { MapWrapper, TileWrapper } from './map-common';

const getClassNamesFromBuildingId = (id: number) => {
  const classNames = [];
  if (id === 0) {
    classNames.push('tile__land');
  }
  if(id === 52) {
    classNames.push('tile__radioactive');
  }
  if(id >= 64 && id <= 76 ||
     id >= 80 && id <= 94 ||
     id >= 96 && id <= 207 ||
      id >= 828 && id <= 831 || id >= 948 && id <= 951) {
    classNames.push('tile__road-line', 'tile__road');
  }
  if(id >= 226 && id <= 236) {
    classNames.push('tile__rail-line', 'tile__land');
  }
  if(id >= 208 && id <= 220) {
    classNames.push('tile__power-line');
    if ([208, 209].includes(id) === false) {
      classNames.push('tile__land');
    }
  }
  if([208, 209, 224, 225].includes(id)) {
    classNames.push('tile__under-water');
  }
  if([2, 3, 4, 79, 95, 208, 209, 224, 225].includes(id)) {
    classNames.push('tile__water');
  }
  if([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(id)) {
    classNames.push('tile__water', 'tile__water--shallow');
  }
  if(id >= 21 && id <= 36) {
    classNames.push('tile__tree-shallow');
  }
  if(id === 37) {
    classNames.push('tile__tree-deep');
  }
  if(id >= 40 && id <= 43) {
    classNames.push('tile__park');
  }
  if(id >= 44 && id <= 47) {
    classNames.push('tile__rubble');
  }
  if(id === 77) {
    classNames.push('tile__vertical-power-horizontal-road', 'tile__road');
  }
  if(id === 78) {
    classNames.push('tile__vertical-road-horizontal-power', 'tile__road');
  }
  if(id === 221) {
    classNames.push('tile__vertical-power-horizontal-rail', 'tile__land');
  }
  if(id === 222) {
    classNames.push('tile__vertical-rail-horizontal-power', 'tile__land');
  }
  if(id === 237) {
    classNames.push('tile__vertical-road-horizontal-rail', 'tile__road');
  }
  if(id === 238) {
    classNames.push('tile__vertical-rail-horizontal-road', 'tile__road');
  }
  if([240, 241, 242].includes(id)) {
    classNames.push('tile__residential-edge-n');
  }
  if([240, 243, 246].includes(id)) {
    classNames.push('tile__residential-edge-w');
  }
  if([242, 245, 248].includes(id)) {
    classNames.push('tile__residential-edge-e');
  }
  if([246, 247, 248].includes(id)) {
    classNames.push('tile__residential-edge-s');
  }
  if([423, 424, 425].includes(id)) {
    classNames.push('tile__commercial-edge-n');
  }
  if([423, 426, 429].includes(id)) {
    classNames.push('tile__commercial-edge-w');
  }
  if([425, 428, 431].includes(id)) {
    classNames.push('tile__commercial-edge-e');
  }
  if([429, 430, 431].includes(id)) {
    classNames.push('tile__commercial-edge-s');
  }
  if([612, 613, 614].includes(id)) {
    classNames.push('tile__industrial-edge-n');
  }
  if([612, 615, 618].includes(id)) {
    classNames.push('tile__industrial-edge-w');
  }
  if([614, 617, 620].includes(id)) {
    classNames.push('tile__industrial-edge-e');
  }
  if([618, 619, 620].includes(id)) {
    classNames.push('tile__industrial-edge-s');
  }
  if((id >= 240 && id <= 248) || (id >= 423 && id <= 431) || (id >= 612 && id <= 620)) {
    classNames.push('tile__land');
  }
  if(id === 244 || id >= 261 && id <= 408) {
    classNames.push('tile__residential');
  }
  else if(id === 427 || id >= 432 && id <= 611) {
    classNames.push('tile__commercial');
  }
  else if(id === 616 || id >= 621 && id <= 692 || id >= 852 && id <= 859 || id >= 884 && id <= 915) {
    classNames.push('tile__industrial');
  }
  else if(id >= 761 && id <= 769) {
    classNames.push('tile__fd');
  }
  else if(id >= 770 && id <= 778) {
    classNames.push('tile__pd');
  }

  return classNames;
}

const getTileContentFromBuildingId = (id:number) => {
  let content: string | JSX.Element;
  if(id === 0) {
    content = '';
  }
  else if(id >= 2 && id <= 20 || [79, 95].includes(id)) {
    content = '';
  }
  else if([64, 66, 80, 82, 93, 209, 210, 224, 226].includes(id) || (id >= 96 && id <= 207 && [0, 2, 13].indexOf(id % 16) !== -1)) {
    // content = '━';
    content = <line className="full-width" x1="0" y1="50%" x2="100%" y2="50%" />
  }
  else if([65, 67, 81, 83, 94, 208, 211, 225, 227].includes(id) || (id >= 96 && id <= 207 && [1, 3, 14].indexOf(id % 16) !== -1)) {
    // content = '┃';
    content = <line className="full-width" x1="50%" y1="0" x2="50%" y2="100%" />
  }
  else if([68, 84, 212, 228].includes(id) || (id >= 96 && id <= 207 && id % 16 === 4)) {
    // content = '┗';
    content = <Fragment>
      <line className="half-width" x1="50%" y1="50%" x2="100%" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="0" />
    </Fragment>
  }
  else if([69, 85, 213, 229].includes(id) || (id >= 96 && id <= 207 && id % 16 === 5)) {
    // content = '┏';
    content = <Fragment>
      <line className="half-width" x1="50%" y1="50%" x2="100%" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="100%" />
    </Fragment>
  }
  else if([70, 86, 214, 230].includes(id) || (id >= 96 && id <= 207 && id % 16 === 6)) {
    // content = '┓';
    content = <Fragment>
      <line className="half-width" x1="50%" y1="50%" x2="0" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="100%" />
    </Fragment>
  }
  else if([71, 87, 215, 231].includes(id) || (id >= 96 && id <= 207 && id % 16 === 7)) {
    // content = '┛';
    content = <Fragment>
      <line className="half-width" x1="50%" y1="50%" x2="0" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="0" />
    </Fragment>
  }
  else if([72, 88, 216, 232].includes(id) || (id >= 96 && id <= 207 && id % 16 === 8)) {
    // content = '┻';
    content = <Fragment>
      <line className="full-width" x1="0" y1="50%" x2="100%" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="0" />
    </Fragment>
  }
  else if([73, 89, 217, 233].includes(id) || (id >= 96 && id <= 207 && id % 16 === 9)) {
    // content = '┣';
    content = <Fragment>
      <line className="full-width" x1="50%" y1="0" x2="50%" y2="100%" />
      <line className="half-width" x1="50%" y1="50%" x2="100%" y2="50%" />
    </Fragment>
  }
  else if([74, 90, 218, 234].includes(id) || (id >= 96 && id <= 207 && id % 16 === 10)) {
    // content = '┳';
    content = <Fragment>
      <line className="full-width" x1="0" y1="50%" x2="100%" y2="50%" />
      <line className="half-width" x1="50%" y1="50%" x2="50%" y2="100%" />
    </Fragment>
  }
  else if([75, 91, 219, 235].includes(id) || (id >= 96 && id <= 207 && id % 16 === 11)) {
    // content = '┫';
    content = <Fragment>
      <line className="full-width" x1="50%" y1="0" x2="50%" y2="100%" />
      <line className="half-width" x1="50%" y1="50%" x2="0" y2="50%" />
    </Fragment>
  }
  else if([76, 77, 78, 92, 220, 221, 222, 236, 237, 238].includes(id) || (id >= 96 && id <= 207 && id % 16 === 12)) {
    // content = '╋';
    content = <Fragment>
      <line className="line-vertical full-width" x1="50%" y1="0" x2="50%" y2="100%" />
      <line className="line-horizontal full-width" x1="0%" y1="50%" x2="100%" y2="50%" />
    </Fragment>
  }
  else if(id >= 21 && id <= 36) {
    content = '木';
  }
  else if(id === 37) {
    content = '森';
  }
  else if(id >= 40 && id <= 43) {
    content = '公';
  }
  else if(id === 52) {
    // content = '&#x2622;';
    content = String.fromCodePoint(0x2622);
  }
  else if(id === 244) {
    content = 'R';
  }
  else if(id === 427) {
    content = 'C';
  }
  else if(id === 616) {
    content = 'I';
  }
  else if(id >= 240 && id <= 248 || id >= 423 && id <= 431 || id >= 612 && id <= 620) {
    content = '';
  }
  else if([840, 841, 842, 843].includes(id)) {
    // content = '&#x26F2;&#xFE0E;';
    content = `${String.fromCodePoint(0x26f2)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 249 && id <= 260) {
    // content = '&#x1F3E0;&#xFE0E;';
    content = `${String.fromCodePoint(0x1f3e0)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 261 && id <= 404) {
    content = '住';
  }
  else if(id >= 432 && id <= 611) {
    content = '商';
  }
  else if(id >= 621 && id <= 692 || id >= 852 && id <= 859 || id >= 884 && id <= 915) {
    content = '工';
  }
  else if(id >= 44 && id <= 47) {
    content = '荒';
  }
  else if(id >= 56 && id <= 63) {
    // content = '&#x1F525;&#xFE0E;';
    content = `${String.fromCodePoint(0x1f525)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 405 && id <= 413) {
    // content = '&#x1F3E5;&#xFE0E;';
    content = `${String.fromCodePoint(0x1f3e5)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 414 && id <= 422) {
    // content = '&#x26EA;&#xFE0E;';
    content = `${String.fromCodePoint(0x26ea)}${String.fromCodePoint(0xfe0e)}`;
  }
  else if(id >= 693 && id <= 708) {
    // content = '&#x2693;&#xFE0E;';
    content = `${String.fromCodePoint(0x2693)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 709 && id <= 744 || id >= 832 && id <= 839 || id >= 844 && id <= 851) {
    // content = '&#x2708;&#xFE0E;';
    content = `${String.fromCodePoint(0x2708)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 745 && id <= 760 || id >= 916 && id <= 931) {
    content = '火';
  }
  else if(id >= 761 && id <= 769) {
    content = '消';
  }
  else if(id >= 770 && id <= 778) {
    content = '警';
  }
  else if(id >= 779 && id <= 810 || id >= 932 && id <= 947) {
    content = `${String.fromCodePoint(0x1f3df)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 811 && id <= 826 || id >= 952 && id <= 955) {
    content = `${String.fromCodePoint(0x269b)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id === 827) {
    // content = '&#x26A1';
    content = `${String.fromCodePoint(0x26a1)}${String.fromCodePoint(0xfe0f)}`;
  }
  else if(id >= 828 && id <= 831 || id >= 948 && id <= 951) {
    content = '跳';
  }
  else {
    content = '□'
  }
  return content;
}

const DetailedTile: FC<{tileData: tileData, row: number, col: number, tileSize:number}> = ({tileData, row, col, tileSize}) => {
  const {building} = tileData;
  const classNames = getClassNamesFromBuildingId(building);
  const content = getTileContentFromBuildingId(building);
  return <TileWrapper key={row * 120 + col} className={classNames.join(' ')} tileSize={tileSize} building={building}>
    <Fragment>{content}</Fragment>
  </TileWrapper>
}

const DetailedMapTiles: FC<{tileData: tileData[][], tileSize: number}> = ({tileData, tileSize}) => {
  return <Fragment>{tileData.map(
    (row, rowNumber) => {
      return row.map(
        (tile, col) => {
          return <DetailedTile key={rowNumber * 120 + col} tileData={tile} col={col} row={rowNumber} tileSize={tileSize}/>
        }
      )
    }
  )}
  </Fragment>
}

export const DetailedMap:FC<{tileData: tileData[][]}> = ({tileData}) => {
  return <MapWrapper tileSize={11}>
    <DetailedMapTiles tileData={tileData} tileSize={11} />
  </MapWrapper>
}