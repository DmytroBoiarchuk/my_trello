import { AnyAction } from 'redux';
import { LoadingType } from '../../../common/types/types';

const initialState = {
  loading: false,
};

export default function reducer(state = initialState, action: AnyAction): LoadingType {
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
