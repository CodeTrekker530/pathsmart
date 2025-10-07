import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSelection } from '../../../context/SelectionContext';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../components/Sidebar';

const ICON_SIZE = 28;

export default function AddListings() {
  const [categoryModalVisible, setCategoryModalVisible] = React.useState(false); // category filter modal
  const [successVisible, setSuccessVisible] = React.useState(false);
  const [successSummary, setSuccessSummary] = React.useState({ addedCount: 0, skippedCount: 0 });
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  const router = useRouter();
  const params = useLocalSearchParams();
  const currentId = params.id || 'vegetable1';
  const isBarbershop = currentId === 'barbershop1';
  const [searchText, setSearchText] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState([]); // chosen categories

  const { addListing, addListingsBulk, listings, setCurrentBusinessId } = useSelection();
  React.useEffect(() => {
    setCurrentBusinessId(currentId);
  }, [currentId, setCurrentBusinessId]);
  const { logout } = useAuth();

  // Unified listing templates; choose based on business type
  const templates = isBarbershop
    ? [
        { name: 'Haircut', category: 'Hair', image: require('../../../assets/haircut.png') },
        { name: 'Hair color', category: 'Hair', image: require('../../../assets/haircolor.png') },
      ]
    : [
        { name: 'Banana', category: 'Fruit', image: require('../../../assets/banana.png') },
        { name: 'Baguio beans', category: 'Vegetable', image: require('../../../assets/baguio_beans.png') },
      ];
  
  const CATEGORY_SET = isBarbershop ? ['Hair'] : ['Vegetable', 'Meat', 'Fruit', 'Fish', 'Poultry', 'Grocery', 'Pasalubong'];

  const toggleCategory = (c) => {
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const clearFilters = () => { setSearchText(''); setSelectedCategories([]); };

  const filteredTemplates = templates.filter(t => {
    const matchCat = selectedCategories.length === 0 || selectedCategories.includes(t.category);
    const txt = searchText.trim().toLowerCase();
    const matchTxt = txt === '' || t.name.toLowerCase().includes(txt) || t.category.toLowerCase().includes(txt);
    return matchCat && matchTxt;
  });
  
  // Selection helpers
  const keyFor = (item) => `${item.name}__${item.category}`;
  const existsInBusiness = (item) => listings.some(l => l.name === item.name && l.category === item.category);
  const isSelected = (item) => selectedKeys.has(keyFor(item));
  const toggleSelect = (item) => {
    if (existsInBusiness(item)) return; // cannot select duplicates
    setSelectedKeys(prev => {
      const next = new Set(prev);
      const k = keyFor(item);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };
  const clearSelection = () => setSelectedKeys(new Set());
  const selectAllFiltered = () => {
    const selectable = filteredTemplates.filter(t => !existsInBusiness(t));
    setSelectedKeys(new Set(selectable.map(keyFor)));
  };

  const addSelected = () => {
    if (selectedKeys.size === 0) return;
    // Resolve selected items from full templates list to avoid filter dependency
    const selectedList = templates.filter(t => selectedKeys.has(keyFor(t)) && !existsInBusiness(t));
    const summary = addListingsBulk(selectedList);
    setSuccessSummary({ addedCount: summary.addedCount, skippedCount: summary.skippedCount });
    setSuccessVisible(true);
    clearSelection();
    setTimeout(() => {
      setSuccessVisible(false);
      router.replace({ pathname: '/modules/storeManagement/screens/ViewListings', params: { id: currentId } });
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    router.replace('/screens/loginScreen');
  };

  return (
    <View style={styles.root}>
      {/* Animated Sidebar (reused) */}
      <Sidebar onAccountPress={() => router.replace('/modules/storeManagement/screens/dashboard')} />

      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                router.replace({
                  pathname: '/modules/storeManagement/screens/ManageBusiness',
                  params: { id: currentId },
                })
              }
            >
              <Feather name="arrow-left" size={22} color="#222" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Your Listings</Text>
          </View>
          <Text style={styles.subtitle}>Search for products or services that you want to add. You can filter by category.</Text>
        </View>

        {/* Selection Bar */}
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>{selectedKeys.size} selected</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.selectionBtn, selectedKeys.size === 0 && styles.selectionBtnDisabled]} disabled={selectedKeys.size === 0} onPress={addSelected}>
              <Text style={[styles.selectionBtnText, selectedKeys.size === 0 && styles.selectionBtnTextDisabled]}>Add Selected</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={selectAllFiltered}>
              <Text style={styles.secondaryBtnText}>Select All (filtered)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={clearSelection}>
              <Text style={styles.secondaryBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <TextInput value={searchText} onChangeText={setSearchText} placeholder="Search a listing" placeholderTextColor="#666" style={styles.searchTextInput} />
            <Image source={require('../../../assets/search.png')} style={styles.searchIcon} />
          </View>
          <TouchableOpacity style={styles.filterRow} onPress={() => setCategoryModalVisible(true)}>
            <Image source={require('../../../assets/filter-menu.png')} style={styles.filterIcon} />
            <Text style={styles.filterText}>Filter by category</Text>
          </TouchableOpacity>
        </View>

        {/* Import flow removed: selection handles batch add */}

        {/* Category Modal */}
        <Modal visible={categoryModalVisible} transparent animationType="fade" onRequestClose={() => setCategoryModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.categoryModalBox}>
              <Text style={styles.categoryModalTitle}>Filter by category</Text>
              <ScrollView style={{ maxHeight: 320 }}>
                <View style={styles.categoryGrid}>
                  {CATEGORY_SET.map(c => {
                    const active = selectedCategories.includes(c);
                    return (
                      <TouchableOpacity key={c} style={[styles.categoryButton, active && styles.categoryButtonActive]} onPress={() => toggleCategory(c)}>
                        <Text style={[styles.categoryButtonText, active && styles.categoryButtonTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
              <View style={styles.filterActionsRow}>
                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}><Text style={styles.clearBtnText}>Clear</Text></TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={() => setCategoryModalVisible(false)}><Text style={styles.applyBtnText}>Apply</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Listings */}
        <View style={styles.listingsRow}>
          {filteredTemplates.length === 0 ? (
            <Text style={{ color: '#666', fontSize: 15 }}>No templates match your filters.</Text>
          ) : (
            filteredTemplates.map((item, idx) => {
              const exists = existsInBusiness(item);
              const selected = isSelected(item);
              return (
                <TouchableOpacity key={idx} style={[styles.card, selected && styles.cardSelected, exists && styles.cardDisabled]} onPress={() => toggleSelect(item)} activeOpacity={exists ? 1 : 0.8} disabled={exists}>
                  <Image source={item.image} style={styles.cardImage} />
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                      {selected && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                  </View>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  {exists && <Text style={styles.cardBadge}>Already added</Text>}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Success Note */}
        {successVisible && (
          <View style={styles.successNoteBox}>
            <View style={styles.successRow}>
              <Text style={styles.successIcon}>ℹ</Text>
              <Text style={styles.successText}>Added {successSummary.addedCount} item(s); {successSummary.skippedCount} already existed.</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Import modal styles removed

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
    borderWidth: 1,
    borderColor: '#eee'
  },
  categoryButtonText: { fontSize: 16, color: '#222', fontWeight: '400', textAlign: 'center' },
  categoryButtonActive: { backgroundColor: '#6BA06B', borderColor: '#6BA06B' },
  categoryButtonTextActive: { color: '#fff', fontWeight: '600' },
  filterActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  clearBtn: { flex: 1, backgroundColor: '#f0f0f0', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  clearBtnText: { color: '#444', fontWeight: '600', fontSize: 15 },
  applyBtn: { flex: 1, backgroundColor: '#6BA06B', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  categoryButtonText: { fontSize: 16, color: '#222', fontWeight: '400', textAlign: 'center' },
  closeButton: {
    backgroundColor: '#888',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    minWidth: 100,
  },
  closeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },

  root: { flex: 1, flexDirection: 'row', backgroundColor: '#222' },

  main: { flex: 1, padding: 40, backgroundColor: '#fff' },
  headerContainer: { marginBottom: 18, alignItems: 'flex-start' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginTop: 8, gap: 8 },
  backButton: { marginRight: 8 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 4,
    flexShrink: 1,
    textTransform: 'capitalize',
  },
  subtitle: { fontSize: 15, color: '#888', marginTop: 2, fontWeight: '400', letterSpacing: 0.1 },

  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  selectionText: { color: '#222', fontSize: 14 },
  selectionBtn: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectionBtnDisabled: { backgroundColor: '#ccc' },
  selectionBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  selectionBtnTextDisabled: { color: '#555' },
  secondaryBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryBtnText: { color: '#222', fontSize: 14, fontWeight: '500' },

  searchFilterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F0DF', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8, flex: 1, marginRight: 18 },
  searchTextInput: { flex: 1, fontSize: 15, color: '#222' },
  searchInput: { color: '#666', fontSize: 15, flex: 1 },
  searchIcon: { width: 20, height: 20, tintColor: '#6BA06B', marginLeft: 8 },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterIcon: { width: 22, height: 22, marginRight: 6, tintColor: '#222' },
  filterText: { fontSize: 14, color: '#222' },

  // Import row removed

  listingsRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 12 },
  card: {
    width: 200,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    marginRight: 32,
    padding: 12,
    backgroundColor: '#fff',
  },
  cardSelected: { borderColor: '#6BA06B', borderWidth: 2 },
  cardDisabled: { opacity: 0.6 },
  cardImage: { width: 160, height: 100, borderRadius: 6, marginBottom: 8 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontWeight: 'bold', fontSize: 16, marginBottom: 2, color: '#222' },
  cardCategory: { fontSize: 13, color: '#888', marginBottom: 8, alignSelf: 'flex-start' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6BA06B',
    borderColor: '#6BA06B',
  },
  checkboxTick: { color: '#fff', fontWeight: 'bold', fontSize: 14, lineHeight: 16 },
  cardBadge: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: '#555', fontSize: 12 },

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
  successRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  successIcon: { color: '#198754', fontWeight: 'bold', fontSize: 22, marginRight: 8 },
  successText: { color: '#198754', fontSize: 16 },
});