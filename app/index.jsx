/* eslint-disable prettier/prettier */
// app/screens/home.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768; // responsive breakpoint

  return (
    <LinearGradient
      colors={["#0766AD", "#BCE2BD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Top HUD (stays at top, same gradient) */}
      <LinearGradient
        colors={["#0766AD", "#BCE2BD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {/* Logo */}
        <Image
          source={require("./assets/logo.png")} // replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.logo_name}>PathSmart</Text>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>

        {/* Search Box with Icon */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchBox}
            placeholder="What are you looking for?"
            placeholderTextColor="#999"
          />
          <Ionicons
            name="search-outline"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
        </View>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={{ fontWeight: "600", color: "#0766AD" }}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Scrollable Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Hero Section */}
        <View
          style={[
            styles.heroSection,
            isSmallScreen && styles.heroSectionStacked,
          ]}
        >
          {/* Left side: text */}
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              Find Your Way Faster with PathSmart
            </Text>
            <Text style={styles.heroSubtitle}>
              Your personal guide inside Naga City People’s Mall.
            </Text>
            <Text style={styles.heroSubtitle2}>
              From fresh produce to household needs, PathSmart shows you the
              quickest route to your store — no more getting lost in the crowd.
            </Text>

            {/* Buttons in a row */}
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.bigButton, styles.tutorialButton]}
              >
                <Text style={[styles.bigButtonText, styles.tutorialText]}>
                  Tutorial
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bigButton}>
                <Text style={styles.bigButtonText}>Create Shopping List</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right side: image (hidden on small screens) */}
          {!isSmallScreen && (
            <Image
              source={require("./assets/logo.png")} // replace with your picture
              style={styles.heroImage}
            />
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  searchWrapper: {
    flex: 1,
    position: "relative",
    marginHorizontal: 5,
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
  mainContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logo_name: {
    fontSize: 20,
    fontWeight: "450",
    color: "#fff",
  },
  loginButton: {
    padding: 8,
    height: 42,
    width: 126,
    borderRadius: 10,
    marginLeft: 5,
    fontSize: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    padding: 8,
    height: 42,
    width: 42,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bigButton: {
    height: 50,
    minWidth: 150,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#249B3E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bigButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  tutorialButton: {
    backgroundColor: "#fff",
  },
  tutorialText: {
    color: "#000",
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  heroSectionStacked: {
    flexDirection: "column",
  },
  heroText: {
    flex: 1,
    paddingRight: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f0f0f0",
    marginBottom: 6,
  },
  heroSubtitle2: {
    fontSize: 14,
    color: "#e0e0e0",
    lineHeight: 20,
    marginBottom: 15,
  },
  heroButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  heroImage: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
});
