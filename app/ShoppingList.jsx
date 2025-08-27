import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ShoppingList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Shopping List page (Route 1)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    color: "#222",
  },
});