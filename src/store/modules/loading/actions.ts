import { PayloadAction } from '@reduxjs/toolkit';

export const setLoading = (isShown: boolean): PayloadAction<boolean> => ({ type: 'LOADING', payload: isShown });
