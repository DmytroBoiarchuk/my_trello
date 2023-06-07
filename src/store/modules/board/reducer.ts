import { AnyAction } from 'redux';
import { IList } from '../../../common/interfaces/IList';
import { ICard } from '../../../common/interfaces/ICard';
import { IBoard } from '../../../common/interfaces/IBoard';

const initialState: IBoard = {
  title: '',
  lists: [],
  id: 0,
};

export default function reducer(state = initialState, action: AnyAction): IBoard {
  switch (action.type) {
    case 'QUICK_DELETE_CARD': {
      const { listData } = action.payload;
      return {
        ...state,
        lists: listData,
      };
    }
    case 'PUT_RENAMED_TO_STORE': {
      const { cardTitle, listId, cardId } = action.payload;
      const newLists = state.lists.map((list: IList) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map((card: ICard) => {
              if (card.id === cardId) {
                return { id: 0, title: cardTitle, description: '', position: 0 };
              }
              return card;
            }),
          };
        }
        return list;
      });
      return {
        ...state,
        lists: newLists,
      };
    }
    case 'ADD_NEW_CARD_TO_STORE': {
      const { title, ListId } = action.payload;
      const lists = state.lists.map((list: IList) => {
        if (list.id === ListId) {
          return {
            ...list,
            cards: [...list.cards, { id: 0, title, description: '', position: 999999 }],
          };
        }
        return list;
      });
      return {
        ...state,
        lists,
      };
    }
    case 'ADD_EMPTY_LIST':
      return {
        ...state,
        lists: [...state.lists, { id: 9999999999999, title: action.payload, position: 1, cards: [] }],
      };
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
        id: 0,
        title: '',
        lists: [],
      };
    default: {
      return { ...state };
    }
  }
}
