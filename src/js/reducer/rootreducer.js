import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keyword: '',
  status: '',
  dateRange: {
    start: null,
    end: null,
  },
  orderedby: '', // Added orderedby field
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setOrderedBy: (state, action) => { // Added orderedby setter
      state.orderedby = action.payload;
    },
    resetKeyword: (state) => {
      state.keyword = '';
    },
    resetStatus: (state) => {
      state.status = '';
    },
    resetDateRange: (state) => {
      state.dateRange = { start: null, end: null };
    },
    resetOrderedBy: (state) => { // Added reset for orderedby
      state.orderedby = '';
    },
    resetFilters: () => initialState, // Reset all fields at once
  },
});

export const { 
  setKeyword, 
  setStatus, 
  setDateRange, 
  setOrderedBy,  // Export the setter
  resetKeyword, 
  resetStatus, 
  resetDateRange, 
  resetOrderedBy, // Export the resetter
  resetFilters 
} = searchSlice.actions;

export default searchSlice.reducer ;
