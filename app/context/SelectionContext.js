/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  // Track which business is currently active (e.g., 'vegetable1', 'barbershop1')
  const [currentBusinessId, setCurrentBusinessId] = useState(null);
  // Store listings per business id
  const [listingsByBusiness, setListingsByBusiness] = useState({});

  const listings = currentBusinessId
    ? listingsByBusiness[currentBusinessId] || []
    : [];

  const addListing = (listing) => {
    if (!currentBusinessId) return; // ignore if business context not set
    setListingsByBusiness((prev) => {
      const prevList = prev[currentBusinessId] || [];
      return { ...prev, [currentBusinessId]: [...prevList, listing] };
    });
  };

  // Bulk add listings for current business; skip duplicates by name+category.
  // Returns a summary: { added, skipped, addedCount, skippedCount }
  const addListingsBulk = (items) => {
    if (!currentBusinessId || !Array.isArray(items) || items.length === 0) {
      return { added: [], skipped: items || [], addedCount: 0, skippedCount: (items || []).length };
    }

    let added = [];
    let skipped = [];

    setListingsByBusiness((prev) => {
      const prevList = prev[currentBusinessId] || [];
      const exists = new Set(prevList.map((l) => `${l.name}__${l.category}`));

      const toAdd = [];
      for (const item of items) {
        const key = `${item?.name}__${item?.category}`;
        if (!item?.name || !item?.category || exists.has(key)) {
          skipped.push(item);
        } else {
          exists.add(key);
          toAdd.push(item);
          added.push(item);
        }
      }

      return { ...prev, [currentBusinessId]: [...prevList, ...toAdd] };
    });

    return { added, skipped, addedCount: added.length, skippedCount: skipped.length };
  };

  const removeListing = (index) => {
    if (!currentBusinessId) return;
    setListingsByBusiness((prev) => {
      const prevList = prev[currentBusinessId] || [];
      return {
        ...prev,
        [currentBusinessId]: prevList.filter((_, i) => i !== index),
      };
    });
  };

  const updateListing = (index, updatedListing) => {
    if (!currentBusinessId) return;
    setListingsByBusiness((prev) => {
      const prevList = prev[currentBusinessId] || [];
      return {
        ...prev,
        [currentBusinessId]: prevList.map((l, i) => (i === index ? updatedListing : l)),
      };
    });
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        currentBusinessId,
        setCurrentBusinessId,
        listings,
        addListing,
        removeListing,
        updateListing,
        addListingsBulk,
        // expose raw map if ever needed
        listingsByBusiness,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
