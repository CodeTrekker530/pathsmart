import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

const SIDEBAR_WIDTH = 56;
const ICON_SIZE = 28;

export default function ManageBarbershop() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleBack = () => router.back();
  const handleAddListing = () => router.push('/modules/storeManagement/screens/AddListings');
  const handleViewListings = () => router.push('/modules/storeManagement/screens/ViewListings');
  const handleLogout = () => { logout(); router.replace('/screens/loginScreen'); };

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.topGroup}>
          <Image source={require('../../../assets/logo.png')} style={[styles.sidebarIcon, styles.logoIcon]} />
          <TouchableOpacity style={styles.iconBtn}>{/* account modal placeholder */}
            <Image source={require('../../../assets/user-account.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.middleGroup}>
          <TouchableOpacity onPress={handleLogout}>
            <Image source={require('../../../assets/logout.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.card}>
            <Image source={require('../../../assets/barbershop.png')} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardContent}>
              <View style={styles.cardTextRow}>
                <Text style={styles.cardTitle}>The Classic Cut</Text>
                <Text style={styles.cardType}>Barbershop</Text>
              </View>
              <Text style={styles.cardLocation}>Ground Floor, Barbershop Section</Text>
              <Text style={styles.cardDetails}># Block 1, Stall 2</Text>

              <View style={styles.cardActionsRow}>
                <TouchableOpacity onPress={handleAddListing}>
                  <Text style={styles.addListingLink}>Add your listings</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.viewListingsButton} onPress={handleViewListings}>
                <Feather name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.viewListingsButtonText}>View Listings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#222' },
  sidebar: { width: SIDEBAR_WIDTH, backgroundColor: '#0B72B9', borderLeftWidth: 3, borderLeftColor: '#8B5CF6', paddingTop: 18, paddingBottom: 18, flexDirection: 'column' },
  topGroup: { alignItems: 'center' },
  middleGroup: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconBtn: { marginTop: 22 },
  sidebarIcon: { width: ICON_SIZE, height: ICON_SIZE, resizeMode: 'contain', marginVertical: 0 },
  logoIcon: { width: ICON_SIZE + 6, height: ICON_SIZE + 6, marginBottom: 0 },
  main: { flex: 1, backgroundColor: '#fff', padding: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginLeft: 2 },
  backButton: { marginRight: 14, padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  centerContent: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' },
  card: { backgroundColor: '#fff', borderRadius: 16, width: 300, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, overflow: 'hidden', alignItems: 'center', marginTop: 12, marginBottom: 12 },
  cardImage: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, width: '100%' },
  cardTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#222' },
  cardType: { fontSize: 16, color: '#666', fontWeight: '500', textAlign: 'right', flex: 1 },
  cardLocation: { fontSize: 15, color: '#888', marginBottom: 2 },
  cardDetails: { fontSize: 14, color: '#888', marginBottom: 8 },
  cardActionsRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  addListingLink: { color: '#222', textDecorationLine: 'underline', fontSize: 15 },
  viewListingsButton: { flexDirection: 'row', backgroundColor: '#6BA06B', borderRadius: 8, paddingVertical: 8, justifyContent: 'center', alignItems: 'center', width: '100%' },
  viewListingsButtonText: { color: '#fff', fontWeight: '600', fontSize: 18 },
});
