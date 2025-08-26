/* eslint-disable prettier/prettier */
// utils/SelectionStore.js
import { create } from 'zustand';

let selectedNodeIds = []; // This will hold one or multiple node_ids
let selectedItem = null;  // Optionally store item data (type, name, etc.)

export const useSelectionStore = create((set) => ({
  selectedItem: null,
  selectedNodeId: [],
  setSelectedItem: (item) =>
    set(() => ({
      selectedItem: item,
      selectedNodeId: Array.isArray(item.node_id) ? item.node_id : [item.node_id],
    })),
}));

export function setSelectedItem(item) {
  selectedItem = item;
  if (item.type === 'Stall') {
    selectedNodeIds = [item.node_id];
  } else {
    selectedNodeIds = item.node_id instanceof Array ? item.node_id : [item.node_id];
  }

  console.log('[SelectionStore] Selected Item:', selectedItem);
  console.log('[SelectionStore] Selected Node IDs:', selectedNodeIds);
}

export function getSelectedNodeIds() {
  return selectedNodeIds;
}

export function getSelectedItem() {
  return selectedItem;
}
