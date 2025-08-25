/* eslint-disable prettier/prettier */
// app/screens/home.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "./components/searchBar";
import { useRouter } from "expo-router"; // ⬅️ import router


export default function Home() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768; // responsive breakpoint
  const router = useRouter();

  return (
    <>
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

        <SearchBar />  {/* reused here */}

        <TouchableOpacity style={styles.loginButton}
          onPress={() => { router.push("/screens/loginScreen"); }}>
          <Text style={{ fontWeight: "600", color: "#0766AD" }}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

    <ScrollView contentContainerStyle={styles.mainContent}>

        <View style={styles.resultsHeaderRow}>
            <Text style={styles.heroTitle}>
            Search Results for &quot;&quot;
            </Text>
            <View style={styles.filterTabs}>
            <TouchableOpacity style={styles.tabButton}>
                <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
                <Text>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
                <Text>Stores</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton}>
                <Text>Services</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View style={{ height: 1, backgroundColor: "#ccc", marginVertical: 10 }} />
    </ScrollView>
    </>

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
  mainContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    heroTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 10,
  },
  resultsHeaderRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
  },
  filterTabs: {
  flexDirection: "row",
  gap: 8,
  },
tabButton: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20, // makes it pill/radial
  backgroundColor: "#e6f0fa",
  marginLeft: 8,
  borderWidth: 1,
  borderColor: "#0766AD",
  minWidth: 60,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#0766AD",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
},
});