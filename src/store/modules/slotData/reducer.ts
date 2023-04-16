const initialState = {
  slotHeight: 0,
  prevId: 0,
  currentCard: 0,
  draggedCardList: 0,
  slotPos: -2,
  lastEmptyList: 0,
  draggedCardPos: null,
  draggedCardTitle: '',
  isItCard: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'SET_TITLE_CARD':
      return {
        ...state,
        draggedCardTitle: action.payload,
      };
    case 'SET_DRAGGED_CARD_POS':
      return {
        ...state,
        draggedCardPos: action.payload,
      };
    case 'SET_LAST_EMPTY_LIST':
      return {
        ...state,
        lastEmptyList: action.payload,
      };
    case 'SET_SLOT_POS':
      return {
        ...state,
        slotPos: action.payload,
      };
    case 'CURRENT_HEIGHT':
      return {
        ...state,
        slotHeight: action.payload,
      };
    case 'PREV_ID':
      return {
        ...state,
        prevId: action.payload,
      };
    case 'SET_CURRENT_CARD':
      return {
        ...state,
        currentCard: action.payload,
      };
    case 'DELETE_ID':
      return {
        ...state,
        prevId: 0,
      };
    case 'SET_DRAGGED_CARD_LIST':
      return {
        ...state,
        draggedCardList: action.payload,
      };
    default: {
      return { ...state };
    }
  }
}
