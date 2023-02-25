const initialState = {
  slotHeight: 0,
  prevId: 0,
  currentCard: 0,
  last: 0,
  slotPos: 0,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
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
    case 'SET_LAST_SLOT':
      return {
        ...state,
        last: action.payload,
      };
    default: {
      return { ...state };
    }
  }
}
