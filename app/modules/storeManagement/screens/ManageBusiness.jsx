import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { businesses } from './businessData';
import { useSelection } from '../../../context/SelectionContext';

const SIDEBAR_WIDTH_COLLAPSED = 60;
const SIDEBAR_WIDTH_EXPANDED = 220;
const ICON_SIZE = 24;

export default function ManageBusiness() {
  const router = useRouter();
  const { logout } = useAuth();
  const params = useLocalSearchParams();
  const id = params.id || 'vegetable1';
  const business = businesses[id] || null;
  const { setCurrentBusinessId } = useSelection();
  React.useEffect(() => {
    setCurrentBusinessId(id);
  }, [id, setCurrentBusinessId]);

  const handleBack = () => {
    router.back();
  };

  const handleAddListing = () => {
    router.push({
      pathname: '/modules/storeManagement/screens/AddListings',
      params: { id },
    });
  };

  const handleViewListings = () => {
    router.push({
      pathname: '/modules/storeManagement/screens/ViewListings',
      params: { id },
    });
  };

  const handleLogout = () => {
    logout();
    router.replace('/screens/loginScreen');
  };

  return (
    <View style={styles.root}>
      {/* Animated Sidebar (reused) */}
      <Sidebar onAccountPress={() => { /* placeholder: could open account modal */ }} />

      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        <View style={styles.centerContent}>
          {!business ? (
            <Text style={{ color: '#222' }}>Business not found.</Text>
          ) : (
            <View style={styles.card}>
              <Image source={business.image} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <View style={styles.cardTextRow}>
                  <Text style={styles.cardTitle}>{business.name}</Text>
                  <Text style={styles.cardType}>{business.category}</Text>
                </View>
                <Text style={styles.cardLocation}>{business.location}</Text>
                <Text style={styles.cardDetails}>{business.stall}</Text>
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
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222',
  },

  /* Main */
  main: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginLeft: 2,
  },
  backButton: {
    marginRight: 14,
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  /* Inlined card styles (previously in BusinessManageCard) */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    width: '100%',
  },
  cardTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  cardType: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  cardLocation: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
  },
  cardDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  addListingLink: {
    color: '#222',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  viewListingsButton: {
    flexDirection: 'row',
    backgroundColor: '#6BA06B',
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  viewListingsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});