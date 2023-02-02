import { IBoard } from '../../../common/interfaces/IBoard';

const initialState: IBoard = {
  id: 0,
  title: '',
  lists: [],
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
