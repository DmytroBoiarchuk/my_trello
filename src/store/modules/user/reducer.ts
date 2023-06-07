import { AnyAction } from 'redux';

const initialState = {};

export default function reducer(state = initialState, action: AnyAction): NonNullable<unknown> {
  switch (action.type) {
    default: {
      return { ...state };
    }
  }
}
