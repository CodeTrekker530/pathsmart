/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import styles from './assets/Styles/SearchStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchProductAndServices } from '../backend/server';
import { useSelection } from './context/SelectionContext'; 
import { LinearGradient } from 'expo-linear-gradient';
import ToolsDropdown from './components/ToolsDropdown'; // adjust path if needed

let debounceTimer;

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [data, setData] = useState([]);
  const { setSelectedItem } = useSelection();
  const [toolsDropdownVisible, setToolsDropdownVisible] = useState(false);

  const filters = ['All', 'Products', 'Stores', 'Services'];

  const imageMap = {
    'image.png': require('./assets/image.png'),
  };

  const loadData = async (searchTerm = '') => {
      const results = await fetchProductAndServices(searchTerm);
      setData(results);
    };
    // Load once on mount
    useEffect(() => {
      loadData();
    }, []);

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      loadData(search);
    }, 300); 
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const filteredData = data.filter(item => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Products') return item.type === 'Product';
    if (selectedFilter === 'Stores') return item.type === 'Stall';
    if (selectedFilter === 'Services') return item.category.toLowerCase().includes('service');
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Top HUD (stays at top, same gradient) */}
      <LinearGradient
        colors={["#0766AD", "#BCE2BD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRowSpace}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("./assets/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.logo_name}>PathSmart</Text>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => { router.push("/screens/loginScreen"); }}
          >
            <Text style={{ fontWeight: "600", color: "#0766AD" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {/* Main Content */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Search</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for?"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filters}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results List */}
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => {
                console.log('Tapped item:', item);
                console.log('Node IDs:', item.node_id);
                setSelectedItem(item);
                router.push('/pathfinder'); 
              }}
            >
              <Image source={imageMap[item.image]} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      {/* Floating Tools Button */}
      <View style={{
        position: "absolute",
        bottom: 30,
        right: 30,
        zIndex: 1000,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: 30,
            width: 56,
            height: 56,
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={() => setToolsDropdownVisible(true)}
        >
          <Ionicons name="construct-outline" size={28} color="#0766AD" />
        </TouchableOpacity>
      </View>
      <ToolsDropdown
        visible={toolsDropdownVisible}
        onClose={() => setToolsDropdownVisible(false)}
        dropdownStyle={{
          position: "absolute",
          bottom: 100, // adjust as needed (should be > button height + margin)
          right: 30,
        }}
      />
    </View>
  );
}
