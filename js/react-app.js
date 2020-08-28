(function (React, reactDom, reactTabs, styled) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

    /**
     * Cty2JSON ver 1.0.5
     * Copyright (C) 2015-2020 Tom Konda
     * Released under the GPLv3 license
     * See https://www.gnu.org/licenses/gpl-3.0.en.html
     */

    const cty2JSONStatic = (() => {
        const Cty2JSONAnalyzeData = (data) => {
            const SHORT_BYTE_LENGTH = 2, DEFAULT_WIDTH = 120, DEFAULT_HEIGHT = 100, SOME_EDITION_FILESIZE = 27120;
            let offset = 0;
            const cityData = {
                fileSize: 0,
                historyData: {},
                miscData: {},
                tileData: new Array(DEFAULT_HEIGHT),
            };
            if (data.byteLength > SOME_EDITION_FILESIZE) {
                // Set 128-byte offset because of following comment in Micropolis.java.
                // ref: https://github.com/jason17055/micropolis-java/blob/9f6ddb4b5f36a005fe4c4f77488d7969eabf0797/src/micropolisj/engine/Micropolis.java#L2254
                // some editions of the classic Simcity game
                // start the file off with a 128-byte header,
                // but otherwise use the same format as us,
                // so read in that 128-byte header and continue
                // as before.
                offset = 128;
            }
            cityData.fileSize = data.byteLength;
            const HISTORY_DATA_COUNT = 240, HALF_HISTORY_DATA_COUNT = HISTORY_DATA_COUNT / 2, HISTORY_DATA_BYTE = HISTORY_DATA_COUNT * SHORT_BYTE_LENGTH;
            // Get history graph data from city
            const getHistoryData = (property) => {
                const historyData = data.slice(offset, offset + HISTORY_DATA_BYTE);
                const currentHistoryData = cityData.historyData;
                const propertyData = {
                    [property]: {
                        '10years': [],
                        '120years': [],
                    }
                };
                for (let i = 0; i < HISTORY_DATA_COUNT; ++i) {
                    if (i < HALF_HISTORY_DATA_COUNT) {
                        propertyData[property]['10years'].unshift(new DataView(historyData, i * SHORT_BYTE_LENGTH, SHORT_BYTE_LENGTH).getInt16(0, false));
                    }
                    else {
                        propertyData[property]['120years'].unshift(new DataView(historyData, i * SHORT_BYTE_LENGTH, SHORT_BYTE_LENGTH).getInt16(0, false));
                    }
                }
                cityData.historyData = Object.assign(Object.assign({}, currentHistoryData), propertyData);
                offset += HISTORY_DATA_BYTE;
            };
            getHistoryData('residential');
            getHistoryData('commercial');
            getHistoryData('industrial');
            getHistoryData('crime');
            getHistoryData('pollution');
            getHistoryData('landValue');
            const MISC_DATA_COUNT = 120, MISC_DATA_BYTE = MISC_DATA_COUNT * SHORT_BYTE_LENGTH;
            const miscData = data.slice(offset, offset + MISC_DATA_BYTE);
            offset += MISC_DATA_BYTE;
            const getMiscData = (property, miscOffset, length) => {
                const currentMiscData = cityData.miscData;
                let value = 0;
                switch (length) {
                    case 1:
                        value = new DataView(miscData, miscOffset * SHORT_BYTE_LENGTH, SHORT_BYTE_LENGTH).getInt16(0, false);
                        break;
                    case 2:
                        value = new DataView(miscData, miscOffset * SHORT_BYTE_LENGTH, SHORT_BYTE_LENGTH * 2).getInt32(0, false);
                }
                cityData.miscData = Object.assign(Object.assign({}, currentMiscData), { [property]: value });
            };
            getMiscData('RPopulation', 2, 1);
            getMiscData('CPopulation', 3, 1);
            getMiscData('IPopulation', 4, 1);
            getMiscData('RValve', 5, 1);
            getMiscData('CValve', 6, 1);
            getMiscData('IValve', 7, 1);
            getMiscData('cityTime', 8, 2);
            getMiscData('crimeRamp', 10, 1);
            getMiscData('polluteRamp', 11, 1);
            getMiscData('landValueAve', 12, 1);
            getMiscData('crimeAve', 13, 1);
            getMiscData('pollutionAve', 14, 1);
            getMiscData('gameLevel', 15, 1);
            getMiscData('cityClass', 16, 1);
            getMiscData('cityScore', 17, 1);
            getMiscData('budget', 50, 2);
            getMiscData('autoBulldoze', 52, 1);
            getMiscData('autoBudget', 53, 1);
            getMiscData('autoGoto', 54, 1);
            getMiscData('soundOn', 55, 1);
            getMiscData('tax', 56, 1);
            getMiscData('gameSpeed', 57, 1);
            // Following three values are ratio of n to 65536
            getMiscData('policeCovered', 58, 2);
            getMiscData('fireCovered', 60, 2);
            getMiscData('transportCovered', 62, 2);
            const MAP_DATA_COUNT = DEFAULT_WIDTH * DEFAULT_HEIGHT;
            const MAP_DATA_BYTE = MAP_DATA_COUNT * SHORT_BYTE_LENGTH;
            const tileData = data.slice(offset, offset + MAP_DATA_BYTE);
            // Get Tile Data
            for (let y = 0; y < DEFAULT_HEIGHT; ++y) {
                cityData.tileData[y] = [];
                for (let x = 0; x < DEFAULT_WIDTH; ++x) {
                    const tile = new DataView(tileData, (x * DEFAULT_HEIGHT + y) * SHORT_BYTE_LENGTH, SHORT_BYTE_LENGTH).getInt16(0, false);
                    cityData.tileData[y][x] = {
                        building: tile & 1023,
                        zoneCenter: Boolean(tile >> 10 & 1),
                        animated: Boolean(tile >> 11 & 1),
                        bulldozable: Boolean(tile >> 12 & 1),
                        combustible: Boolean(tile >> 13 & 1),
                        conductive: Boolean(tile >> 14 & 1),
                    };
                }
            }
            return cityData;
        };
        const outputJSONText = (data) => JSON.stringify(Cty2JSONAnalyzeData(data), null, '  ');
        return {
            analyze: Cty2JSONAnalyzeData,
            outputJSONText: outputJSONText,
        };
    })();

    var cty2json = cty2JSONStatic;
    var cty2json_1 = cty2json.analyze;

    const MapWrapperBase = ({ children, className }) => {
        return React.createElement("div", { className: `l-map ${className}` }, children);
    };
    const MapWrapper = styled__default['default'](MapWrapperBase) `
  line-height: ${({ tileSize }) => tileSize - 2}px;
  width: ${({ tileSize }) => tileSize * 120}px;
  grid-template-columns: repeat(120, ${({ tileSize }) => tileSize}px);
  grid-template-rows: repeat(100, ${({ tileSize }) => tileSize}px);
`;
    const TileWrapperBase = ({ children, className, building, tileSize }) => {
        if (typeof children.props.children === 'string') {
            return React.createElement("span", { className: `map__tile ${className}`, "data-tile": building }, children);
        }
        else {
            return React.createElement("svg", { viewBox: `0 0 ${tileSize} ${tileSize}`, xmlns: "http://www.w3.org/2000/svg", className: `map__tile ${className}`, "data-tile": building }, children);
        }
    };
    const TileWrapper = styled__default['default'](TileWrapperBase) `
  font-size: ${({ tileSize }) => tileSize - 2}px;
  width:${({ tileSize }) => tileSize}px;
  height:${({ tileSize }) => tileSize}px;
  display:inline-block;
  box-sizing: border-box;
  text-align: center;
  vertical-align: center;
  overflow: hidden;
`;

    const getClassNamesFromBuildingId = (id) => {
        const classNames = [];
        if (id === 0) {
            classNames.push('tile__land');
        }
        if (id === 52) {
            classNames.push('tile__radioactive');
        }
        if (id >= 64 && id <= 76 ||
            id >= 80 && id <= 94 ||
            id >= 96 && id <= 207 ||
            id >= 828 && id <= 831 || id >= 948 && id <= 951) {
            classNames.push('tile__road-line', 'tile__road');
        }
        if (id >= 226 && id <= 236) {
            classNames.push('tile__rail-line', 'tile__land');
        }
        if (id >= 208 && id <= 220) {
            classNames.push('tile__power-line');
            if ([208, 209].includes(id) === false) {
                classNames.push('tile__land');
            }
        }
        if ([208, 209, 224, 225].includes(id)) {
            classNames.push('tile__under-water');
        }
        if ([2, 3, 4, 79, 95, 208, 209, 224, 225].includes(id)) {
            classNames.push('tile__water');
        }
        if ([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(id)) {
            classNames.push('tile__water', 'tile__water--shallow');
        }
        if (id >= 21 && id <= 36) {
            classNames.push('tile__tree-shallow');
        }
        if (id === 37) {
            classNames.push('tile__tree-deep');
        }
        if (id >= 40 && id <= 43) {
            classNames.push('tile__park');
        }
        if (id >= 44 && id <= 47) {
            classNames.push('tile__rubble');
        }
        if (id === 77) {
            classNames.push('tile__vertical-power-horizontal-road', 'tile__road');
        }
        if (id === 78) {
            classNames.push('tile__vertical-road-horizontal-power', 'tile__road');
        }
        if (id === 221) {
            classNames.push('tile__vertical-power-horizontal-rail', 'tile__land');
        }
        if (id === 222) {
            classNames.push('tile__vertical-rail-horizontal-power', 'tile__land');
        }
        if (id === 237) {
            classNames.push('tile__vertical-road-horizontal-rail', 'tile__road');
        }
        if (id === 238) {
            classNames.push('tile__vertical-rail-horizontal-road', 'tile__road');
        }
        if ([240, 241, 242].includes(id)) {
            classNames.push('tile__residential-edge-n');
        }
        if ([240, 243, 246].includes(id)) {
            classNames.push('tile__residential-edge-w');
        }
        if ([242, 245, 248].includes(id)) {
            classNames.push('tile__residential-edge-e');
        }
        if ([246, 247, 248].includes(id)) {
            classNames.push('tile__residential-edge-s');
        }
        if ([423, 424, 425].includes(id)) {
            classNames.push('tile__commercial-edge-n');
        }
        if ([423, 426, 429].includes(id)) {
            classNames.push('tile__commercial-edge-w');
        }
        if ([425, 428, 431].includes(id)) {
            classNames.push('tile__commercial-edge-e');
        }
        if ([429, 430, 431].includes(id)) {
            classNames.push('tile__commercial-edge-s');
        }
        if ([612, 613, 614].includes(id)) {
            classNames.push('tile__industrial-edge-n');
        }
        if ([612, 615, 618].includes(id)) {
            classNames.push('tile__industrial-edge-w');
        }
        if ([614, 617, 620].includes(id)) {
            classNames.push('tile__industrial-edge-e');
        }
        if ([618, 619, 620].includes(id)) {
            classNames.push('tile__industrial-edge-s');
        }
        if ((id >= 240 && id <= 248) || (id >= 423 && id <= 431) || (id >= 612 && id <= 620)) {
            classNames.push('tile__land');
        }
        if (id === 244 || id >= 261 && id <= 408) {
            classNames.push('tile__residential');
        }
        else if (id === 427 || id >= 432 && id <= 611) {
            classNames.push('tile__commercial');
        }
        else if (id === 616 || id >= 621 && id <= 692 || id >= 852 && id <= 859 || id >= 884 && id <= 915) {
            classNames.push('tile__industrial');
        }
        else if (id >= 761 && id <= 769) {
            classNames.push('tile__fd');
        }
        else if (id >= 770 && id <= 778) {
            classNames.push('tile__pd');
        }
        return classNames;
    };
    const getTileContentFromBuildingId = (id) => {
        let content;
        if (id === 0) {
            content = '';
        }
        else if (id >= 2 && id <= 20 || [79, 95].includes(id)) {
            content = '';
        }
        else if ([64, 66, 80, 82, 93, 209, 210, 224, 226].includes(id) || (id >= 96 && id <= 207 && [0, 2, 13].indexOf(id % 16) !== -1)) {
            // content = '━';
            content = React.createElement("line", { className: "full-width", x1: "0", y1: "50%", x2: "100%", y2: "50%" });
        }
        else if ([65, 67, 81, 83, 94, 208, 211, 225, 227].includes(id) || (id >= 96 && id <= 207 && [1, 3, 14].indexOf(id % 16) !== -1)) {
            // content = '┃';
            content = React.createElement("line", { className: "full-width", x1: "50%", y1: "0", x2: "50%", y2: "100%" });
        }
        else if ([68, 84, 212, 228].includes(id) || (id >= 96 && id <= 207 && id % 16 === 4)) {
            // content = '┗';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "100%", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "0" }));
        }
        else if ([69, 85, 213, 229].includes(id) || (id >= 96 && id <= 207 && id % 16 === 5)) {
            // content = '┏';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "100%", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "100%" }));
        }
        else if ([70, 86, 214, 230].includes(id) || (id >= 96 && id <= 207 && id % 16 === 6)) {
            // content = '┓';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "0", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "100%" }));
        }
        else if ([71, 87, 215, 231].includes(id) || (id >= 96 && id <= 207 && id % 16 === 7)) {
            // content = '┛';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "0", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "0" }));
        }
        else if ([72, 88, 216, 232].includes(id) || (id >= 96 && id <= 207 && id % 16 === 8)) {
            // content = '┻';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "full-width", x1: "0", y1: "50%", x2: "100%", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "0" }));
        }
        else if ([73, 89, 217, 233].includes(id) || (id >= 96 && id <= 207 && id % 16 === 9)) {
            // content = '┣';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "full-width", x1: "50%", y1: "0", x2: "50%", y2: "100%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "100%", y2: "50%" }));
        }
        else if ([74, 90, 218, 234].includes(id) || (id >= 96 && id <= 207 && id % 16 === 10)) {
            // content = '┳';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "full-width", x1: "0", y1: "50%", x2: "100%", y2: "50%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "50%", y2: "100%" }));
        }
        else if ([75, 91, 219, 235].includes(id) || (id >= 96 && id <= 207 && id % 16 === 11)) {
            // content = '┫';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "full-width", x1: "50%", y1: "0", x2: "50%", y2: "100%" }),
                React.createElement("line", { className: "half-width", x1: "50%", y1: "50%", x2: "0", y2: "50%" }));
        }
        else if ([76, 77, 78, 92, 220, 221, 222, 236, 237, 238].includes(id) || (id >= 96 && id <= 207 && id % 16 === 12)) {
            // content = '╋';
            content = React.createElement(React.Fragment, null,
                React.createElement("line", { className: "line-vertical full-width", x1: "50%", y1: "0", x2: "50%", y2: "100%" }),
                React.createElement("line", { className: "line-horizontal full-width", x1: "0%", y1: "50%", x2: "100%", y2: "50%" }));
        }
        else if (id >= 21 && id <= 36) {
            content = '木';
        }
        else if (id === 37) {
            content = '森';
        }
        else if (id >= 40 && id <= 43) {
            content = '公';
        }
        else if (id === 52) {
            // content = '&#x2622;';
            content = String.fromCodePoint(0x2622);
        }
        else if (id === 244) {
            content = 'R';
        }
        else if (id === 427) {
            content = 'C';
        }
        else if (id === 616) {
            content = 'I';
        }
        else if (id >= 240 && id <= 248 || id >= 423 && id <= 431 || id >= 612 && id <= 620) {
            content = '';
        }
        else if ([840, 841, 842, 843].includes(id)) {
            // content = '&#x26F2;&#xFE0E;';
            content = `${String.fromCodePoint(0x26f2)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 249 && id <= 260) {
            // content = '&#x1F3E0;&#xFE0E;';
            content = `${String.fromCodePoint(0x1f3e0)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 261 && id <= 404) {
            content = '住';
        }
        else if (id >= 432 && id <= 611) {
            content = '商';
        }
        else if (id >= 621 && id <= 692 || id >= 852 && id <= 859 || id >= 884 && id <= 915) {
            content = '工';
        }
        else if (id >= 44 && id <= 47) {
            content = '荒';
        }
        else if (id >= 56 && id <= 63) {
            // content = '&#x1F525;&#xFE0E;';
            content = `${String.fromCodePoint(0x1f525)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 405 && id <= 413) {
            // content = '&#x1F3E5;&#xFE0E;';
            content = `${String.fromCodePoint(0x1f3e5)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 414 && id <= 422) {
            // content = '&#x26EA;&#xFE0E;';
            content = `${String.fromCodePoint(0x26ea)}${String.fromCodePoint(0xfe0e)}`;
        }
        else if (id >= 693 && id <= 708) {
            // content = '&#x2693;&#xFE0E;';
            content = `${String.fromCodePoint(0x2693)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 709 && id <= 744 || id >= 832 && id <= 839 || id >= 844 && id <= 851) {
            // content = '&#x2708;&#xFE0E;';
            content = `${String.fromCodePoint(0x2708)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 745 && id <= 760 || id >= 916 && id <= 931) {
            content = '火';
        }
        else if (id >= 761 && id <= 769) {
            content = '消';
        }
        else if (id >= 770 && id <= 778) {
            content = '警';
        }
        else if (id >= 779 && id <= 810 || id >= 932 && id <= 947) {
            content = `${String.fromCodePoint(0x1f3df)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 811 && id <= 826 || id >= 952 && id <= 955) {
            content = `${String.fromCodePoint(0x269b)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id === 827) {
            // content = '&#x26A1';
            content = `${String.fromCodePoint(0x26a1)}${String.fromCodePoint(0xfe0f)}`;
        }
        else if (id >= 828 && id <= 831 || id >= 948 && id <= 951) {
            content = '跳';
        }
        else {
            content = '□';
        }
        return content;
    };
    const DetailedTile = ({ tileData, row, col, tileSize }) => {
        const { building } = tileData;
        const classNames = getClassNamesFromBuildingId(building);
        const content = getTileContentFromBuildingId(building);
        return React.createElement(TileWrapper, { key: row * 120 + col, className: classNames.join(' '), tileSize: tileSize, building: building },
            React.createElement(React.Fragment, null, content));
    };
    const DetailedMapTiles = ({ tileData, tileSize }) => {
        return React.createElement(React.Fragment, null, tileData.map((row, rowNumber) => {
            return row.map((tile, col) => {
                return React.createElement(DetailedTile, { key: rowNumber * 120 + col, tileData: tile, col: col, row: rowNumber, tileSize: tileSize });
            });
        }));
    };
    const DetailedMap = ({ tileData }) => {
        return React.createElement(MapWrapper, { tileSize: 11 },
            React.createElement(DetailedMapTiles, { tileData: tileData, tileSize: 11 }));
    };

    const TabLayout = ({ ctyjson }) => {
        console.log(ctyjson);
        const { tileData } = ctyjson;
        return React.createElement(reactTabs.Tabs, null,
            React.createElement(reactTabs.TabList, null,
                React.createElement(reactTabs.Tab, null, "\u30DE\u30C3\u30D7\u8A73\u7D30")),
            React.createElement(reactTabs.TabPanel, null,
                React.createElement(DetailedMap, { tileData: tileData })));
    };

    const Layout = () => {
        const initValue = getInitValue();
        console.log(initValue);
        const [ctyjson, setCtyJSON] = React.useState(initValue);
        React.useEffect(() => {
            setCtyJSON(initValue);
        }, [initValue]);
        console.log([ctyjson, setCtyJSON]);
        return React.createElement("section", null,
            React.createElement("input", { type: "file", accept: '.cty', onChange: (event) => changeEventMethod(event, setCtyJSON) }),
            ctyjson ? React.createElement(TabLayout, { ctyjson: ctyjson }) : '');
    };
    const getInitValue = () => {
        const [cty2json, setCtyJSON] = React.useState(undefined);
        React.useEffect(() => {
            const setInitState = async () => {
                const request = await fetch('./fixtures/cty2jsonTest.cty');
                const ctyData = await request.arrayBuffer();
                if (ctyData) {
                    setCtyJSON(cty2json_1(ctyData));
                }
            };
            setInitState();
        }, []);
        return cty2json;
    };
    const changeEventMethod = async (event, setCtyJSON) => {
        const { files } = event.target;
        if (files && files.length) {
            const file = files.item(0);
            const result = await fileHandlar(file);
            if (result) {
                setCtyJSON(cty2json_1(result));
            }
        }
        return;
    };
    const fileHandlar = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
            reader.addEventListener('error', (event) => {
                reject(event);
            });
            reader.readAsArrayBuffer(file);
        });
    };

    reactDom.render(React.createElement(Layout, null), document.querySelector('#AppRoot'));

}(React, ReactDOM, ReactTabs, emotionStyled));
