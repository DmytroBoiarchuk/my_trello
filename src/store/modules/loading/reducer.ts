const initialState = {
  board: { title: '', lists: [], id: undefined },
  loading: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default: {
      return { ...state };
    }
  }
}
