import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function EditListingModal({ onClose, onSubmit, form, setForm }) {
  const handleImageUpload = () => {
    // Integrate your image picker here
    alert("Image upload not implemented");
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Update a product</Text>
        <TouchableOpacity
          style={styles.imageUpload}
          onPress={handleImageUpload}
        >
          {form.pns_image ? (
            <Image
              source={{ uri: form.pns_image }}
              style={styles.uploadedImage}
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadText}>Upload an image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={text => setForm({ ...form, name: text })}
          placeholder="Product Name"
        />
        <TextInput
          style={styles.input}
          value={form.bicol_name}
          onChangeText={text => setForm({ ...form, bicol_name: text })}
          placeholder="Bicol Name"
        />
        <TextInput
          style={styles.input}
          value={form.tagalog_name}
          onChangeText={text => setForm({ ...form, tagalog_name: text })}
          placeholder="Tagalog Name"
        />
        <TextInput
          style={styles.input}
          value={form.pns_category}
          onChangeText={text => setForm({ ...form, pns_category: text })}
          placeholder="Category"
        />
        <TouchableOpacity style={styles.updateButton} onPress={onSubmit}>
          <Text style={styles.updateButtonText}>Update</Text>
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
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modalContainer: {
    width: 500,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    padding: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
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
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 2,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  updateButton: {
    width: "100%",
    backgroundColor: "#5c9a6c",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  cancelButton: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#5c9a6c",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#5c9a6c",
    fontSize: 18,
    fontWeight: "500",
  },
});
