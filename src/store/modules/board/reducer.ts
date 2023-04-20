import { IList } from '../../../common/interfaces/IList';
import { ICard } from '../../../common/interfaces/ICard';

const initialState = {
  title: '',
  lists: [],
  id: undefined,
  loading: false,
};

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'PUT_RENAMED_TO_STORE':
      const { card_title, listId, cardId } = action.payload;
      const newLists = state.lists.map((list: IList) => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map((card: ICard) => {
              if (card.id === cardId) {
                return { id: 0, title: card_title, description: '', position: 0 };
              } else {
                return card;
              }
            }),
          };
        } else {
          return list;
        }
      });
      return {
        ...state,
        lists: newLists,
      };
    case 'ADD_NEW_CARD_TO_STORE':
      const { title, list_id } = action.payload;
      const lists = state.lists.map((list: IList) => {
        if (list.id === list_id) {
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
        title: '',
        lists: [],
      };
    default: {
      return { ...state };
    }
  }
}
