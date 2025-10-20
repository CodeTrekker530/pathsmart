/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import styles from './assets/Styles/Maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapSVG from './utils/MapSVG';
import { useSelection } from './context/SelectionContext'; 
import SearchBar from "./components/searchBar";
import { LinearGradient } from "expo-linear-gradient";

const window = Dimensions.get('window');

export default function HomeScreen() {
  const { selectedItem, setSelectedItem } = useSelection();
  const [showProductList, setShowProductList] = useState(false);
  const [showQualityGuide, setShowQualityGuide] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [shoppingList, setShoppingList] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [fromShoppingList, setFromShoppingList] = useState(false);
  const [isLocationToolActive, setIsLocationToolActive] = useState(false);
  console.log('[Map.js] selectedItem:', selectedItem);
  const router = useRouter();

  // Load shopping list on mount
  useEffect(() => {
    try {
      const savedList = localStorage.getItem('shoppingList');
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        setShoppingList(parsedList);
        console.log('Loaded shopping list:', parsedList); // Debug log
      }
    } catch (error) {
      console.error('Error loading shopping list:', error);
    }

    // Cleanup when unmounting
    return () => {
      localStorage.removeItem('shoppingList');
    };
  }, []);

  // Update navigation handlers
  const handleNext = () => {
    if (currentItemIndex < shoppingList.length - 1) {
      const nextIndex = currentItemIndex + 1;
      const nextItem = shoppingList[nextIndex];
      setCurrentItemIndex(nextIndex);
      // Pass the selected item to MapSVG through selectedItem prop
      setSelectedItem(nextItem);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      const prevIndex = currentItemIndex - 1;
      const prevItem = shoppingList[prevIndex];
      setCurrentItemIndex(prevIndex);
      // Pass the selected item to MapSVG through selectedItem prop
      setSelectedItem(prevItem);
    }
  };

  // Add check/uncheck handler
  const toggleItemCheck = (itemId) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  // Update shopping list render to show loaded items
  const renderShoppingList = () => {
    if (shoppingList.length === 0) return null;

    return (
      <View>
        <TouchableOpacity 
          onPress={() => setShowProductList(!showProductList)}
        >
          <Text style={customStyles.sectionTitle}>
            Shopping List ({shoppingList.length})
          </Text>
          <Ionicons 
            name={showProductList ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
        
        {showProductList && (
          <ScrollView style={customStyles.productList}>
            {shoppingList.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  customStyles.productItem,
                  index === currentItemIndex && customStyles.productItemActive
                ]}
                onPress={() => {
                  console.log('Selected Item:', {
                    index: index,
                    id: item.id,
                    name: item.name,
                    type: item.type
                  });
                  setCurrentItemIndex(index);
                }}
              >
                <View style={customStyles.productItemIcon}>
                  <Ionicons name="cart-outline" size={20} color="#0766AD" />
                </View>
                <View style={customStyles.productItemInfo}>
                  <Text style={customStyles.productItemName}>{item.name}</Text>
                  <Text style={customStyles.productItemLocation}>{item.category}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleItemCheck(item.id)}>
                  <Ionicons 
                    name={checkedItems.has(item.id) ? "checkmark-circle" : "checkmark-circle-outline"} 
                    size={24} 
                    color={checkedItems.has(item.id) ? "#609966" : "#ccc"} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top HUD */}
      <LinearGradient
        colors={["#0766AD", "#BCE2BD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {/* Logo */}
        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logo_name}>PathSmart</Text>
        <SearchBar />
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => { router.push("/screens/loginScreen"); }}>
          <Text style={{ fontWeight: "600", color: "#0766AD" }}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Main Content: Map + Sidebar */}
      <View style={customStyles.mainContainer}>
        {/* Map Container */}
        <View style={customStyles.mapWrapper}>
          {/* Floor Selection and Location Tool Buttons - Floating */}
          <View style={customStyles.floatingButtons}>
            <View style={customStyles.floatingFloorButtons}>
              {[1, 2, 3].map((floor) => (
                <TouchableOpacity
                  key={floor}
                  style={[
                    customStyles.floorButton,
                    selectedFloor === floor && customStyles.floorButtonActive
                  ]}
                  onPress={() => setSelectedFloor(floor)}
                >
                  <Text style={[
                    customStyles.floorButtonText,
                    selectedFloor === floor && customStyles.floorButtonTextActive
                  ]}>{floor}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Location Tool Button */}
            <TouchableOpacity
              style={[
                customStyles.toolButton,
                isLocationToolActive && customStyles.toolButtonActive
              ]}
              onPress={() => setIsLocationToolActive(!isLocationToolActive)}
            >
              <Ionicons 
                name="location" 
                size={24} 
                color={isLocationToolActive ? "#fff" : "#0766AD"} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={customStyles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
            maximumZoomScale={4}
            minimumZoomScale={1}
            bounces={false}
            pinchGestureEnabled={true}
            horizontal
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mapContainer}>
              <MapSVG 
                width={window.width * 3} 
                height={window.height * 3}
                selectedItem={shoppingList[currentItemIndex]}
                isLocationToolActive={isLocationToolActive}
                onLocationSet={() => {
                  setIsLocationToolActive(false);  // Just deactivate the tool
                }}
              />
            </View>
          </ScrollView>
        </View>

        {/* Right Sidebar - Now Scrollable */}
        <ScrollView 
          style={customStyles.sidebar}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          <View style={customStyles.sidebarContent}>
            {/* Quality Guide Accordion - Open by Default */}
            <View>
              <TouchableOpacity 
                onPress={() => setShowQualityGuide(!showQualityGuide)}
              >
                <Text style={customStyles.sectionTitle}>Quality Guide</Text>
                <Ionicons 
                  name={showQualityGuide ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#333" 
                />
              </TouchableOpacity>
              
              {showQualityGuide && (
                <View>
                  <View style={customStyles.productImageContainer}>
                    {selectedItem ? (
                      <Image 
                        source={{ uri: selectedItem.image || 'https://via.placeholder.com/150' }}
                        style={customStyles.productImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={customStyles.placeholderImage}>
                        <Ionicons name="image-outline" size={50} color="#ccc" />
                      </View>
                    )}
                  </View>
                  
                  <View style={customStyles.qualityGuide}>
                    <Text style={customStyles.guideTitle}>Quality Tips:</Text>
                    <Text style={customStyles.guideText}>
                      • Check for freshness and expiration dates{'\n'}
                      • Look for organic certifications{'\n'}
                      • Inspect packaging for damage{'\n'}
                      • Compare prices between stores
                    </Text>
                  </View>
                </View>
              )}
            </View>

                <View>
                  {/* Product Navigation */}
                  <View style={customStyles.productNav}>
                    <TouchableOpacity 
                      style={[
                        customStyles.navButton,
                        currentItemIndex === 0 && customStyles.navButtonDisabled
                      ]}
                      onPress={handlePrevious}
                      disabled={currentItemIndex === 0}
                    >
                      <Ionicons name="chevron-back" size={24} color="#0766AD" />
                      <Text style={customStyles.navButtonText}>Previous</Text>
                    </TouchableOpacity>
                    
                    <View style={customStyles.productCounter}>
                      <Text style={customStyles.counterText}>
                        {shoppingList.length > 0 ? `${currentItemIndex + 1} / ${shoppingList.length}` : '0 / 0'}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[
                        customStyles.navButton,
                        currentItemIndex === shoppingList.length - 1 && customStyles.navButtonDisabled
                      ]}
                      onPress={handleNext}
                      disabled={currentItemIndex === shoppingList.length - 1}
                    >
                      <Text style={customStyles.navButtonText}>Next</Text>
                      <Ionicons name="chevron-forward" size={24} color="#0766AD" />
                    </TouchableOpacity>
                  </View>

                  {/* Next Store Button */}
                  <TouchableOpacity style={customStyles.nextStoreButton}>
                    <Ionicons name="storefront-outline" size={20} color="white" />
                    <Text style={customStyles.nextStoreText}>Try Next Store</Text>
                  </TouchableOpacity>
                </View>

            {/* Product List Accordion */}
            {renderShoppingList()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const customStyles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  mapWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  floatingButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    flexDirection: 'row',
    gap: 16,
  },
  floatingFloorButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  floorButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floorButtonActive: {
    backgroundColor: '#609966',
    borderColor: '#609966',
  },
  floorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  floorButtonTextActive: {
    color: 'white',
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  sidebar: {
    flex: 1,
    minWidth: 280,
    maxWidth: 450, 
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sidebarContent: {
    padding: 20,
    gap: 10,
  },
  productSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityGuide: {
    marginTop: 5,
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0766AD',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0766AD',
    marginBottom: 6,
  },
  guideText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  controlsSection: {
    gap: 12,
  },
  productNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0766AD',
    backgroundColor: 'white',
    gap: 4,
  },
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  navButtonText: {
    fontSize: 14,
    color: '#0766AD',
    fontWeight: '600',
  },
  productCounter: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0766AD',
  },
  nextStoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#609966',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  nextStoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  productList: {
    maxHeight: 350,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  productItemActive: {
    backgroundColor: '#e0f7fa',
    borderColor: '#81d4fa',
    borderWidth: 1,
  },
  productItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productItemInfo: {
    flex: 1,
  },
  productItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productItemLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  toolButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toolButtonActive: {
    backgroundColor: '#0766AD',
    borderColor: '#0766AD',
  },
};