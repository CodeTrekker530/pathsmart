/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

export default function QualityGuide() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([
    { label: "All", value: "all" },
    { label: "Fish", value: "fish" },
    { label: "Meat", value: "meat" },
    { label: "Vegetables", value: "vegetables" },
  ]);

  return (
    <>
      {/* Top HUD */}
      <LinearGradient
        colors={["#0766AD", "#BCE2BD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRowSpace}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={require("./assets/logo.png")} style={styles.logo} />
            <Text style={styles.logo_name}>PathSmart</Text>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("/screens/loginScreen");
            }}
          >
            <Text style={{ fontWeight: "600", color: "#0766AD" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        {/* Back + Title */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageHeader}>Quality Guide</Text>
        </View>

        {/* Search + Filter Dropdown */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search in quality guide..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <DropDownPicker
            open={open}
            value={selectedFilter}
            items={filters}
            setOpen={setOpen}
            setValue={setSelectedFilter}
            setItems={setFilters}
            placeholder="Filter"
            style={styles.dropdown}
            containerStyle={{ width: 160 }}
            searchable={true}
            searchPlaceholder="Type to search..."
            zIndex={1000}
            zIndexInverse={3000}
          />
        </View>

        <View style={styles.divider} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* General Guide Card */}
        <View style={styles.card}>
          <View style={styles.generalGuideRow}>
            {/* Column 1: Image + Name */}
            <View style={styles.columnImage}>
              <Image
                source={require("./assets/image.png")}
                style={styles.guideImage}
              />
              <Text style={styles.guideName}>Fish</Text>
            </View>

            {/* Column 2: First two tips */}
            <View style={styles.columnTips}>
              <Text style={styles.tip}>1. Eyes should be clear, not cloudy.</Text>
              <Text style={styles.tip}>2. Gills must be bright red, not dull.</Text>
            </View>

            {/* Column 3: Last two tips */}
            <View style={styles.columnTips}>
              <Text style={styles.tip}>3. Flesh should be firm, not soft.</Text>
              <Text style={styles.tip}>4. Smell should be fresh, not sour.</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Specific Items Grid */}
        <View style={styles.itemsGrid}>
          <View style={styles.itemCard}>
            <Image
              source={require("./assets/image.png")}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>Lettuce</Text>
          </View>
          <View style={styles.itemCard}>
            <Image
              source={require("./assets/image.png")}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>Eggplant</Text>
          </View>
          <View style={styles.itemCard}>
            <Image
              source={require("./assets/image.png")}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>Banana</Text>
          </View>
          {/* add more items... */}
        </View>
      </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 3,
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
    fontWeight: "600",
    color: "#fff",
  },
  loginButton: {
    padding: 8,
    height: 42,
    width: 126,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 30,
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  dropdown: {
    borderRadius: 8,
    borderColor: "#ccc",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  generalGuideRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // <--- center vertically
  },
  columnImage: {
    flex: 1,
    alignItems: "center",
  },
  columnTips: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  guideImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 8,
  },
  guideName: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#0766AD",
  },
  tip: {
    fontSize: 20,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: "30%", // 3 per row
    alignItems: "center",
    marginBottom: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
