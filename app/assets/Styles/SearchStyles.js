import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
    marginLeft: 300 ,
    marginRight: 300,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10, // or adjust as needed
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 10,
    gap: 6,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilter: {
    backgroundColor: '#2c6e49',
    borderColor: '#2c6e49',
  },
  activeFilterText: {
    color: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
  },
  itemPrice: {
    fontWeight: '500',
    fontSize: 13,
    color: '#444',
    marginRight: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  loginButton: {
    padding: 8,
    height: 42,
    width: 126,
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo_name: {
    fontSize: 20,
    fontWeight: "450",
    color: "#fff",
    marginRight: 10,
  },
  headerRowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // optional, for spacing between icon and text
  },
});
