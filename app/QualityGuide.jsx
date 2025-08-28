import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QualityGuide() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Quality Guide page (Route 2)</Text>
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