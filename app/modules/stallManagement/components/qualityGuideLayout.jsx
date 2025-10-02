import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { supabase } from "../../../../backend/supabaseClient";
import * as ImagePicker from "expo-image-picker";

export default function QualityGuideModal({
  products = [],
  searchTerm = "",
  onSearchChange = () => {},
  onAddProduct,
  ...props
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quality, setQuality] = useState("Best");
  const [imageUris, setImageUris] = useState({
    Best: null,
    Good: null,
    Bad: null,
  });
  const [descriptions, setDescriptions] = useState({
    Best: [""],
    Good: [""],
    Bad: [""],
  });

  const [uploading, setUploading] = useState(false);
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async () => {
    if (!selectedProduct) return;
    setUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        // Just store the local URI for preview
        setImageUris(prev => ({
          ...prev,
          [selectedProduct.pns_id]: {
            ...prev[selectedProduct.pns_id],
            [quality]: [
              ...(prev[selectedProduct.pns_id]?.[quality] || []),
              uri,
            ],
          },
        }));
      }
    } catch (e) {
      alert("Image selection failed: " + e.message);
    }
    setUploading(false);
  };

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchQualityGuide = async () => {
      try {
        const { data, error } = await supabase
          .from("quality_guide")
          .select("details")
          .eq("pns_id", selectedProduct.pns_id)
          .maybeSingle();

        if (error) throw error;

        if (data?.details) {
          const { good, bad, best } = data.details;

          // populate fields with existing data
          setDescriptions(prev => ({
            ...prev,
            [selectedProduct.pns_id]: {
              Good: good?.descriptions?.length ? good.descriptions : [""],
              Bad: bad?.descriptions?.length ? bad.descriptions : [""],
              Best: best?.descriptions?.length ? best.descriptions : [""],
            },
          }));

          setImageUris(prev => ({
            ...prev,
            [selectedProduct.pns_id]: {
              Good: good.images || [],
              Bad: bad.images || [],
              Best: best.images || [],
            },
          }));
        } else {
          //  no guide yet for this product → ensure empty fields
          setDescriptions(prev => ({
            ...prev,
            [selectedProduct.pns_id]: { Good: [""], Bad: [""], Best: [""] },
          }));

          setImageUris(prev => ({
            ...prev,
            [selectedProduct.pns_id]: { Good: [], Bad: [], Best: [] },
          }));
        }
      } catch (err) {
        console.error("Error fetching quality guide:", err.message);
      }
    };

    fetchQualityGuide();
  }, [selectedProduct]);

  const removeImageFromSupabase = async imgUrl => {
    // Only try to remove if it's a Supabase public URL
    if (!imgUrl.startsWith("http")) return;
    // Extract the file path after the bucket name
    const parts = imgUrl.split("/quality-imgs/");
    if (parts.length < 2) return;
    const filePath = parts[1].split("?")[0]; // Remove any query params
    const { error } = await supabase.storage
      .from("quality-imgs")
      .remove([filePath]);
    if (error) {
      console.error("Failed to delete image from bucket:", error.message);
    }
  };

  const handleAddQualityGuide = async () => {
    if (!selectedProduct) {
      alert("Please select a product first.");
      return;
    }

    const uploadImageIfNeeded = async (uri, qualityLabel) => {
      // Supabase URL, just return it
      if (uri.startsWith("http")) return uri;

      const fileName = `product_${selectedProduct.pns_id}_${qualityLabel}_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();

      if (blob.size > MAX_FILE_SIZE) {
        throw new Error(
          "Image size must be less than or equal to 1MB or 1024KB."
        );
      }

      const { error } = await supabase.storage
        .from("quality-imgs")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });
      if (error) throw new Error("Image upload failed: " + error.message);

      const { data: urlData } = supabase.storage
        .from("quality-imgs")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    };

    // Upload all images for each quality if needed
    let newImageUris = { ...imageUris };
    const qualities = ["Best", "Good", "Bad"];
    for (const q of qualities) {
      const uris = imageUris[selectedProduct.pns_id]?.[q] || [];
      const uploadedUris = [];
      for (const uri of uris) {
        try {
          uploadedUris.push(await uploadImageIfNeeded(uri, q));
        } catch (err) {
          alert(err.message);
          return;
        }
      }
      if (!newImageUris[selectedProduct.pns_id])
        newImageUris[selectedProduct.pns_id] = {};
      newImageUris[selectedProduct.pns_id][q] = uploadedUris;
    }

    // details JSON
    const details = {
      best: {
        descriptions:
          descriptions[selectedProduct.pns_id]?.Best?.filter(
            d => d.trim() !== ""
          ) || [],
        images: newImageUris[selectedProduct.pns_id]?.Best || [],
      },
      good: {
        descriptions:
          descriptions[selectedProduct.pns_id]?.Good?.filter(
            d => d.trim() !== ""
          ) || [],
        images: newImageUris[selectedProduct.pns_id]?.Good || [],
      },
      bad: {
        descriptions:
          descriptions[selectedProduct.pns_id]?.Bad?.filter(
            d => d.trim() !== ""
          ) || [],
        images: newImageUris[selectedProduct.pns_id]?.Bad || [],
      },
    };

    //  Validation: prevent submit if all fields are empty
    const isEmpty =
      details.best.descriptions.length === 0 &&
      details.best.images.length === 0 &&
      details.good.descriptions.length === 0 &&
      details.good.images.length === 0 &&
      details.bad.descriptions.length === 0 &&
      details.bad.images.length === 0;

    if (isEmpty) {
      alert("Please add at least one description or image before confirming.");
      return;
    }

    try {
      // Check if a guide exists for this product
      const { data: existing, error: fetchError } = await supabase
        .from("quality_guide")
        .select("quality_guide_id")
        .eq("pns_id", selectedProduct.pns_id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        // update
        const { error: updateError } = await supabase
          .from("quality_guide")
          .update({ details })
          .eq("quality_guide_id", existing.quality_guide_id);

        if (updateError) throw updateError;
        alert("Quality guide updated successfully!");
      } else {
        // insert
        const { error: insertError } = await supabase
          .from("quality_guide")
          .insert([{ pns_id: selectedProduct.pns_id, details }])
          .select()
          .single();

        if (insertError) throw insertError;
        alert("Quality guide added successfully!");

        // populate state from inserted data so form stays filled
        setDescriptions({
          Good: details.good.descriptions,
          Bad: details.bad.descriptions,
          Best: details.best.descriptions,
        });
        setImageUris({
          Good: details.good.images,
          Bad: details.bad.images,
          Best: details.best.images,
        });
      }
    } catch (err) {
      console.error("Error saving quality guide:", err.message);
      alert("Failed to save quality guide: " + err.message);
    }
  };

  React.useEffect(() => {
    if (selectedProduct) {
      setDescriptions(prev => ({
        ...prev,
        [selectedProduct.pns_id]: prev[selectedProduct.pns_id] || {
          Best: [""],
          Good: [""],
          Bad: [""],
        },
      }));
      setImageUris(prev => ({
        ...prev,
        [selectedProduct.pns_id]: prev[selectedProduct.pns_id] || {
          Best: [],
          Good: [],
          Bad: [],
        },
      }));
    }
  }, [selectedProduct]);

  const currentDescriptions = (selectedProduct &&
    descriptions[selectedProduct.pns_id]?.[quality]) || [""];
  const currentImageUris =
    (selectedProduct && imageUris[selectedProduct.pns_id]?.[quality]) || [];

  return (
    <div style={styles.container}>
      {/* LEFT: Product List */}
      <div style={styles.leftPanel}>
        <input
          style={styles.searchBox}
          type="text"
          placeholder="Search a product"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
        <div style={styles.productContainer}>
          {filteredProducts.map((prod, idx) => (
            <div
              key={prod.pns_id}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px 8px",
                borderRadius: 8,
                background:
                  selectedProduct?.pns_id === prod.pns_id
                    ? "#eaf6ee"
                    : "#f9f9f9",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                border:
                  selectedProduct?.pns_id === prod.pns_id
                    ? "1.5px solid #5c9a6c"
                    : "1px solid #eee",
              }}
              onClick={() => setSelectedProduct(prod)}
            >
              <img
                src={prod.pns_image}
                alt={prod.name}
                style={styles.productImage}
              />
              <div>
                <div style={styles.productName}>{prod.name}</div>
                <div style={styles.productCategory}>{prod.pns_category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Product Details */}
      <div style={styles.rightPanel}>
        <h3 style={styles.detailsTitle}>Details</h3>
        {selectedProduct ? (
          <>
            {/* Quality Tabs */}
            <div style={styles.tabs}>
              {["Best", "Good", "Bad"].map(q => (
                <button
                  key={q}
                  style={{
                    padding: "8px 32px",
                    borderRadius: 6,
                    border: "none",
                    background: quality === q ? "#5c9a6c" : "#f5f5f5",
                    color: quality === q ? "#fff" : "#222",
                    fontWeight: quality === q ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                  onClick={() => setQuality(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            {/* Image Upload */}
            <div style={styles.imageUpload} onClick={undefined}>
              {uploading ? (
                <div>Uploading...</div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {currentImageUris.map((img, idx) => (
                    <div
                      key={idx}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={img}
                        alt="Product"
                        style={{ ...styles.image, width: 80, height: 80 }}
                      />
                      <button
                        style={styles.removeImgBtn}
                        onClick={async e => {
                          e.stopPropagation();
                          // Remove from Supabase if needed
                          const imgToRemove = currentImageUris[idx];
                          await removeImageFromSupabase(imgToRemove);
                          setImageUris(prev => ({
                            ...prev,
                            [selectedProduct.pns_id]: {
                              ...prev[selectedProduct.pns_id],
                              [quality]: prev[selectedProduct.pns_id][
                                quality
                              ].filter((_, i) => i !== idx),
                            },
                          }));
                        }}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    style={{
                      width: 80,
                      height: 80,
                      border: "1px dashed #aaa",
                      borderRadius: 10,
                      background: "#f5f5f5",
                      color: "#888",
                      fontSize: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: uploading ? "not-allowed" : "pointer",
                    }}
                    onClick={uploading ? undefined : handleImageUpload}
                    disabled={uploading}
                    title="Add Image"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            {/* Product Name */}
            <input
              type="text"
              value={selectedProduct.name}
              readOnly
              style={styles.selectedProductName}
            />
            {/* Description Fields */}
            {currentDescriptions.map((desc, idx) => (
              <div key={idx} style={styles.descriptionContainer}>
                <input
                  style={styles.descriptionField}
                  type="text"
                  value={desc}
                  placeholder="Description"
                  onChange={e => {
                    const newArr = [...currentDescriptions];
                    newArr[idx] = e.target.value;
                    setDescriptions(prev => ({
                      ...prev,
                      [selectedProduct.pns_id]: {
                        ...prev[selectedProduct.pns_id],
                        [quality]: newArr,
                      },
                    }));
                  }}
                />

                {currentDescriptions.length > 1 &&
                  idx !== currentDescriptions.length - 1 && (
                    <button
                      onClick={() => {
                        const newArr = currentDescriptions.filter(
                          (_, i) => i !== idx
                        );
                        setDescriptions(prev => ({
                          ...prev,
                          [selectedProduct.pns_id]: {
                            ...prev[selectedProduct.pns_id],
                            [quality]: newArr,
                          },
                        }));
                      }}
                      style={styles.removeBtn}
                    >
                      −
                    </button>
                  )}
                {/* Add button: only on last field */}
                {idx === currentDescriptions.length - 1 && (
                  <button
                    onClick={() => {
                      setDescriptions(prev => ({
                        ...prev,
                        [selectedProduct.pns_id]: {
                          ...prev[selectedProduct.pns_id],
                          [quality]: [...currentDescriptions, ""],
                        },
                      }));
                    }}
                    style={styles.addBtn}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
            <button style={styles.okayButton} onClick={handleAddQualityGuide}>
              Update
            </button>
          </>
        ) : (
          <div style={styles.rightMessage}>
            Select a product to view or edit its quality guide.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  removeImgBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    background: "#fff",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: "50%",
    width: 22,
    height: 22,
    cursor: "pointer",
    color: "#d9534f",
    fontWeight: "bold",
    lineHeight: "18px",
    padding: 0,
  },
  okayButton: {
    backgroundColor: "#5c9a6c",
    border: "none",
    color: "#fff",
    paddingBlock: "10px",
    paddingInline: "24px",
    width: "200px",
    marginBlock: 24,
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 16,
  },
  detailsTitle: {
    fontWeight: "bold",
    margin: 0,
    marginBottom: 16,
  },
  addBtn: {
    border: "none",
    color: "#888",
    fontSize: 20,
    cursor: "pointer",
    marginLeft: 8,
  },
  rightMessage: {
    color: "#aaa",
    marginTop: 80,
    textAlign: "center",
  },
  removeBtn: {
    border: "none",
    color: "#d9534f",
    fontSize: 20,
    cursor: "pointer",
    marginLeft: 8,
  },
  descriptionField: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 16,
  },
  selectedProductName: {
    width: "100%",
    textTransform: "capitalize",
    maxWidth: 480,
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: 480,
    marginBottom: 8,
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 6,
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 10,
  },
  imageUpload: {
    width: "100%",
    maxWidth: 480,
    height: 120,
    backgroundColor: "#ddd",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    cursor: "pointer",
    color: "#666",
    fontWeight: "bold",
  },
  tabs: {
    display: "flex",
    gap: 12,
    marginBottom: "12px",
  },
  rightPanel: {
    flex: 1,
    marginLeft: 32,
    overflowY: "auto",
  },
  productName: {
    fontWeight: 600,
    fontSize: 16,
    textTransform: "capitalize",
  },
  productCategory: {
    color: "#888",
    fontSize: 13,
    textTransform: "capitalize",
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    objectFit: "cover",
    marginRight: 14,
    background: "#ddd",
  },
  container: {
    display: "flex",
    height: "80vh",
    background: "#fff",
    borderRadius: 12,
    fontFamily: "Arial, sans-serif",
  },
  leftPanel: {
    width: 340,
    borderRight: "1px solid #eee",
    paddingRight: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    overflowY: "auto",
    flex: 0.7,
  },
  searchBox: {
    width: "100%",
    padding: 8,
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  productContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    padding: 32,
    width: 500,
    alignItems: "center",
  },
  qualityToggle: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  qualityButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 24,
    marginHorizontal: 4,
  },
  qualityButtonActive: {
    backgroundColor: "#5c9a6c",
  },
  qualityButtonText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 16,
  },
  qualityButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
