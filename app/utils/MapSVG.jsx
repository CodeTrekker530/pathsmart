/* eslint-disable prettier/prettier */
import { Svg, Path, Rect, G, Line, Circle, Text } from 'react-native-svg';
import { useSelection } from '../context/SelectionContext';
import React, { useState, useRef, useEffect } from 'react';
import nodesData from './f1nodes.json';
import saveData from './saveData.json'; // Add this line to import saveData
import { useRouter } from 'expo-router';

const HIGHLIGHT_COLOR = '#609966';
const DEFAULT_COLOR = '#D9D9D9';
const START_POINT_COLOR = '#ff0000ff';
const SELECTED_START_COLOR = '#00ff00';
const DESTINATION_COLOR = '#0059FF';
const START_POINT_RADIUS = 20;

const MapSVG = ({ 
  selectedItem, 
  isLocationToolActive, 
  fromShoppingList: isFromShoppingList, 
  onLocationSet,
  startNodeId,
  setStartNodeId,
  path,
  setPath
}) => {
  const router = useRouter();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // We no longer need routeOrder state
  const [shoppingList, setShoppingList] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [fromShoppingList, setFromShoppingList] = useState(isFromShoppingList);
  const [activeNodes, setActiveNodes] = useState([]);
  const [customStartNode, setCustomStartNode] = useState(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const nodes = nodesData.nodes;
  const isManualUpdate = useRef(false);  // Add this line

  const [selectedIds, setSelectedIds] = useState([]);
  
  // Update selectedIds when selectedItem changes
  useEffect(() => {
    if (!selectedItem) {
      setSelectedIds([]);
      return;
    }
    
    const ids = Array.isArray(selectedItem.node_id)
      ? selectedItem.node_id.map(Number)
      : selectedItem.node_id
        ? [Number(selectedItem.node_id)]
        : [];
    setSelectedIds(ids);
  }, [selectedItem]);

  // Load shopping list when component mounts
  useEffect(() => {
    // Load shopping list
    const savedList = localStorage.getItem('shoppingList');
    if (savedList) {
      const list = JSON.parse(savedList);
      setShoppingList(list);
      console.log('Loaded shopping list:', list);
    }
  }, []); // Run once on mount

  // Update fromShoppingList when prop changes
  useEffect(() => {
    setFromShoppingList(isFromShoppingList);
  }, [isFromShoppingList]);

  // Add useEffect to handle initial highlighting when shopping list loads
  useEffect(() => {
    if (fromShoppingList && shoppingList && shoppingList.length > 0) {
      // Get first item in shopping list
      const currentItem = shoppingList[currentItemIndex];
      console.log('Current item from shopping list:', currentItem);

      if (currentItem?.type === 'Product') {
        // Find all stalls that sell this product
        const productId = Number(currentItem.id.replace('p', ''));
        const stallNodes = [];
        
        console.log('Looking for product ID:', productId);
        
        Object.entries(saveData.stalls).forEach(([stallId, stall]) => {
          if (stall.products.includes(productId)) {
            console.log(`Found product ${productId} in stall ${stallId}`);
            console.log('Stall nodes:', stall.nodes);
            stallNodes.push(...stall.nodes);
          }
        });
        
        console.log('Setting active nodes:', stallNodes);
        setActiveNodes(stallNodes);
      } else if (currentItem?.type === 'Stall') {
        // Direct stall highlighting
        setActiveNodes([Number(currentItem.node_id)]);
      }
    }
  }, [fromShoppingList, shoppingList, currentItemIndex, selectedItem]); // Add selectedItem dependency

  // Effect for handling highlighting of stalls
  useEffect(() => {
    if (!shoppingList?.length || currentItemIndex >= shoppingList.length) return;

    const currentItem = shoppingList[currentItemIndex];
    console.log('Current item for highlighting:', currentItem);

    if (currentItem?.type === 'Product') {
      const productId = Number(currentItem.id.replace('p', ''));
      const stallNodes = [];
      
      console.log('Looking for product ID:', productId);
      
      Object.entries(saveData.stalls).forEach(([stallId, stall]) => {
        if (stall.products.includes(productId)) {
          console.log(`Found product ${productId} in stall ${stallId}`);
          stallNodes.push(...stall.nodes);
        }
      });
      
      console.log('Setting active nodes for highlighting:', stallNodes);
      setActiveNodes(stallNodes);
    } else if (currentItem?.type === 'Stall') {
      setActiveNodes([Number(currentItem.node_id)]);
    }
  }, [currentItemIndex, shoppingList]); // Only depends on current item and list

// Separate effect for path calculation
  useEffect(() => {
    // Skip if this is a manual update from handleTryNextStore
    if (isManualUpdate.current) {
      isManualUpdate.current = false;
      return;
    }
    
    const updatePath = async () => {
      if (!startNodeId) return;

      try {
        // Shopping list mode
        if (fromShoppingList && shoppingList?.length && currentItemIndex < shoppingList.length) {
          const currentItem = shoppingList[currentItemIndex];
          console.log('=== Path Update Triggered (Shopping List) ===');
          console.log('Updating path for item:', currentItem);
          
          const response = await fetch('http://localhost:5000/findpath', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              start: startNodeId,
              shopping_list: shoppingList,
              current_index: currentItemIndex
            })
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          console.log('New path received from backend:', data.path);
          setPath(data.path);
        } 
        // Single item mode (product or stall)
        else if (selectedItem?.id) {
          console.log('=== Path Update Triggered (Single Item) ===');
          console.log('Updating path for item:', selectedItem);
          
          const id = selectedItem.id;
          const isStall = id.startsWith('s');
          const itemId = Number(id.replace(isStall ? 's' : 'p', ''));
          
          const payload = {
            start: startNodeId,
            [isStall ? 'stall_id' : 'product_id']: itemId
          };
          
          console.log('Sending request with payload:', payload);
          
          const response = await fetch('http://localhost:5000/findpath', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          console.log('New path received from backend:', data.path);
          setPath(data.path);
        }
      } catch (error) {
        console.error('Error updating path:', error);
      }
    };

    updatePath();
  }, [startNodeId, currentItemIndex, shoppingList?.length, selectedItem?.id, fromShoppingList]);

  // Simplified highlighting logic
  const getFill = (id) => {
    if (!selectedItem) return DEFAULT_COLOR;

    const nodeId = Number(id);
    if (selectedItem.type === 'Product') {
      // Find stalls that sell this product
      const productId = Number(selectedItem.id.replace('p', ''));
      const sellingStalls = Object.values(saveData.stalls).filter(stall => 
        stall.products.includes(productId)
      );
      // Check if this node belongs to any of those stalls
      const isStallNode = sellingStalls.some(stall => 
        stall.nodes.includes(nodeId)
      );
      return isStallNode ? HIGHLIGHT_COLOR : DEFAULT_COLOR;
    } else if (selectedItem.type === 'Stall') {
      // Direct stall highlighting
      return selectedItem.node_id === nodeId ? HIGHLIGHT_COLOR : DEFAULT_COLOR;
    }
    return DEFAULT_COLOR;
  };

// Handler for when a start point is clicked
  const handleStartPointClick = (nodeId) => {
    isManualUpdate.current = true;  // Set flag before updating
    setStartNodeId(nodeId);
    console.log('Start node set to:', nodeId);
  };

  // Zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(1, Math.min(4, scale * delta));
    setScale(newScale);
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    // Don't drag if clicking on a start point group or circle
    if (e.target.getAttribute('data-clickable') === 'true') {
      return;
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleStartPointHover = (isHovering) => {
    const container = document.querySelector('[data-map-container]');
    if (container) {
      container.style.cursor = isHovering ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
    }
  };

  const DestinationMarker = ({ x, y }) => (
    <Circle
      cx={x}
      cy={y}
      r={START_POINT_RADIUS}
      fill={DESTINATION_COLOR}
      opacity={0.7}
    />
  );

  const PathLine = ({ from, to, nodes, isLastNode = false }) => {
    const start = nodes[from];
    const end = nodes[to];

    if (!start || !end) return null;

    return (
      <G>
        <Line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#0059FF"
          strokeWidth="6"
        />
        {isLastNode && <DestinationMarker x={end.x} y={end.y} />}
      </G>
    );
  };

  const StartPoint = ({ id, cx, cy, label }) => {
    const isSelected = startNodeId === id;

    return (
      <G
        onMouseEnter={() => handleStartPointHover(true)}
        onMouseLeave={() => handleStartPointHover(false)}
      >
        {/* Main circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={START_POINT_RADIUS}
          fill={isSelected ? SELECTED_START_COLOR : START_POINT_COLOR}
          onPress={() => handleStartPointClick(id)}
          data-clickable="true"
        />
        
        {/* Location/Start icon */}
        <G pointerEvents="none">
          {/* Outer pin shape */}
          <Path
            d={`
              M ${cx} ${cy - 8}
              A 6 6 0 0 1 ${cx + 6} ${cy - 2}
              L ${cx} ${cy + 6}
              L ${cx - 6} ${cy - 2}
              A 6 6 0 0 1 ${cx} ${cy - 8}
            `}
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          {/* Inner dot */}
          <Circle
            cx={cx}
            cy={cy - 2}
            r={2}
            fill={isSelected ? SELECTED_START_COLOR : START_POINT_COLOR}
          />
        </G>

        {/* Label */}
        {label && (
          <Text
            x={cx + START_POINT_RADIUS + 5}
            y={cy}
            fill="#000"
            fontSize={14}
            fontWeight="bold"
            alignmentBaseline="middle"
            pointerEvents="none"
          >
            {label}
          </Text>
        )}
      </G>
    );
  };

  // Add function to find nearest node
  const findNearestNode = (clickX, clickY) => {
    let minDistance = Infinity;
    let nearestNode = null;

    Object.entries(nodes).forEach(([nodeId, node]) => {
      // Convert SVG coordinates to screen coordinates
      const dx = node.x - clickX;
      const dy = node.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = parseInt(nodeId);
      }
    });

    return nearestNode;
  };

  // Update handleMapClick
  const handleMapClick = (e) => {
    if (!isLocationToolActive) return;

    const svgElement = e.target.ownerSVGElement || e.target;
    if (!svgElement) return;

    const pt = svgElement.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    const svgP = pt.matrixTransform(svgElement.getScreenCTM().inverse());
    
    const nearestNode = findNearestNode(svgP.x, svgP.y);
    if (nearestNode) {
      handleStartPointClick(nearestNode);
      setCustomStartNode(nearestNode);
      console.log('Set location to node:', nearestNode);
      // Call the callback to just deactivate the tool
      onLocationSet();
    }
  };

  // Add CustomStartPoint component
  const CustomStartPoint = ({ nodeId }) => {
    if (!nodeId || !nodes[nodeId]) return null;
    
    const node = nodes[nodeId];
    return (
      <G>
        <Circle
          cx={node.x}
          cy={node.y}
          r={START_POINT_RADIUS}
          fill="#00ff00"
          opacity={0.7}
        />
        <Circle
          cx={node.x}
          cy={node.y}
          r={START_POINT_RADIUS - 5}
          fill="white"
          opacity={0.9}
        />
        <Circle
          cx={node.x}
          cy={node.y}
          r={5}
          fill="#00ff00"
        />
      </G>
    );
  };

  // Update return JSX to add instruction text and click handler
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isLocationToolActive ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        position: 'relative',
      }}
      data-map-container
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleMapClick}
    >
      {/* Add instruction text */}
      {isLocationToolActive && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 20,
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          Tap anywhere to set location
        </div>
      )}

      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 2031 630"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <g id="Group 3">
          <g id="boundaries">
            <line id="Line 1" x1="568.494" y1="75.9198" x2="648.494" y2="567.92" stroke="black"/>
            <line id="Line 2" x1="569.079" y1="76.4938" x2="280.079" y2="122.494" stroke="black"/>
            <line id="Line 5" x1="600" y1="577.5" x2="416.001" y2="577.473" stroke="black"/>
            <line id="Line 3" x1="280.27" y1="122.421" x2="213.27" y2="165.421" stroke="black"/>
            <line id="Line 8" x1="562.085" y1="51.4926" x2="124.085" y2="127.493" stroke="black"/>
            <line id="Line 7" x1="393.577" y1="557.266" x2="123.577" y2="127.266" stroke="black"/>
            <line id="Line 14" x1="393.337" y1="556.631" x2="416.337" y2="577.631" stroke="black"/>
            <line id="Line 4" x1="649.09" y1="568.492" x2="600.09" y2="577.492" stroke="black"/>
            <line id="Line 10" x1="649.918" y1="11.5068" x2="715.918" y2="0.506804" stroke="black"/>
            <line id="Line 11" x1="716.044" y1="0.50198" x2="1265.04" y2="49.502" stroke="black"/>
            <line id="Line 13" x1="750.999" y1="628.5" x2="1257" y2="627.5" stroke="black"/>
            <line id="Line 15" x1="750.506" y1="629.08" x2="650.506" y2="11.0799" stroke="black"/>
            <line id="Line 16" x1="1264.5" y1="49.0491" x2="1256.5" y2="130.049" stroke="black"/>
            <line id="Line 19" x1="1308.5" y1="54.0491" x2="1300.5" y2="135.049" stroke="black"/>
            <line id="Line 20" x1="1308.04" y1="53.5019" x2="2001.04" y2="114.589" stroke="black"/>
            <line id="Line 17" x1="1256.5" y1="628" x2="1256.5" y2="130" stroke="black"/>
            <line id="Line 18" x1="1300.5" y1="135" x2="1300.55" y2="628.002" stroke="black"/>
            <line id="Line 21" x1="2000.5" y1="113.999" x2="2001.51" y2="628.999" stroke="black"/>
            <line id="Line 22" x1="2002" y1="628.5" x2="1300" y2="628.5" stroke="black"/>
            <line id="Line 23" x1="124.165" y1="127.472" x2="1.16501" y2="170.472" stroke="black"/>
            <line id="Line 24" x1="306.585" y1="625.279" x2="0.585104" y2="170.279" stroke="black"/>
            <line id="Line 25" x1="305.946" y1="625.503" x2="369.946" y2="618.503" stroke="black"/>
            <line id="Line 26" x1="653.993" y1="622.5" x2="369.993" y2="618.5" stroke="black"/>
            <path id="Parking Space 1" d="M123.518 129.645L393.163 559L416.163 579.5V618.5L370 617.5L307 624.5L3.01799 170.645L123.518 129.645Z" fill="white" display="none"/>
            <path id="Line 172" d="M2017.5 114.992L2022 629" stroke="black"/>
            <g id="Group 5">
              <path id="Polygon 25" d="M337.676 159.113L343.535 157.31L346.014 151H356.606L358.183 157.31L367.197 159.113L369 164.972H337L337.676 159.113Z" fill="black"/>
              <circle id="Ellipse 27" cx="343.535" cy="164.296" r="3.33099" fill="white" stroke="black"/>
              <circle id="Ellipse 28" cx="362.465" cy="164.296" r="3.33099" fill="white" stroke="black"/>
            </g>
            <g id="Group 6">
              <path id="Polygon 25_2" d="M1381.68 251.113L1387.54 249.31L1390.01 243H1400.61L1402.18 249.31L1411.2 251.113L1413 256.972H1381L1381.68 251.113Z" fill="black"/>
              <circle id="Ellipse 27_2" cx="1387.54" cy="256.296" r="3.33099" fill="white" stroke="black"/>
              <circle id="Ellipse 28_2" cx="1406.46" cy="256.296" r="3.33099" fill="white" stroke="black"/>
            </g>
          </g>

          <path id="1" d="M475 434.5L585.5 417L596 478L485.5 496L475 434.5Z" fill={getFill('1')}/>
          <path id="2" d="M486.488 513.87L596.988 496.37L607.488 557.37L495.5 557.37L486.488 513.87Z" fill={getFill('2')}/>
          <path id="3" d="M305 385.5L349 357L399.5 436L355 464L305 385.5Z" fill={getFill('3')}/>
          <path id="4" d="M451 270.5L526.988 258.37L538 323L461.5 333.5L451 270.5Z" fill={getFill('4')}/>
          <path id="5" d="M428.5 185.5L544 168.5L554 233L433.5 253.5L434.5 230L433.5 205.5L428.5 185.5Z" fill={getFill('5')}/>
          <path id="6" d="M376.5 108.5L530.5 83.5L541.5 151L420 170L409.5 155.5L402 148L388.5 136L379 129.5L376.5 108.5Z" fill={getFill('6')}/>
          <path id="7" d="M718.5 327L766 319L806.012 316L806.012 468L741.5 468L718.5 327Z" fill={getFill('7')}/>
          <path id="8" d="M721 241L804.5 231L805.5 298.5L732 307.009L721 241Z" fill={getFill('8')}/>
          <path id="9" d="M703 130L805.488 138.378L805.488 214L718 223.5L703 130Z" fill={getFill('9')}/>
          <path id="10" d="M744 486.5L887.5 486.5L887.5 595.5L762 595.5L744 486.5Z" fill={getFill('10')}/>
          <path id="11" d="M830.5 44.9999L896 49.9999L889.5 127.508L824 124L830.5 44.9999Z" fill={getFill('11')}/>
          <path id="12" d="M912.863 51.7685L1044 63.5L1037.5 141L906.363 130.769L912.863 51.7685Z" fill={getFill('12')}/>
          <path id="13" d="M1061.36 65L1159 73.5L1153.5 152L1054.86 144L1061.36 65Z" fill={getFill('13')}/>
          <path id="14" d="M1176.86 75.7684L1242.36 80.7684L1236 170.5L1170 166.5L1176.86 75.7684Z" fill={getFill('14')}/>
          <path id="15" d="M1170.76 183.5L1236.76 189L1236 298L1170.76 298L1170.76 183.5Z" fill={getFill('15')}/>
          <path id="16" d="M1169.71 316.5L1236 316.5L1234.95 467.321L1169.71 467.321L1169.71 316.5Z" fill={getFill('16')}/>
          <path id="17" d="M1154 486L1235.5 486L1235.5 594.5L1154 594.5L1154 486Z" fill={getFill('17')}/>
          <path id="18" d="M1053.99 485.757L1135.49 485.757L1135.49 594.257L1053.99 594.257L1053.99 485.757Z" fill={getFill('18')}/>
          <path id="19" d="M1319.5 498L1401 498L1401 594.5L1319.5 594.5L1319.5 498Z" fill={getFill('19')}/>
          <path id="20" d="M1418.55 497.757L1500.05 497.757L1500.05 594.256L1418.55 594.256L1418.55 497.757Z" fill={getFill('20')}/>
          <path id="21" d="M1518.55 497.757L1582 497.757L1582 594.256L1518.55 594.256L1518.55 497.757Z" fill={getFill('21')}/>
          <path id="22" d="M1599.55 497.595L1666.5 497.595L1666 594.095L1599.55 594.095L1599.55 497.595Z" fill={getFill('22')}/>
          <path id="23" d="M1682.55 498.014L1749.5 498.014L1749 594.514L1682.55 594.514L1682.55 498.014Z" fill={getFill('23')}/>
          <path id="24" d="M1765.55 481.014L1847 481.014L1847 594.5L1765.55 594.5L1765.55 481.014Z" fill={getFill('24')}/>
          <path id="25" d="M1864.55 481L1914.5 481L1914.5 596.5L1864.55 596.5L1864.55 481Z" fill={getFill('25')}/>
          <path id="26" d="M1931.83 480.979L1981.77 480.979L1981.77 596.479L1931.83 596.479L1931.83 480.979Z" fill={getFill('26')}/>
          <path id="27" d="M1931.83 319.979L1981.77 319.979L1981.77 451.5L1931.83 451.5L1931.83 319.979Z" fill={getFill('27')}/>
          <path id="28" d="M1864.74 319.979L1914.69 319.979L1914.69 451.5L1864.74 451.5L1864.74 319.979Z" fill={getFill('28')}/>
          <path id="29" d="M1937.5 142.5L1981.69 146.5L1981.69 298.5L1931.74 298.5L1931.74 201L1937.5 142.5Z" fill={getFill('29')}/>
          <path id="30" d="M1868.5 136.5L1920.5 140.5L1916.5 196.5L1914.69 298.5L1864.74 298.5L1864.74 180.5L1868.5 136.5Z" fill={getFill('30')}/>
          <path id="31" d="M1752 214.979L1845.69 214.979L1845.69 358L1752 358L1752 214.979Z" fill={getFill('31')}/>
          <path id="32" d="M1721 123.5L1851.5 135L1848 213.5L1716 213.5L1721 123.5Z" fill={getFill('32')}/>
          <path id="33" d="M1424 96.9999L1703.2 120.955L1699.5 169.5L1699.5 213L1448.5 213L1419 202.5L1424 96.9999Z" fill={getFill('33')}/>
          <path id="34" d="M1716.12 230L1748.5 230L1748.5 359L1716.12 359L1716.12 230Z" fill={getFill('34')}/>
          <path id="35" d="M1616.44 230.876L1699 230.876L1699 468L1616.44 469L1616.44 230.876Z" fill={getFill('35')}/>
          <path id="36" d="M1325.5 88.0002L1406.5 95.5002L1400.5 197L1370.5 197L1358 191L1346 183L1338 174.5L1330.5 164.5L1325 153L1322 138.5L1322.5 124L1325.5 88.0002Z" fill={getFill('36')}/>
          <path id="37" d="M1104.5 315.679L1152.79 315.679L1152.79 383.5L1104.5 383.5L1104.5 315.679Z" fill={getFill('37')}/>
          <path id="38" d="M1105.12 400.781L1153.41 400.781L1153.41 468.602L1105.12 468.602L1105.12 400.781Z" fill={getFill('38')}/>
          <path id="39" d="M1054 400.781L1087.41 400.781L1087.41 468.602L1054 468.602L1054 400.781Z" fill={getFill('39')}/>
          <path id="40" d="M1053.12 316L1086.53 316L1086.53 383.821L1053.12 383.821L1053.12 316Z" fill={getFill('40')}/>
          <path id="41" d="M1004.12 315.5L1037.53 315.5L1037.53 468.821L1004.12 468.821L1004.12 315.5Z" fill={getFill('41')}/>
          <path id="42" d="M1004.12 485L1037.53 485L1037.53 547.5L1004.12 547.5L1004.12 485Z" fill={getFill('42')}/>
          <path id="43" d="M1055 160.5L1152.5 169L1152.5 203L1054 195L1055 160.5Z" fill={getFill('43')}/>
          <path id="44" d="M363.772 478.397L407.772 449.897L433.5 487.5L472 517L477.5 559L420.5 559L406 547L363.772 478.397Z" fill={getFill('44')}/>
          <path id="45" d="M211.5 238L218.5 233L256 232L257 241L260.5 251.5L267.5 264.5L276 274.5L284.5 281L296 286.5L308 290L340.272 341.897L295.772 369.897L211.5 238Z" fill={getFill('45')}/>
          <path id="46" d="M905.116 147.548L1037 159L1037 213.5L905.116 213.5L905.116 147.548Z" fill={getFill('46')}/>
          <path id="47" d="M822.5 140L888 145L888 213.5L821.5 213.5L822.5 140Z" fill={getFill('47')}/>
          <path id="48" d="M822 315.5L888 315.5L888 469.5L822 469.5L822 315.5Z" fill={getFill('48')}/>
          <path id="49" d="M908.436 315.901L1001.5 315.901L1001.5 465.5L908.436 465.5L908.436 315.901Z" fill={getFill('49')}/>
          <path id="50" d="M822 230L888.5 230L888.5 298.5L822 298.5L822 230Z" fill={getFill('50')}/>
          <path id="51" d="M764.5 40L814.301 42.5L808 121.5L699.5 113L693.5 78.5L761.5 84.5L764.5 40Z" fill={getFill('51')}/>
          <path id="52" d="M373 257.5L409.5 276.5L397.5 298L383.5 314.5L367.5 326L356.5 333.5L328 290L340.5 287L352 282L363 271L373 257.5Z" fill={getFill('52')}/>
          <path id="53" d="M458 437.5L467.5 492.5L445.5 477.5L424.5 442.5L458 437.5Z" fill={getFill('53')}/>
          <path id="54" d="M431.5 270.5L456 416.5L412 424.5L363.5 347.5L378 338.5L391.5 328L400.5 318.5L409.5 308.5L416.5 296L423 284L426.5 270.5H431.5Z" fill={getFill('54')}/>
          <path id="55" d="M903.5 485H953.5V594.5H903.5V485Z" fill={getFill('55')}/>
          <path id="56" d="M1446.5 344.5H1500.5L1496.5 368L1487.5 392.5L1477 412L1465.5 426.5L1454 436L1421 396.5L1434 381.5L1442.5 364.5L1446.5 344.5Z" fill={getFill('56')}/>
          <path id="57" d="M1318 382L1333.5 397L1346 405L1358.5 410L1372.5 411.5L1390.5 410L1414.3 402L1440.5 446.5L1426.5 453L1409 459L1392.5 463.5H1374L1352.5 461.5L1335 456.5L1318 449V382Z" fill={getFill('57')}/>
        </g>
        <circle id="Ellipse 14" cx="628" cy="568" r="5" fill="#0059FF"/>
        <circle id="Ellipse 25" cx="552" cy="112" r="5" fill="#0059FF"/>

        <path id="Polygon 6" d="M1266.45 30.9551L1264.55 48.959L1151.55 39.0459L1153.44 21.5381L1266.45 30.9551Z" stroke="black" fill="none"/>
        <path id="Polygon 7" d="M1201 36.2294L1206.1 36.2304L1206.11 32.1754L1211.5 32.1765L1211.5 28.0021L1217 28.0033L1217 41.5033L1201 41.5L1201 36.2294Z" fill="black"/>
        <path id="Polygon 8" d="M1358.05 50.2289L1363.16 50.2817L1363.2 46.2268L1368.6 46.2826L1368.64 42.1085L1374.14 42.1653L1374 55.6646L1358 55.4993L1358.05 50.2289Z" fill="black"/>
        <path id="Polygon 9" d="M1423.45 44.9551L1421.55 62.959L1308.55 53.0459L1310.44 35.5381L1423.45 44.9551Z" stroke="black" fill="none"/>
        <path id="Polygon 10" d="M582.921 397.58L519.92 406.932L510.566 344.411L572.09 334.075L582.921 397.58Z" stroke="black" fill="none"/>
        <path id="Polygon 11" d="M534.082 371.34L541.735 371.42L541.798 365.339L549.89 365.423L549.955 359.163L558.202 359.248L557.993 379.492L534 379.244L534.082 371.34Z" fill="black"/>
        <path id="Polygon 12" d="M1004 484.5V549.5H955V484.5H1004Z" stroke="black" fill="none"/>
        <path id="Polygon 13" d="M970.182 518.224L975.283 518.401L975.423 514.348L980.816 514.534L980.96 510.363L986.457 510.553L985.991 524.045L970 523.492L970.182 518.224Z" fill="black"/>
        <path id="Polygon 14" d="M1021 230.5V299H956V230.5H1021Z" stroke="black" fill="none"/>
        <path id="Polygon 15" d="M976.098 264.035L982.504 264.117L982.579 258.187L989.351 258.273L989.429 252.168L996.332 252.256L996.08 272L976 271.744L976.098 264.035Z" fill="black"/>
        <path id="Polygon 16" d="M762.475 38.4492L760.028 82.9707L693.442 79.0254L690.569 57H713.5V33.5518L762.475 38.4492Z" stroke="black" fill="none"/>
        <path id="Polygon 17" d="M721.098 60.0354L727.504 60.1171L727.579 54.1867L734.351 54.2731L734.429 48.1682L741.332 48.2564L741.08 68L721 67.7436L721.098 60.0354Z" fill="black"/>
        <path id="Polygon 18" d="M1798.8 384V452.5H1732.5V384H1798.8Z" stroke="black" fill="none"/>
        <path id="Polygon 19" d="M1754.1 418.035L1760.5 418.117L1760.58 412.187L1767.35 412.273L1767.43 406.168L1774.33 406.256L1774.08 426L1754 425.744L1754.1 418.035Z" fill="black"/>
        <circle id="Ellipse 26" cx="319" cy="230" r="49.5" stroke="black" fill="none"/>
        <circle id="Ellipse 29" cx="1375.5" cy="341.5" r="55" stroke="black" fill="none"/>
        <path id="Polygon 24" d="M341.371 120.485L363.783 128.952L385.189 141.397L402.613 159.32L416.547 178.728L424.514 203.624L428.496 226.519L426.507 246.405L422.02 262.859L416.708 279.277L365.141 251.774L369.46 241.697L369.487 241.634L369.496 241.564L371.005 229.997L370.995 229.93L368.995 215.93L368.986 215.865L368.961 215.806L364.961 206.306L364.944 206.268L364.923 206.233L358.923 196.733L358.893 196.686L351.828 189.621L351.8 189.6L343.8 183.6L343.747 183.561L343.686 183.536L333.686 179.536L333.641 179.518L333.594 179.509L323.094 177.509L323.047 177.5H312.433L301.368 180.518L301.301 180.536L301.241 180.572L246.146 213.827L213.205 165.646L280.688 122.973L315.01 116.506L341.371 120.485Z" stroke="black" fill="none"/>
        <path id="Polygon 26" d="M1437.5 331.902L1437.46 331.812L1429.96 313.312L1429.94 313.247L1429.89 313.192L1417.39 297.192L1417.36 297.145L1417.31 297.106L1403.31 286.106L1403.21 286.033L1385.6 282.51L1385.55 282.5H1363.9L1363.81 282.536L1341.24 291.565L1341.18 291.616L1323.18 306.616L1323.13 306.657L1323.09 306.709L1310.59 324.209L1310.56 324.25L1310.54 324.295L1300.5 346.665V283.268L1316.76 272.428L1335.73 261.944L1357.21 251.953L1358.12 251.529L1357.23 251.059L1331.79 237.587L1313.87 221.663L1300.5 202.84V141.038L1312.04 169.189L1312.05 169.219L1312.06 169.246L1318.56 180.746L1318.58 180.778L1318.61 180.809L1327.61 192.309L1327.64 192.352L1327.68 192.386L1336.18 199.386L1336.2 199.404L1336.23 199.419L1346.23 205.919L1346.25 205.938L1346.29 205.951L1356.79 210.951L1356.83 210.971L1367.87 213.982L1367.9 213.992L1367.94 213.997L1393.61 216.993L1416.33 222.473L1438.24 233.431L1454.68 244.89L1467.14 256.347L1478.09 269.292L1489.05 287.718L1496.01 306.623L1499.5 328.541V343.991L1437.5 343.008V331.902Z" stroke="black" fill="none"/>

        {/* Path Lines */}
        {path.map((nodeId, i) =>
          i < path.length - 1 ? (
            <PathLine 
              key={i} 
              from={nodeId} 
              to={path[i + 1]} 
              nodes={nodes}
              isLastNode={i === path.length - 2}
            />
          ) : null
        )}

        {/* Start Points */}
        <StartPoint id={14} cx={628} cy={568}/>
        <StartPoint id={25} cx={552} cy={112}/>
        <StartPoint id={45} cx={756} cy={611}/>
        <StartPoint id={119} cx={659} cy={21}/>
        <StartPoint id={225} cx={1251} cy={611}/>
        <StartPoint id={104} cx={1251} cy={70}/>
        <StartPoint id={134} cx={1309} cy={611}/>
        <StartPoint id={207} cx={1316} cy={76}/>
        <StartPoint id={150} cx={1991} cy={611}/>
        <StartPoint id={194} cx={1991} cy={136}/>

        {/* Custom Start Point Indicator */}
        {customStartNode && <CustomStartPoint nodeId={customStartNode} />}
      </Svg>
    </div>
  );
};

// Fix the export
export default MapSVG;