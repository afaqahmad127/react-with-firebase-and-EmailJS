import { configureStore } from '@reduxjs/toolkit';
import { homeSlice } from './features';
export const store = configureStore({
	reducer: {
		[homeSlice.name]: homeSlice.reducer,
	},
});
