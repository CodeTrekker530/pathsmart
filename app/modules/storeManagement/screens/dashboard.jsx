import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarIcons}>
          <Image source={require('../../../assets/icon.png')} style={styles.sidebarIcon} />
          <Image source={require('../../../assets/home.png')} style={styles.sidebarIcon} />
          <Image source={require('../../../assets/logout.png')} style={styles.sidebarIcon} />
        </View>
      </View>
      {/* Main Content */}
      <View style={styles.main}>
        <Text style={styles.header}>Welcome Abellano!</Text>
        <Text style={styles.subheader}>Manage your business</Text>
        <View style={styles.divider} />
        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Image
              source={require('../../../assets/barbershop.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>The Classic Cut</Text>
                <Text style={styles.cardType}>Barbershop</Text>
              </View>
              <Text style={styles.cardLocation}>Ground Floor, Barbershop Section</Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => router.push('/modules/storeManagement/screens/ManageBusiness')}
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <Image
              source={require('../../../assets/vegetable.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Abellano Store</Text>
                <Text style={styles.cardType}>Vegetable</Text>
              </View>
              <Text style={styles.cardLocation}>Ground Floor, Vegetable Section</Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => router.push('/modules/storeManagement/screens/ManageBusiness')}
              >
                <Text style={styles.manageButtonText}>Manage</Text>
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
    borderLeftColor: '#8B5CF6', // purple border
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
    width: 36,
    height: 36,
    marginVertical: 24,
    tintColor: '#fff',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 8,
    color: '#222',
  },
  subheader: {
    color: '#888',
    marginBottom: 18,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
    width: '100%',
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 24,
    gap: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 320,
    marginRight: 32,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardImage: {
    width: 288,
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardType: {
    color: '#6BA06B',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
  },
  cardLocation: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
    marginTop: 2,
  },
  manageButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});