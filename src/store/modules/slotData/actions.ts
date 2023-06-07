import { PayloadAction } from '@reduxjs/toolkit';
import { TypeForSlotData } from '../../../common/types/types';

export const putSlotData = (
  height: number,
  currentCardId: number,
  draggedCardListId: number,
  draggedCardPos: number,
  title: string
): TypeForSlotData => ({
  type: 'PUT_DRAGGED_CARD_DATA',
  payload: { height, currentCardId, draggedCardListId, draggedCardPos, title },
});

export const setPrevId = (id: number): PayloadAction<number> => ({ type: 'PREV_ID', payload: id });
export const setSlotPos = (pos: number): PayloadAction<number> => ({ type: 'SET_SLOT_POS', payload: pos });
export const setCurrentList = (id: number): PayloadAction<number> => ({ type: 'SET_CURRENT_LIST', payload: id });
export const isCardDragged = (isDragged: boolean): PayloadAction<boolean> => ({
  type: 'IS_CARD_DRAGGED',
  payload: isDragged,
});
