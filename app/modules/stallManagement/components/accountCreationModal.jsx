import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AccountCreationModal({
  visible,
  credentials,
  onContinue,
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.success}>Successful!</Text>
        <Text style={styles.desc}>
          Stall Owner account credentials have been successfully created.
        </Text>
        <Text style={styles.label}>
          Username: <Text style={styles.value}>{credentials.username}</Text>
        </Text>
        <Text style={styles.label}>
          Password: <Text style={styles.value}>{credentials.password}</Text>
        </Text>
        <Text style={styles.warning}>
          ⚠️ Make sure to save your credentials before proceeding — you
          won&apos;t be able to access them again once you continue.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 32,
    width: 420,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  success: {
    fontSize: 22,
    color: "#5c9a6c",
    fontWeight: "bold",
    marginBottom: 10,
  },
  desc: {
    color: "#888",
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontWeight: "normal",
    fontSize: 16,
  },
  warning: {
    color: "red",
    fontSize: 12,
    marginVertical: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#5c9a6c",
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
