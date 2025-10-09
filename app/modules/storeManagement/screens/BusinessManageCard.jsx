import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function BusinessManageCard({ business, onAddListing, onViewListings }) {
  if (!business) return null;
  return (
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
          <TouchableOpacity onPress={onAddListing}>
            <Text style={styles.addListingLink}>Add your listings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.viewListingsButton} onPress={onViewListings}>
          <Feather name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.viewListingsButtonText}>View Listings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
