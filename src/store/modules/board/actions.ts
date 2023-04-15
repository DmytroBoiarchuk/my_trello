import api from '../../../common/constants/api';
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { BoardResp } from '../../../common/types/types';
import store from '../../store';
import { IList } from '../../../common/interfaces/IList';
import { ICard } from '../../../common/interfaces/ICard';
interface ResponseBoard {
  title: string;
  lists: IList[];
}
interface CardData {
  id: number;
  title?: string;
  position: number;
  list_id?: string;
}
export const changeCardDescription = async (
  dispatch: Dispatch,
  description: string,
  board_id: string,
  card_id: string,
  list_id: number
) => {
  try {
    if (description.length === 0) {
      description = ' ';
    }
    const data = { description: description, list_id: list_id };
    await instance.put(api.baseURL + '/board/' + board_id + '/card/' + card_id, data);
    getBoard(dispatch, board_id);
  } catch (e) {
    console.log(e);
  }
};
export const relocatePosBeforeReplacing = async (board_id: string, list_id: string, newPos: number) => {
  const board: ResponseBoard = await instance.get(api.baseURL + '/board/' + board_id);
  let update: CardData[] = [];
  board.lists.map((list) => {
    if (list.id.toString() === list_id) {
      for (let i = 0; i < list.cards.length; i++) {
        if (i < newPos) {
          update.push({ id: list.cards[i].id, position: i, list_id: list_id });
        } else {
          update.push({ id: list.cards[i].id, position: i + 1, list_id: list_id });
        }
      }
    }
  });
  await instance.put(`/board/${board_id}/card`, update);
};

export const replaceCard = async (
  boardId: string,
  pos: number | undefined,
  listId: string | undefined,
  currentCard: number,
  dispatch: Dispatch,
  currentList: IList | undefined,
  draggedCardPos: number,
  draggedCardList: number,
  draggedCardListArr: ICard[] | undefined
) => {
  try {
    const updated = [];
    if (currentList !== undefined) {
      if (listId !== undefined && draggedCardList.toString() === listId) {
        if (pos !== undefined && pos < draggedCardPos) {
          for (let i = 0; i < currentList.cards.length; i++) {
            let position;
            if (i < pos || i > draggedCardPos) {
              position = i;
              updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
            }
            if (i >= pos && i < draggedCardPos) {
              position = i + 1;
              updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
            }
            if (i === draggedCardPos) {
              updated.push({ id: currentCard, position: pos, list_id: listId });
            }
          }
        }
        if (pos !== undefined && pos - 1 > draggedCardPos) {
          for (let i = 0; i < currentList.cards.length; i++) {
            let position;
            if (i < draggedCardPos || i > pos - 1) {
              position = i;
              updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
            }
            if (i === draggedCardPos) {
              updated.push({ id: currentCard, position: pos - 1, list_id: listId });
            }
            if (i > draggedCardPos && i <= pos - 1) {
              position = i - 1;
              updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
            }
          }
        }
        await instance.put(`/board/${boardId}/card`, updated);
      } else {
        let position;
        for (
          let i = 0;
          i < (pos === currentList.cards.length ? currentList.cards.length + 1 : currentList.cards.length);
          i++
        ) {
          if (pos !== undefined && i < pos) {
            position = i;
            updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
          }
          if (i === pos) {
            updated.push({ id: currentCard, position: pos, list_id: listId });
          }
          if (pos !== undefined && i >= pos && pos !== currentList.cards.length) {
            position = i + 1;
            updated.push({ id: currentList.cards[i].id, position: position, list_id: listId });
          }
        }
        if (draggedCardListArr !== undefined) {
          draggedCardListArr.map((cards) => {
            if (cards.position > draggedCardPos) {
              updated.push({ id: cards.id, position: cards.position - 1, list_id: draggedCardList });
            }
          });
        }
        await instance.put(`/board/${boardId}/card`, updated);
      }
    }
    await getBoard(dispatch, boardId);
  } catch (e) {
    console.log(e);
  }
};

export const changePosAfterDeleting = async (
  dispatch: Dispatch,
  iList: IList,
  card_id: number,
  board_id: string,
  list_id: number
) => {
  let listData: { id: number; position: number; list_id: number }[] = [];
  let deletedCardPos: number;
  iList.cards.map((card) => {
    if (card.id === card_id) {
      deletedCardPos = card.position;
    }
  });
  iList.cards.map((card) => {
    if (card.position < deletedCardPos) {
      listData.push({ id: card.id, position: card.position, list_id: list_id });
    }
    if (card.position > deletedCardPos) {
      listData.push({ id: card.id, position: card.position - 1, list_id: list_id });
    }
  });
  await instance.put(`/board/${board_id}/card`, listData).then(() => {
    instance.delete(`/board/${board_id}/card/${card_id}`).then(() => getBoard(dispatch, board_id));
  });
};

export const clearStore = () => {
  store.dispatch({ type: 'DELETE_STORE_BOARD', payload: '' });
};
export const deleteCard = async (
  dispatch: Dispatch,
  board_id: string,
  card_id: number,
  lists: IList[],
  list_id: number
) => {
  try {
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].id === list_id && lists[i].cards.length !== 0) {
        changePosAfterDeleting(dispatch, lists[i], card_id, board_id, list_id);
      }
    }
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return '';
  }
};

export const renameCard = async (
  dispatch: Dispatch,
  board_id: string,
  list_id: number,
  card_id: number,
  title: string
) => {
  try {
    await instance.put(`/board/${board_id}/card/${card_id}`, {
      title: title,
      list_id,
    });
    await getBoard(dispatch, board_id);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return '';
  }
};
export const addNewCard = async (
  dispatch: Dispatch,
  position: number,
  board_id: string,
  title: string,
  list_id: number,
  doUpdateBoard: boolean,
  description?: string
) => {
  try {
    const descriptionCheck = description ? description : ' ';
    await instance.post(`/board/${board_id}/card`, {
      title: title,
      list_id: list_id,
      position: position,
      description: descriptionCheck,
      custom: '',
    });
    if (doUpdateBoard) await getBoard(dispatch, board_id);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return '';
  }
};
export const getBoardTitle = async (dispatch: Dispatch, id: string) => {
  try {
    const response: BoardResp = await instance.get('/board/' + id);
    return response.title;
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return '';
  }
};
export const getBoardForModal = async (dispatch: Dispatch, id: string) => {
  try {
    const board: ResponseBoard = await instance.get(api.baseURL + '/board/' + id);
    return board;
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const getBoard = async (dispatch: Dispatch, id: string) => {
  try {
    const board: ResponseBoard = await instance.get(api.baseURL + '/board/' + id);
    dispatch({ type: 'UPDATE_BOARD', payload: board });
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const deleteListFetch = async (dispatch: Dispatch, board_id: string, list_id: number) => {
  try {
    await instance.delete(api.baseURL + '/board/' + board_id + '/list/' + list_id);
    await getBoard(dispatch, board_id);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const addList = async (dispatch: Dispatch, id: string, title?: { position: number; title: string }) => {
  try {
    await instance.post(api.baseURL + '/board/' + id + '/list', title);
    await getBoard(dispatch, id);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const changeBoardName = async (dispatch: Dispatch, id: string, NewTitle: string) => {
  try {
    await instance.put(api.baseURL + '/board/' + id, { title: NewTitle });
    await getBoard(dispatch, id);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const renameList = async (dispatch: Dispatch, board_id: string, List_id: number, NewTitle: string) => {
  await instance.put(api.baseURL + '/board/' + board_id + '/list/' + List_id, { title: NewTitle });
  await getBoard(dispatch, board_id);
};
