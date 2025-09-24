/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [listings, setListings] = useState([]);

  const addListing = (listing) => {
    setListings(prevListings => [...prevListings, listing]);
  };

  const removeListing = (index) => {
    setListings(prevListings => prevListings.filter((_, i) => i !== index));
  };

  const updateListing = (index, updatedListing) => {
    setListings(prevListings => 
      prevListings.map((listing, i) => i === index ? updatedListing : listing)
    );
  };

  return (
    <SelectionContext.Provider value={{ 
      selectedItem, 
      setSelectedItem, 
      listings, 
      setListings, 
      addListing, 
      removeListing, 
      updateListing 
    }}>
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
