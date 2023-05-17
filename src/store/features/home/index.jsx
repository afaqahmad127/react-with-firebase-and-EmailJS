import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [],
};

export const homeSlice = createSlice({
	name: 'home',
	initialState,
	reducers: {
		addDataSource: (state = initialState, action) => {
			state.data = action.payload;
		},
	},
});

export const { addDataSource } = homeSlice.actions;

export const dataSource = (state) => state[homeSlice.name].data;
