// app/modules/_layout.js
import { useAuth } from "../context/AuthContext";
import { Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  // Show loading while auth context is initializing
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // The AuthContext will handle redirects automatically
  // This layout just renders protected content when user is authenticated
  return <Slot />; // renders nested routes like /modules/stallManagement/...
}
