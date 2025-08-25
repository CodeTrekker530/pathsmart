// app/SearchResults.jsx
import { View, Text, StyleSheet } from "react-native";

export default function SearchResults() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Search Results Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
