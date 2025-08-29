import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function AddListings() {
  const [importModalVisible, setImportModalVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [successVisible, setSuccessVisible] = React.useState(false);
  const categories = [
    'Vegetable', 'Meat',
    'Fruit', 'Fish',
    'Poultry', 'Hair',
    'Grocery', 'Pasalubong'
  ];
  const router = useRouter();
  // Sample listings data
  const listings = [
    {
      name: 'Banana',
      category: 'Fruit',
      image: require('../../../assets/banana.png'),
    },
    {
      name: 'Baguio beans',
      category: 'Vegetables',
      image: require('../../../assets/baguio_beans.png'),
    },
  ];

  const handleAdd = (listing) => {
    setSuccessVisible(true);
    setTimeout(() => {
      setSuccessVisible(false);
      router.replace('/modules/storeManagement/screens/ManageBusiness');
    }, 1200);
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
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/modules/storeManagement/screens/ViewListings')}>
              <Feather name="arrow-left" size={22} color="#222" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Your Listings</Text>
          </View>
          <Text style={styles.subtitle}>Search for products or services that you want to add to your listings. You can filter by category as well.</Text>
        </View>
        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchInput}>Search a listing</Text>
            <Image source={require('../../../assets/search.png')} style={styles.searchIcon} />
          </View>
          <TouchableOpacity style={styles.filterRow} onPress={() => setModalVisible(true)}>
            <Image source={require('../../../assets/filter-menu.png')} style={styles.filterIcon} />
            <Text style={styles.filterText}>Filter by category</Text>
          </TouchableOpacity>
        </View>
        {/* Import Listings Row */}
        <TouchableOpacity style={styles.importRow} onPress={() => setImportModalVisible(true)}>
          <Text style={styles.importText}>Import listings</Text>
          <Image source={require('../../../assets/import.png')} style={styles.importIcon} />
        </TouchableOpacity>
        {/* Import Modal */}
        <Modal
          visible={importModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImportModalVisible(false)}
        >
          <View style={styles.importModalOverlay}>
            <View style={styles.importModalContainer}>
              <Text style={styles.importModalText}>
                Drag and drop your <Text style={{fontWeight:'bold'}}> .txt file </Text> here
              </Text>
              <Text style={styles.importModalOr}>or</Text>
              <TouchableOpacity style={styles.importModalButton}>
                <Text style={styles.importModalButtonText}>Choose File</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.importModalClose} onPress={() => setImportModalVisible(false)}>
                <Text style={styles.importModalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Category Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Filter by category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat, idx) => (
                  <View key={cat} style={styles.categoryCell}>
                    <Text style={styles.categoryText}>{cat}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Listings */}
        <View style={styles.listingsRow}>
          {listings.map((listing, idx) => (
            <View key={idx} style={styles.card}>
              <Image source={listing.image} style={styles.cardImage} />
              <Text style={styles.cardName}>{listing.name}</Text>
              <Text style={styles.cardCategory}>{listing.category}</Text>
              <TouchableOpacity style={styles.cardButton} onPress={() => handleAdd(listing)}>
                <Text style={styles.cardButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Success Note */}
        {successVisible && (
          <View style={styles.successNoteBox}>
            <TouchableOpacity style={styles.successManageBtn} onPress={() => {
              setSuccessVisible(false);
              router.replace('/modules/storeManagement/screens/ManageBusiness');
            }}>
              <Text style={styles.successManageBtnText}>Go to Manage business</Text>
            </TouchableOpacity>
            <View style={styles.successRow}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}><Text style={{fontWeight:'bold'}}>Success:</Text> Listing successfully added.</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  importModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1E7DD',
    padding: 32,
    width: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  importModalText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  importModalOr: {
    fontSize: 15,
    color: '#888',
    marginBottom: 12,
  },
  importModalButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  importModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  importModalClose: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 58,
    marginBottom: 12,
    backgroundColor: '#eee',
    
  },
  importModalCloseText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eef2f3ff',
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 16,
    marginBottom: 18,
    width: '100%',
  },
  categoryCell: {
    width: '40%',
    margin: '5%',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
  },
  closeModalBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#8a888aff',
    borderRadius: 6,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    padding: 40,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    gap: 8,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 4,
    flexShrink: 1,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F0DF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginRight: 18,
  },
  searchInput: {
    color: '#666',
    fontSize: 15,
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#6BA06B',
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    tintColor: '#222',
  },
  filterText: {
    fontSize: 14,
    color: '#222',
  },
  importRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  importText: {
    fontSize: 18,
    color: '#222',
    marginRight: 8,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },
  importIcon: {
    width: 28,
    height: 28,
    tintColor: '#222',
  },
  listingsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  card: {
    width: 200,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    marginRight: 32,
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
  cardCategory: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  successNoteBox: {
    position: 'absolute',
    right: 32,
    bottom: 32,
    backgroundColor: '#D1E7DD',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minWidth: 320,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  successManageBtn: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  successManageBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  successIcon: {
    color: '#198754',
    fontWeight: 'bold',
    fontSize: 22,
    marginRight: 8,
  },
  successText: {
    color: '#198754',
    fontSize: 16,
  },
});
