import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ViewListings() {
  const router = useRouter();

  // Sample listing data
  const [listings, setListings] = React.useState([]);

  const handleBack = () => {
    router.back();
  };

  const handleAddListings = () => {
    router.push('/modules/storeManagement/screens/AddListings');
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
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchInput}>Search listing</Text>
            <Image source={require('../../../assets/search.png')} style={styles.searchIcon} />
          </View>
          <TouchableOpacity style={styles.filterRow}>
            <Image source={require('../../../assets/filter-menu.png')} style={styles.filterIcon} />
            <Text style={styles.filterText}>Filter by category</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listingsRow}>
          {listings.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.noListingsText}>No listings have been added yet. Please add a listing to get started.</Text>
              <TouchableOpacity style={styles.addListingsButton} onPress={handleAddListings}>
                <Text style={styles.addListingsButtonText}>Add Listings</Text>
              </TouchableOpacity>
            </View>
          ) : (
            listings.map((listing, idx) => (
              <View key={idx} style={styles.card}>
                <Image source={listing.image} style={styles.cardImage} />
                <Text style={styles.cardName}>{listing.name}</Text>
                <Text style={styles.cardCategory}>{listing.category}</Text>
                <View style={styles.cardButtonRow}>
                  <TouchableOpacity style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
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
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  searchInputContainer: {
    backgroundColor: '#E3F0DF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    fontSize: 15,
    color: '#222',
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  listingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 32,
    marginLeft: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 320,
    marginRight: 32,
    marginBottom: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
    objectFit: 'cover',
  },
  cardName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
    marginTop: 8,
    color: '#222',
    marginLeft: 16,
  },
  cardCategory: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 16,
  },
  cardButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 32,
  },
  noListingsText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
  },
  addListingsButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  addListingsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
