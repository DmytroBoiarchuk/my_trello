const initialState = {
  title: '',
  lists: [],
  id: undefined,
  loading: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'UPDATE_BOARD_DND':
      return {
        ...state,
        lists: action.payload,
      };
    case 'UPDATE_BOARD':
      return {
        ...state,
        title: action.payload.title,
        lists: action.payload.lists,
      };
    case 'DELETE_STORE_BOARD':
      return {
        title: '',
        lists: [],
      };
    default: {
      return { ...state };
    }
  }
}
