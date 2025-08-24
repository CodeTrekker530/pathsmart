// app/screens/home.jsx
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.header}>
        {/* Logo */}
        <Image
          source={require("./assets/logo.png")} // replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.logo_name}>PathSmart</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>
        {/* Search Box */}
        <TextInput
          style={styles.searchBox}
          placeholder="What are you looking for?"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/screens/loginScreen")}
        >
          Login
        </TouchableOpacity>
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
    backgroundColor: "#0766AD",
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
    height: 42,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginHorizontal: 5,
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
    backgroundColor: "#fff", // darker shade of header for contrast
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    padding: 8,
    height: 42,
    width: 42,
    borderRadius: 10,
    marginLeft: 15,
    backgroundColor: "#fff", // darker shade of header for contrast
    justifyContent: "center",
    alignItems: "center",
  },
});
