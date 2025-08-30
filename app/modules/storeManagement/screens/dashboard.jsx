import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardPage() {
  const router = useRouter();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOpenChangeForm = () => {
    setShowChangeForm(true);
    setPhone('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmitChange = () => {
    // Add your submit logic here
    setShowChangeForm(false);
    setShowAccountModal(false);
  };

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarIcons}>
          <Image source={require('../../../assets/logo.png')} style={[styles.sidebarIcon, {tintColor: undefined}]} />
          <TouchableOpacity onPress={() => setShowAccountModal(true)}>
            <Image source={require('../../../assets/user-account.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/screens/loginScreen')}>
            <Image source={require('../../../assets/logout.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
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

      {/* Account Modal */}
      <Modal
        visible={showAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {
          setShowAccountModal(false);
          setShowChangeForm(false);
        }}>
          <View style={styles.accountModalBox}>
            {!showChangeForm ? (
              <>
                <View style={styles.accountModalHeaderRow}>
                  <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                    <Text style={styles.accountModalBack}>{'<'} </Text>
                  </TouchableOpacity>
                  <Text style={styles.accountModalTitle}>Account</Text>
                </View>
                <View style={styles.accountModalContent}>
                  <View style={styles.accountModalRow}>
                    <Text style={styles.accountModalLabel}>Full Name</Text>
                    <Text style={styles.accountModalValue}>Joseph Frondozo Martin</Text>
                  </View>
                  <TouchableOpacity style={styles.accountModalRow} onPress={handleOpenChangeForm}>
                    <Text style={styles.accountModalLabel}>Phone Number</Text>
                    <Text style={styles.accountModalValue}>09476373794</Text>
                    <Text style={styles.accountModalArrow}>{'>'}</Text>
                  </TouchableOpacity>
                  <View style={styles.accountModalRow}>
                    <Text style={styles.accountModalLabel}>Username</Text>
                    <Text style={styles.accountModalValue}>username1</Text>
                  </View>
                  <TouchableOpacity style={styles.accountModalRow} onPress={handleOpenChangeForm}>
                    <Text style={styles.accountModalLabel}>Change Password</Text>
                    <Text style={styles.accountModalArrow}>{'>'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.accountModalHeaderRow}>
                  <TouchableOpacity onPress={() => setShowChangeForm(false)}>
                    <Text style={styles.accountModalBack}>{'<'} </Text>
                  </TouchableOpacity>
                  <Text style={styles.accountModalTitle}>Change Password</Text>
                </View>
                <View style={styles.changeFormContent}>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>New Phone Number</Text>
                    <View style={styles.inputFieldBox}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="New Phone Number"
                        placeholderTextColor="#888"
                        value={phone}
                        onChangeText={setPhone}
                      />
                    </View>
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Old Password</Text>
                    <View style={styles.inputFieldBox}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Old Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                      />
                    </View>
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.inputFieldBox}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="New Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                      />
                    </View>
                  </View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.inputFieldBox}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Confirm Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmitChange}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountModalBox: {
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
  accountModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  accountModalBack: {
    fontSize: 22,
    color: '#222',
    marginRight: 8,
    fontWeight: '500',
  },
  accountModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  accountModalContent: {
    marginTop: 8,
  },
  accountModalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 14,
  },
  accountModalLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  accountModalValue: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '400',
    marginLeft: 16,
  },
  accountModalArrow: {
    fontSize: 18,
    color: '#bbb',
    marginLeft: 16,
  },
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
    width: 48,
    height: 48,
    marginVertical: 24,
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
  changeFormContent: {
    marginTop: 8,
  },
  inputBox: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputFieldBox: {
    backgroundColor: '#e3ecd7',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  inputField: {
    height: 40,
    fontSize: 15,
    color: '#222',
  },
  submitButton: {
    backgroundColor: '#6BA06B',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});