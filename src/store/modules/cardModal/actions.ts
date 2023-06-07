import { PayloadAction } from '@reduxjs/toolkit';

export const putCardData = (card: { id: number }): PayloadAction<{ id: number }> => ({
  type: 'CURRENT_CARD_DATA',
  payload: card,
});
export const setModalCardEditBig = (isOpen: boolean): PayloadAction<boolean> => ({
  type: 'SET_MODAL_OPENING',
  payload: isOpen,
});
