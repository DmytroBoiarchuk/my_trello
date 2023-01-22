const initialState = {};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    default: {
      return { ...state, ...action.payload };
    }
  }
}
