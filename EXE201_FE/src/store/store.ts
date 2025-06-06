import { configureStore } from "@reduxjs/toolkit";
import anagramSliceReducer from './anagramSlice';
import userSliceReducer from './userSlice';

export const store = configureStore({
    reducer: {
        anagram: anagramSliceReducer,
        user: userSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;