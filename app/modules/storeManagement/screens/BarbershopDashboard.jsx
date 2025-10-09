import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

/*
  BarbershopDashboard: A dedicated screen for the Barbershop business.
  Later you can hydrate this with real data (services, staff, bookings, etc.).
*/
export default function BarbershopDashboard() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}> 
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Image
            source={require("../../../assets/barbershop.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroInfo}>
            <Text style={styles.shopName}>The Classic Cut</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Category:</Text>
              <Text style={styles.metaValue}>Barbershop</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Location:</Text>
              <Text style={styles.metaValue}>Ground Floor, Barbershop Section</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Stall:</Text>
              <Text style={styles.metaValue}># Block 1, Stall 2</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <ActionButton label="View Listings" onPress={() => router.push("/modules/storeManagement/screens/ViewListings")} />
            <ActionButton label="Add Listing" onPress={() => router.push("/modules/storeManagement/screens/AddListings")} />
            <ActionButton label="Manage Business" onPress={() => router.push("/modules/storeManagement/screens/ManageBusiness")} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusLine}>Active Services: 5</Text>
            <Text style={styles.statusLine}>Pending Appointments: 2</Text>
            <Text style={styles.statusLine}>Staff On Duty: 3</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Analytics / charts placeholder</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Text style={styles.actionBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  headerBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 36, paddingTop: 32 },
  backBtn: { marginRight: 12 },
  backText: { fontSize: 22, fontWeight: "500", color: "#222" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  content: { padding: 36, paddingTop: 12 },

  heroCard: { backgroundColor: "#fff", borderRadius: 12, flexDirection: "row", padding: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, marginBottom: 28 },
  heroImage: { width: 220, height: 140, borderRadius: 8, marginRight: 18 },
  heroInfo: { flex: 1 },
  shopName: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#222" },
  metaRow: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap" },
  metaLabel: { fontWeight: "600", color: "#555", marginRight: 6 },
  metaValue: { color: "#222" },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#222" },

  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionBtn: { backgroundColor: "#0B72B9", paddingVertical: 14, paddingHorizontal: 18, borderRadius: 8 },
  actionBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  statusCard: { backgroundColor: "#f1f5f3", padding: 16, borderRadius: 10 },
  statusLine: { color: "#333", marginBottom: 4, fontSize: 13 },

  placeholderCard: { backgroundColor: "#f7f7f7", padding: 24, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#888", fontSize: 12 },
});
