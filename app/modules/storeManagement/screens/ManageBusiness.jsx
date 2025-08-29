import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ManageBusiness() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleAddListing = () => {
    router.push('/modules/storeManagement/screens/AddListings');
  };

  const handleViewListings = () => {
    router.push('/ViewListings');
  };

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarIcons}>
          <Image source={require('../../../assets/logo.png')} style={[styles.sidebarIcon, {tintColor: undefined}]} />
          <Image source={require('../../../assets/user-account.png')} style={styles.sidebarIcon} />
          <TouchableOpacity onPress={() => router.replace('/screens/loginScreen')}>
            <Image source={require('../../../assets/logout.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.centerContent}>
          <View style={styles.card}>
            <Image
              source={require('../../../assets/vegetable.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardTextRow}>
                <Text style={styles.cardTitle}>Abellano Store</Text>
                <Text style={styles.cardType}>Vegetable</Text>
              </View>
              <Text style={styles.cardLocation}>Ground Floor, Vegetable Section</Text>
              <Text style={styles.cardDetails}># Block 1, Stall 2</Text>
              <View style={styles.cardActionsRow}>
                <TouchableOpacity onPress={handleAddListing}>
                  <Text style={styles.addListingLink}>Add your listings</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.viewListingsButton} onPress={() => router.push('/modules/storeManagement/screens/ViewListings')}>
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
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222',
  },
  sidebar: {
    width: 80,
    backgroundColor: '#0B72B9',
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  sidebarIcons: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sidebarIcon: {
    width: 48,
    height: 48,
    marginVertical: 24,
  },
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
    marginBottom: 0,
    alignSelf: 'center',
    overflow: 'hidden',
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
    marginHorizontal: 0,
    marginTop: 0,
    width: '100%',
  },
  viewListingsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});