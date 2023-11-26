import { AnyAction } from 'redux';

const initialState: SlotDataType = {
  slotHeight: 0,
  isOriginSlotShown: true,
  currentCard: 0,
  draggedCardList: 0,
  slotPos: -2,
  currentList: 0,
  draggedCardPos: null,
  draggedCardTitle: '',
  isCardDragged: false,
  draggedListId: 0,
  isItCArdDragged: true,
};
type SlotDataType = {
  slotHeight: number;
  isOriginSlotShown: boolean;
  currentCard: number;
  draggedCardList: number;
  slotPos: number;
  currentList: number;
  draggedCardPos: number | null;
  draggedCardTitle: string;
  isCardDragged: boolean;
  draggedListId: number;
  isItCArdDragged: boolean;
};

export default function reducer(state = initialState, action: AnyAction): SlotDataType {
  switch (action.type) {
    case 'IS_IT_CARD_DRAGGED':
      return {
        ...state,
        isItCArdDragged: action.payload,
      };
    case 'DRAGGED_LIST_ID':
      return {
        ...state,
        draggedListId: action.payload,
      };
    case 'ORIGIN_SLOT_SHOWN':
      return {
        ...state,
        isOriginSlotShown: action.payload,
      };
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
    default: {
      return { ...state };
    }
  }
}
