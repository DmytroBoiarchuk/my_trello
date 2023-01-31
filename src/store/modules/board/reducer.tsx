const initialState = {
  board: { title: '', lists: [], id: undefined },
  loading: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'UPDATE_BOARD':
      return {
        ...state,
        title: action.payload.title,
        lists: action.payload.lists,
      };
    default: {
      return { ...state, ...action.payload };
    }
  }
}
