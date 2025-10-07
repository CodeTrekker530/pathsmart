import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../components/Sidebar";

const SIDEBAR_WIDTH_COLLAPSED = 60;
const SIDEBAR_WIDTH_EXPANDED = 220;
const ICON_SIZE = 24;

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // account editable fields
  const [fullName, setFullName] = useState("Joseph Frondozo Martin");
  const [username, setUsername] = useState("username1");

  // change form fields
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sidebar animation functions
  const expandSidebar = () => setSidebarExpanded(true);
  const collapseSidebar = () => setSidebarExpanded(false);

  const handleLogout = () => {
    logout();
    router.replace("/screens/loginScreen");
  };

  const handleOpenChangeForm = () => {
    setShowChangeForm(true);
    setPhone("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmitChange = () => {
    // TODO: submit logic
    setShowChangeForm(false);
    setShowAccountModal(false);
  };

  return (
    <View style={styles.root}>
      {/* Animated Sidebar (reused) */}
      <Sidebar onAccountPress={() => setShowAccountModal(true)} />

      {/* Main Content */}
      <View style={styles.main}>
        <Text style={styles.header}>Welcome Abellano!</Text>
        <Text style={styles.subheader}>Manage your business</Text>
        <View style={styles.divider} />

        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Image
              source={require("../../../assets/barbershop.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>The Classic Cut</Text>
                <Text style={styles.cardType}>Barbershop</Text>
              </View>
              <Text style={styles.cardLocation}>
                Ground Floor, Barbershop Section
              </Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() =>
                  router.push({
                    pathname:
                      "/modules/storeManagement/screens/ManageBusiness",
                    params: { id: "barbershop1" },
                  })
                }
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Image
              source={require("../../../assets/vegetable.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Abellano Store</Text>
                <Text style={styles.cardType}>Vegetable</Text>
              </View>
              <Text style={styles.cardLocation}>
                Ground Floor, Vegetable Section
              </Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() =>
                  router.push({
                    pathname:
                      "/modules/storeManagement/screens/ManageBusiness",
                    params: { id: "vegetable1" },
                  })
                }
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Account / Change Password Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              setShowAccountModal(false);
              setShowChangeForm(false);
            }}
          />
          <View style={styles.accountModalBox}>
            {!showChangeForm ? (
              <>
                <View style={styles.accountModalHeaderRow}>
                  <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                    <Text style={styles.accountModalBack}>{"<"}</Text>
                  </TouchableOpacity>
                  <Text style={styles.accountModalTitle}>Account</Text>
                </View>

                <View style={styles.accountModalContent}>
                  <View style={styles.accountModalRow}>
                    <Text style={styles.accountModalLabel}>Full Name</Text>
                    <TextInput
                      style={styles.accountModalValueInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.accountModalRow}
                    onPress={handleOpenChangeForm}
                  >
                    <Text style={styles.accountModalLabel}>Phone Number</Text>
                    <Text style={styles.accountModalValue}>09476373794</Text>
                    <Text style={styles.accountModalArrow}>{">"}</Text>
                  </TouchableOpacity>

                  <View style={styles.accountModalRow}>
                    <Text style={styles.accountModalLabel}>Username</Text>
                    <TextInput
                      style={styles.accountModalValueInput}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Username"
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.accountModalRow}
                    onPress={handleOpenChangeForm}
                  >
                    <Text style={styles.accountModalLabel}>
                      Change Password
                    </Text>
                    <Text style={styles.accountModalArrow}>{">"}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.accountModalHeaderRow}>
                  <TouchableOpacity onPress={() => setShowChangeForm(false)}>
                    <Text style={styles.accountModalBack}>{"<"}</Text>
                  </TouchableOpacity>
                  <Text style={styles.accountModalTitle}>Change Password</Text>
                </View>

                <View style={styles.changeFormContent}>
                  <FormInput
                    label="New Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="New Phone Number"
                  />
                  <FormInput
                    label="Old Password"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    secure
                  />
                  <FormInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    secure
                  />
                  <FormInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    secure
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitChange}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Reusable small input component */
function FormInput({ label, value, onChangeText, placeholder, secure }) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputFieldBox}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor="#888"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
  },

  /* Main */
  main: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 4,
    color: "#222",
  },
  subheader: {
    color: "#666",
    marginBottom: 16,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },

  /* Cards */
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    width: 300,
    paddingBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  cardImage: {
    width: 260,
    height: 140,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  cardContent: {
    width: "100%",
    paddingHorizontal: 18,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 17,
  },
  cardType: {
    color: "#6BA06B",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "right",
    flexShrink: 0,
    marginLeft: 8,
  },
  cardLocation: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  manageButton: {
    backgroundColor: "#6BA06B",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 6,
  },
  manageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  accountModalBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 400,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  accountModalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  accountModalBack: {
    fontSize: 22,
    color: "#222",
    marginRight: 8,
    fontWeight: "500",
  },
  accountModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  accountModalContent: {
    marginTop: 4,
  },
  accountModalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 12,
  },
  accountModalLabel: {
    fontSize: 15,
    color: "#222",
  },
  accountModalValue: {
    fontSize: 15,
    color: "#999",
    marginLeft: 12,
    flexShrink: 1,
  },
  accountModalValueInput: {
    fontSize: 15,
    color: "#222",
    marginLeft: 12,
    flexShrink: 1,
    textAlign: "right",
    paddingVertical: 2,
    minWidth: 140,
  },
  accountModalArrow: {
    fontSize: 18,
    color: "#bbb",
    marginLeft: 12,
  },

  /* Change form */
  changeFormContent: {
    marginTop: 4,
  },
  inputBox: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    color: "#222",
    marginBottom: 4,
    fontWeight: "500",
  },
  inputFieldBox: {
    backgroundColor: "#e3ecd7",
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  inputField: {
    height: 40,
    fontSize: 14,
    color: "#222",
  },
  submitButton: {
    backgroundColor: "#6BA06B",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});