import { AnyAction } from 'redux';
import { BoardsInterface } from '../../../common/interfaces/IBoard';

const initialState: BoardsInterface[] = [];

export default function reducer(state = initialState, action: AnyAction): BoardsInterface {
  switch (action.type) {
    case 'DELETE_STORE':
      return {
        boards: [],
      };
    case 'UPDATE_BOARDS':
      return {
        ...state,
        boards: action.payload,
      };
    default: {
      return { boards: [], ...state };
    }
  }
}
