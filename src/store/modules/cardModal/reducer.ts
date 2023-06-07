import { AnyAction } from 'redux';
import { CardModalType } from '../../../common/types/types';

const initialState: CardModalType = {
  card: {
    id: 0,
  },
  isOpen: false,
};

export default function reducer(state = initialState, action: AnyAction): CardModalType {
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
