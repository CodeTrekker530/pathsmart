import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function AddListingModal({ onClose, onSubmit, form, setForm }) {
  // Dummy image upload handler (replace with real upload logic)
  const handleImageUpload = () => {
    // You can integrate an image picker here
    alert("Image upload not implemented");
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Add a new Product or Service</Text>
        <TouchableOpacity
          style={styles.imageUpload}
          onPress={handleImageUpload}
        >
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Upload an image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={text => setForm({ ...form, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Bicol Name"
          value={form.bicol_name}
          onChangeText={text => setForm({ ...form, bicol_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Tagalog Name"
          value={form.tagalog_name}
          onChangeText={text => setForm({ ...form, tagalog_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={form.category}
          onChangeText={text => setForm({ ...form, category: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContainer: {
    width: 500,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 18,
    color: "#222",
    textAlign: "center",
  },
  imageUpload: {
    width: 350,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 6,
    color: "#888",
  },
  uploadText: {
    fontSize: 15,
    color: "#888",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 6,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#5c9a6c",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  cancelButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#5c9a6c",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#5c9a6c",
    fontSize: 18,
    fontWeight: "500",
  },
});
