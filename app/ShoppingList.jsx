/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProductAndServices } from "../backend/server";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const imageMap = {
  "image.png": require("./assets/image.png"),
  // Add more mappings as needed
};

export default function ShoppingList() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const router = useRouter();

  const filters = ['All', 'Products', 'Stores', 'Services'];

  useEffect(() => {
    let debounceTimer = setTimeout(() => {
      fetchProductAndServices(search).then(setSearchResults);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const addToList = (item) => {
    if (!listItems.some(i => i.id === item.id)) {
      setListItems([...listItems, item]);
    }
  };

  const removeFromList = (id) => {
    setListItems(listItems.filter(item => item.id !== id));
  };

  // Filter search results based on selected filter
  const filteredResults = searchResults.filter(item => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Products') return item.type === 'Product';
    if (selectedFilter === 'Stores') return item.type === 'Stall';
    if (selectedFilter === 'Services') return item.category?.toLowerCase().includes('service');
    return true;
  });

  return (
    <>
      {/* Top HUD (outside the styled container) */}
      <LinearGradient
        colors={["#0766AD", "#BCE2BD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { marginBottom: 0 }]}
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
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageHeader}>Shopping List</Text>
        </View>
        <View style={styles.row}>
          {/* Search & Results */}
          <View style={styles.column}>
            <Text style={styles.subHeader}>Search</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for items to add..."
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
            <FlatList
              data={filteredResults}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => addToList(item)}
                >
                  <Image
                    source={imageMap[item.image] || imageMap["image.png"]}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.resultText}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={22} color="#249B3E" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No results found.</Text>
              }
              style={styles.resultsList}
            />
          </View>
          {/* Shopping List */}
          <View style={styles.column}>
            <Text style={styles.subHeader}>Your List</Text>
            <FlatList
              data={listItems}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Image
                    source={imageMap[item.image] || imageMap["image.png"]}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFromList(item.id)}>
                    <Ionicons name="close-circle-outline" size={22} color="#d33" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items in your list.</Text>
              }
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // marginBottom: 0, // ensure no margin here
  },
  headerRowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  logo_name: {
    fontSize: 20,
    fontWeight: "450",
    color: "#fff",
    marginRight: 10,
  },
  loginButton: {
    padding: 8,
    height: 42,
    width: 126,
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  pageHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
    color: "#222",
    textAlign: "Left",
    marginTop: 20,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 24,
  },
  column: {
    flex: 1,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#249B3E",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  filters: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 10,
    gap: 6,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilter: {
    backgroundColor: '#2c6e49',
    borderColor: '#2c6e49',
  },
  activeFilterText: {
    color: '#fff',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsList: {
    flexGrow: 0,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "flex-start",
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "flex-start",
    gap: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  itemCategory: {
    fontSize: 12,
    color: "#666",
  },
  resultText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // optional, for spacing between icon and text
  },
});