import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ListingPage() {
  const router = useRouter(); // Keep router for future navigation
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("listing");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showProductSubmenu, setShowProductSubmenu] = useState(true); // Start with submenu open since we're in Product/Services

  // No products available in this example
  const products = [];

  // Function to handle sidebar hover
  const expandSidebar = () => {
    setSidebarExpanded(true);
  };

  // Function to collapse sidebar
  const collapseSidebar = () => {
    setSidebarExpanded(false);
    setShowProductSubmenu(false);
  };

  // Function to toggle product submenu
  const toggleProductSubmenu = () => {
    setShowProductSubmenu(!showProductSubmenu);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Navigate back to the login page
    router.push("/screens/loginScreen");
  };

  const handleAddProduct = () => {
    console.log("Adding new product or service");
    // Add logic to create new product
  };

  const handleSearch = text => {
    setSearchTerm(text);
    // Add search logic here
  };

  const handleChangePage = page => {
    setCurrentPage(page);
  };

  // Render the sidebar menu
  const renderSidebar = () => (
    <View
      style={[styles.sidebar, sidebarExpanded && styles.sidebarExpanded]}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logoImage}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.menuItem, activeTab === "map" && styles.activeMenuItem]}
        onPress={() => {
          setActiveTab("map");
          router.push("/modules/stallManagement/screens/adminInterface");
        }}
      >
        <Image
          source={require("../../../assets/map.png")}
          style={styles.logoImage}
        />
        {sidebarExpanded && <Text style={styles.menuText}>Map</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.menuItem,
          activeTab === "users" && styles.activeMenuItem,
        ]}
        onPress={() => {
          setActiveTab("users");
          router.push("/modules/stallManagement/screens/accountCreation");
        }}
      >
        <Image
          source={require("../../../assets/account-creation.png")}
          style={styles.logoImage}
        />
        {sidebarExpanded && (
          <Text style={styles.menuText}>Account Creation</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.menuItem,
          activeTab === "dashboard" && styles.activeMenuItem,
        ]}
        onPress={toggleProductSubmenu}
      >
        <Image
          source={require("../../../assets/PnS.png")}
          style={styles.logoImage}
        />
        {sidebarExpanded && (
          <View style={styles.productServicesContainer}>
            <Text style={styles.menuText}>Product/Services</Text>
            <Image
              source={require("../../../assets/dropdown-arrow.png")}
              style={[
                styles.arrowIcon,
                {
                  transform: [
                    { rotate: showProductSubmenu ? "0deg" : "270deg" },
                  ],
                },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
      {sidebarExpanded && showProductSubmenu && (
        <View style={styles.submenu}>
          <TouchableOpacity
            style={styles.submenuItem}
            onPress={() => {
              setActiveTab("quality-guide");
              router.push("/modules/stallManagement/screens/quality_guide");
            }}
          >
            <Text style={styles.submenuText}>Quality Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submenuItem}
            onPress={() => {
              setActiveTab("listing");
              router.push("/modules/stallManagement/screens/listing");
            }}
          >
            <Text style={styles.submenuText}>Listing Creation</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.menuItem,
          activeTab === "settings" && styles.activeMenuItem,
        ]}
        onPress={() => {
          setActiveTab("settings");
          router.push("/modules/stallManagement/screens/stall");
        }}
      >
        <Image
          source={require("../../../assets/stall.png")}
          style={styles.logoImage}
        />
        {sidebarExpanded && <Text style={styles.menuText}>Stalls</Text>}
      </TouchableOpacity>
      <View style={styles.sidebarBottom}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            activeTab === "user-account" && styles.activeMenuItem,
          ]}
          onPress={() => {
            setActiveTab("user-account");
            router.push("/modules/stallManagement/screens/account");
          }}
        >
          <Image
            source={require("../../../assets/user-account.png")}
            style={styles.logoImage}
          />
          {sidebarExpanded && <Text style={styles.menuText}>Account</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Image
            source={require("../../../assets/logout.png")}
            style={styles.logoImage}
          />
          {sidebarExpanded && <Text style={styles.menuText}>Logout</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSidebar()}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Listing Creation</Text>
        <Text style={styles.description}>
          Add a predefined products that stall owners can choose from to include
          in their listings
        </Text>

        <View style={styles.contentSection}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Products</Text>

            <View style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search a product or service"
                value={searchTerm}
                onChangeText={handleSearch}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Image
                  source={require("../../../assets/search.png")}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Add new product or service</Text>
          </TouchableOpacity>

          <View style={styles.productsList}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <Text>{product.name}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No product/service available
                </Text>
              </View>
            )}
          </View>

          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 1 && styles.activePageButton,
              ]}
              onPress={() => handleChangePage(1)}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 1 && styles.activePageButtonText,
                ]}
              >
                1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 2 && styles.activePageButton,
              ]}
              onPress={() => handleChangePage(2)}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 2 && styles.activePageButtonText,
                ]}
              >
                2
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 3 && styles.activePageButton,
              ]}
              onPress={() => handleChangePage(3)}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 3 && styles.activePageButtonText,
                ]}
              >
                3
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 4 && styles.activePageButton,
              ]}
              onPress={() => handleChangePage(4)}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 4 && styles.activePageButtonText,
                ]}
              >
                4
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                currentPage < 4 && handleChangePage(currentPage + 1);
              }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 0,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  contentSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  searchSection: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: "60%",
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 18,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5c9a6c",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  addButtonIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
  },
  productsList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#999",
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    paddingBottom: 20,
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activePageButton: {
    backgroundColor: "#5c9a6c",
  },
  pageButtonText: {
    color: "#333",
  },
  activePageButtonText: {
    color: "#fff",
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  nextButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  logoImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  sidebar: {
    width: 60,
    backgroundColor: "#1976D2",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    transition: "width 0.3s",
  },
  sidebarExpanded: {
    width: 220,
    alignItems: "flex-start",
  },
  logoContainer: {
    marginBottom: 40,
    width: "100%",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarBottom: {
    position: "absolute",
    bottom: 130,
    width: "100%",
    alignItems: "center",
  },
  menuItem: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  activeMenuItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  menuText: {
    color: "white",
    marginLeft: 15,
    fontSize: 16,
  },
  productServicesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginLeft: 10,
    tintColor: "white",
  },
  submenu: {
    width: "100%",
    backgroundColor: "#1e88e5",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  submenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  submenuText: {
    color: "white",
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
});
