import { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

export default function LoginPage() {
  const [userType, setUserType] = useState("Admin");
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // console.log("Login attempted with:", { userType, username, password });
    router.push("/modules/stallManagement/screens/adminInterface");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setShowDropdown(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Image
                style={styles.logo}
                source={require("../assets/logo.png")}
              />
            </View>
            <Text style={styles.logoName}>PathSmart</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.systemTitle}>PathSmart System</Text>
            <Text style={styles.loginInstructions}>
              Enter your username and password to continue. Please log in as
              either an Administrator or a Stall Owner.
            </Text>

            {/* Login Type Selector */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>Login as</Text>
                <Image
                  source={require("../assets/dropdown-arrow.png")}
                  style={styles.iconSmall}
                />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserType("Admin");
                      setShowDropdown(false);
                    }}
                  >
                    <Text>Administrator</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserType("StallOwner");
                      setShowDropdown(false);
                    }}
                  >
                    <Text>Stall Owner</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Image
                source={require("../assets/user-icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Image
                source={require("../assets/lock-icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={
                    showPassword
                      ? require("../assets/eye-icon.png")
                      : require("../assets/eye-off-icon.png")
                  }
                  style={styles.iconSmall}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.backgroundImagePlaceholder}>
          <Image
            source={require("../assets/login-bg.png")}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: Platform.OS === "web" ? 40 : 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logoBox: {
    // width: 36,
    // height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  logoName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    // alignSelf: "center",
  },
  systemTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  loginInstructions: {
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  dropdownContainer: {
    marginBottom: 15,
    position: "relative",
    zIndex: 1,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownText: {
    color: "#555",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  iconSmall: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backgroundImagePlaceholder: {
    flex: 2,
    width: "100%",
    backgroundColor: "#f0f0f0",
    display: Platform.OS === "web" ? "flex" : "none",
    position: "relative", // For absolute positioning of children
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4 )", // Black with 50% opacity
  },
});
