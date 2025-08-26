import { StyleSheet, Dimensions, Platform } from 'react-native';

const window = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const contentWidth = isWeb ? Math.min(window.width * 0.95, 1200) : window.width;
const imageScaleFactor = isWeb ? 2 : 4;

export default StyleSheet.create({
  container: {
    flex: 1,
    top: isWeb ? 0 : 49,
    alignItems: 'center',
    marginLeft: 300 ,
    marginRight: 300,
    backgroundColor: '#fff'

  },
  scrollView: {
    flex: 1,
    width: contentWidth,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  image: {
    width: window.width * imageScaleFactor,
    height: window.height,
  },
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: contentWidth,
  },
  topOverlay: {
    position: 'absolute',
    top: 20,
    width: 900,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  searchBar: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 4,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  floatingButtons: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonNumber: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    position: 'absolute',
    bottom: 90,
    right: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'darkgreen',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
