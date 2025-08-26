/* eslint-disable prettier/prettier */
import React from 'react';
import { Svg, Path, Rect, G, Line } from 'react-native-svg';
import { useSelection } from '../context/SelectionContext';

const HIGHLIGHT_COLOR = '#609966';
const DEFAULT_COLOR = '#D9D9D9';

const MapSVG = () => {
  const { selectedItem } = useSelection();
  const selectedIds = Array.isArray(selectedItem?.node_id)
    ? selectedItem.node_id.map(Number)
    : selectedItem?.node_id ? [Number(selectedItem.node_id)] : [];

  const getFill = (id) => {
    return selectedIds.includes(Number(id)) ? HIGHLIGHT_COLOR : DEFAULT_COLOR;
  };

  return (
    <Svg width="500" height="400" viewBox="0 0 200 200" fill="none">
      {/* Background white rectangle */}
      <Rect width="209" height="150" fill="white" />

      {/* Shapes */}
      <Path id="1" d="M16 11H49V32H20.215L16 11Z" fill={getFill('1')} />
      <Path id="2" d="M20.5 34H49V55H24L20.5 34Z" fill={getFill('2')} />
      <Path id="3" d="M26 65H49V85H28.6655L26 65Z" fill={getFill('3')} />
      <Path id="4" d="M29 87H49V109H32L29 87Z" fill={getFill('4')} />
      <Path id="5" d="M32.5 111H73V131H35L32.5 111Z" fill={getFill('5')} />

      <Rect id="6" x="52" y="11" width="21" height="21" fill={getFill('6')} />
      <Rect id="7" x="52" y="34" width="21" height="21" fill={getFill('7')} />
      <Rect id="8" x="52" y="65" width="21" height="44" fill={getFill('8')} />

      <Rect id="9" x="85" y="11" width="44" height="21" fill={getFill('9')} />
      <Rect id="10" x="85" y="34" width="21" height="21" fill={getFill('10')} />
      <Rect id="11" x="86" y="65" width="27" height="21" fill={getFill('11')} />
      <Rect id="12" x="108" y="34" width="44" height="21" fill={getFill('12')} />
      <Rect id="13" x="115" y="65" width="27" height="21" fill={getFill('13')} />

      <Rect id="14" x="131" y="11" width="21" height="21" fill={getFill('14')} />
      <Rect id="15" x="154" y="11" width="21" height="21" fill={getFill('15')} />
      <Rect id="16" x="154" y="34" width="21" height="21" fill={getFill('16')} />
      <Rect id="17" x="154" y="65" width="44" height="21" fill={getFill('17')} />
      <Rect id="18" x="154" y="88" width="21" height="21" fill={getFill('18')} />
      <Rect id="19" x="154" y="110" width="21" height="21" fill={getFill('19')} />

      <Rect id="20" x="177" y="11" width="21" height="21" fill={getFill('20')} />
      <Rect id="21" x="177" y="34" width="21" height="21" fill={getFill('21')} />
      <Rect id="22" x="177" y="88" width="21" height="21" fill={getFill('22')} />
      <Rect id="23" x="177" y="110" width="21" height="21" fill={getFill('23')} />

      {/* Stair Group */}
      <G id="stair">
        <Rect id="Rectangle19" x="95" y="100" width="38" height="31" fill="#D9D9D9" />
        <Rect id="Rectangle20" x="99.2222" y="106.341" width="29.5556" height="24.6591" fill="white" />
      </G>

      {/* Border Lines */}
      <G id="border" stroke="black" strokeWidth="1">
        <Line id="Line1" x1="0.493016" y1="0.91672" x2="25.493" y2="148.917" />
        <Line id="Line2" y1="0.5" x2="209" y2="0.5" />
        <Line id="Line3" x1="208.5" y1="149" x2="208.5" y2="1" />
        <Line id="Line4" x1="209" y1="149.5" x2="25" y2="149.5" />
      </G>
    </Svg>
  );
};

export default MapSVG;
