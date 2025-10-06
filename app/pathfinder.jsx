/* eslint-disable prettier/prettier */
import React, { useRef } from 'react';
import {
  ScrollView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import styles from './assets/Styles/Maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapSVG from './utils/MapSVG';
import { useSelection } from './context/SelectionContext'; 
import SearchBar from "./components/searchBar";
import { LinearGradient } from "expo-linear-gradient";
const window = Dimensions.get('window');
const drawerHeight = window.height * 0.6;

export default function HomeScreen() {
  const { selectedItem } = useSelection();
  console.log('[Map.js] selectedItem:', selectedItem);
  const router = useRouter();
  const initialDrawerOffset = window.height - 150;
  const panY = useRef(new Animated.Value(initialDrawerOffset)).current;

  const resetPositionAnim = Animated.timing(panY, {
    toValue: window.height - drawerHeight,
    duration: 300,
    useNativeDriver: false,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: initialDrawerOffset,
    duration: 300,
    useNativeDriver: false,
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = gestureState.dy + window.height - drawerHeight;
        if (newY > window.height - drawerHeight && newY < window.height) {
          panY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeAnim.start();
        } else {
          resetPositionAnim.start();
        }
      },
    })
  ).current;

  return (
    <View>
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
      
      {/* Map & Buttons Wrapper */}
      <View style={customStyles.mapWrapper}>
        {/* Floating vertical button group */}
        <View style={customStyles.floatingButtons}>
          <TouchableOpacity style={customStyles.floatingButton}>
            <Text style={customStyles.buttonNumber}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={customStyles.floatingButton}>
            <Text style={customStyles.buttonNumber}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={customStyles.floatingButton}>
            <Text style={customStyles.buttonNumber}>3</Text>
          </TouchableOpacity>
        </View>
      
        {/* Zoomable, scrollable map */}
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
            <MapSVG width={window.width * 3} height={window.height * 3} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const customStyles = {
  mapWrapper: {
    margin: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden', // to clip content to the rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    height: window.height * 0.7,
  },
  floatingButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  floatingButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
  },
  buttonNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
};