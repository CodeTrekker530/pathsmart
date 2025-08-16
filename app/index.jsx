// app/screens/home.jsx
import React from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.header}>
        {/* Logo */}
        <Image
          source={require("./assets/logo.png")} // replace with your logo path
          style={styles.logo}
        />
        {/* Search Box */}
        <TextInput
          style={styles.searchBox}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.welcome}>Welcome to the Home Screen!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});
