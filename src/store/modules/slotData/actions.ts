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

export const setIsOriginSlotShown = (isOriginSlotShown: boolean): PayloadAction<boolean> => ({
  type: 'ORIGIN_SLOT_SHOWN',
  payload: isOriginSlotShown,
});
export const setSlotPos = (pos: number): PayloadAction<number> => ({ type: 'SET_SLOT_POS', payload: pos });
export const setCurrentList = (id: number): PayloadAction<number> => ({ type: 'SET_CURRENT_LIST', payload: id });
export const isCardDragged = (isDragged: boolean): PayloadAction<boolean> => ({
  type: 'IS_CARD_DRAGGED',
  payload: isDragged,
});
export const setDraggedListId = (listId: number): PayloadAction<number> => ({
  type: 'DRAGGED_LIST_ID',
  payload: listId,
});
