import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelection } from '../../../context/SelectionContext';

export default function ViewListings() {
  const router = useRouter();
  const { listings, removeListing, updateListing } = useSelection();

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editingName, setEditingName] = React.useState('');
  const [editingPrice, setEditingPrice] = React.useState('');
  const [editingAvailability, setEditingAvailability] = React.useState('Available');

  const handleBack = () => {
    router.back();
  };

  const handleAddListings = () => {
    router.push('/modules/storeManagement/screens/AddListings');
  };

  const handleEdit = (index) => {
    const listing = listings[index];
    setEditingIndex(index);
    setEditingName(listing.name);
    setEditingPrice(listing.price || '');
    setEditingAvailability(listing.availability || 'Available');
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedListing = { 
        ...listings[editingIndex], 
        name: editingName,
        price: editingPrice,
        availability: editingAvailability
      };
      updateListing(editingIndex, updatedListing);
      setEditModalVisible(false);
      setEditingIndex(null);
      setEditingName('');
      setEditingPrice('');
      setEditingAvailability('Available');
    }
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditingIndex(null);
    setEditingName('');
    setEditingPrice('');
    setEditingAvailability('Available');
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
          <TouchableOpacity style={styles.filterRow} onPress={() => setShowCategoryModal(true)}>
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
                {listing.price && <Text style={styles.cardPrice}>₱{listing.price}</Text>}
                {listing.availability && (
                  <Text style={[styles.cardAvailability, 
                    listing.availability === 'Available' ? styles.available : styles.unavailable
                  ]}>
                    {listing.availability}
                  </Text>
                )}
                <View style={styles.cardButtonRow}>
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeListing(idx)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(idx)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Category Filter Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCategoryModal(false)}>
          <View style={styles.categoryModalBox}>
            <Text style={styles.categoryModalTitle}>Filter by category</Text>
            <View style={styles.categoryGrid}>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Vegetable</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Meat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Fruit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Fish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Poultry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Hair</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Grocery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>Pasalubong</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalBox}>
            <Text style={styles.editModalTitle}>Edit Product</Text>
            
            <Text style={styles.editLabel}>Product Name</Text>
            <TextInput
              style={styles.editInput}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Enter product name"
            />
            
            <Text style={styles.editLabel}>Price (₱)</Text>
            <TextInput
              style={styles.editInput}
              value={editingPrice}
              onChangeText={setEditingPrice}
              placeholder="Enter price"
              keyboardType="numeric"
            />
            
            <Text style={styles.editLabel}>Availability</Text>
            <View style={styles.availabilityContainer}>
              <TouchableOpacity 
                style={[styles.availabilityOption, editingAvailability === 'Available' && styles.selectedAvailability]}
                onPress={() => setEditingAvailability('Available')}
              >
                <Text style={[styles.availabilityText, editingAvailability === 'Available' && styles.selectedAvailabilityText]}>
                  Available
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.availabilityOption, editingAvailability === 'Not Available' && styles.selectedAvailability]}
                onPress={() => setEditingAvailability('Not Available')}
              >
                <Text style={[styles.availabilityText, editingAvailability === 'Not Available' && styles.selectedAvailabilityText]}>
                  Not Available
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.editModalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveChangesButton} onPress={saveEdit}>
                <Text style={styles.saveChangesButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
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
    width: 22,
    height: 22,
    marginRight: 6,
    tintColor: '#222',
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
    width: 200,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    marginRight: 32,
    marginBottom: 24,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: 160,
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  cardName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
    alignSelf: 'flex-start',
  },
  cardPrice: {
    fontWeight: '600',
    fontSize: 15,
    color: '#6BA06B',
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  cardAvailability: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  available: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  unavailable: {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
  },
  cardNameInput: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  cardCategory: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    gap: 8,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    minWidth: 70,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    minWidth: 70,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#0066CC',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    minWidth: 70,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 400,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  categoryGrid: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 45,
    justifyContent: 'center',
    width: '48%',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#888',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    minWidth: 100,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  categoryModalContent: {
    marginTop: 8,
  },
  categoryModalRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryModalLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 350,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
    marginTop: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  availabilityContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  availabilityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  selectedAvailability: {
    backgroundColor: '#6BA06B',
    borderColor: '#6BA06B',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedAvailabilityText: {
    color: '#fff',
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveChangesButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6BA06B',
    alignItems: 'center',
  },
  saveChangesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
