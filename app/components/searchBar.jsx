/* eslint-disable prettier/prettier */
// app/components/SearchBar.jsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ⬅️ import router

export default function SearchBar({ placeholder = "What are you looking for?" }) {
  const [text, setText] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="filter-outline" size={22} color="#000" />
      </TouchableOpacity>

      {/* Search Box with Icon */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchBox}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => router.push("/searchResult")} // ⬅️ ENTER goes to SearchResults
          returnKeyType="search"
        />
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  filterButton: {
    padding: 8,
    height: 42,
    width: 42,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flex: 1,
    position: "relative",
  },
  searchBox: {
    height: 42,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
