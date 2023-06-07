import { AnyAction } from 'redux';

const initialState: SlotDataType = {
  slotHeight: 0,
  prevId: 0,
  currentCard: 0,
  draggedCardList: 0,
  slotPos: -2,
  currentList: 0,
  draggedCardPos: null,
  draggedCardTitle: '',
  isCardDragged: false,
};
type SlotDataType = {
  slotHeight: number;
  prevId: number;
  currentCard: number;
  draggedCardList: number;
  slotPos: number;
  currentList: number;
  draggedCardPos: number | null;
  draggedCardTitle: string;
  isCardDragged: boolean;
};

export default function reducer(state = initialState, action: AnyAction): SlotDataType {
  switch (action.type) {
    case 'PUT_DRAGGED_CARD_DATA':
      return {
        ...state,
        slotHeight: action.payload.height,
        currentCard: action.payload.currentCardId,
        draggedCardList: action.payload.draggedCardListId,
        draggedCardPos: action.payload.draggedCardPos,
        draggedCardTitle: action.payload.title,
      };
    case 'IS_CARD_DRAGGED':
      return {
        ...state,
        isCardDragged: action.payload,
      };
    case 'SET_CURRENT_LIST':
      return {
        ...state,
        currentList: action.payload,
      };
    case 'SET_SLOT_POS':
      return {
        ...state,
        slotPos: action.payload,
      };
    case 'PREV_ID':
      return {
        ...state,
        prevId: action.payload,
      };
    case 'DELETE_ID':
      return {
        ...state,
        prevId: 0,
      };
    default: {
      return { ...state };
    }
  }
}
