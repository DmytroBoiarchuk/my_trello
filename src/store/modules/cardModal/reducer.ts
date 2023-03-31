const initialState = {
  card: {
    id: 0,
  },
  isOpen: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'SET_MODAL_OPENING':
      return {
        ...state,
        isOpen: action.payload,
      };
    case 'CURRENT_CARD_DATA':
      return {
        ...state,
        card: action.payload,
      };
    default: {
      return { ...state };
    }
  }
}
