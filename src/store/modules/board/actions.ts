import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import api from '../../../common/constants/api';
import axiosConfig from '../../../api/request';
import { BoardResp, CardTypeForPutRequest, ResponseBoard } from '../../../common/types/types';
import { IList } from '../../../common/interfaces/IList';
import { ICard } from '../../../common/interfaces/ICard';
import {
  deleteCardHandler,
  quickCardDeletingHandler,
  relocatePosBeforeReplacingHandler,
  replaceCardHandler,
} from '../../../common/functions/functionsForActions';

export const quickSetDescription = (
  board: { title: string; lists: IList[] },
  description: string,
  listId: number,
  cardId: number,
  dispatch: Dispatch
): void => {
  const updatedBoard = board.lists.map((list) => {
    if (list.id === listId) {
      return {
        ...list,
        cards: [
          ...list.cards.map((card) => {
            if (card.id === cardId) {
              return { ...card, description };
            }
            return card;
          }),
        ],
      };
    }
    return list;
  });
  dispatch({ type: 'UPDATE_DESCRIPTION', payload: updatedBoard });
};

export const getBoard = async (dispatch: Dispatch, id: string): Promise<void> => {
  try {
    const board: ResponseBoard = await axiosConfig.get(`${api.baseURL}/board/${id}`);
    dispatch({ type: 'UPDATE_BOARD', payload: board });
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const changeCardDescription = async (
  dispatch: Dispatch,
  description: string,
  board_id: string,
  card_id: string,
  list_id: number
): Promise<void> => {
  try {
    await axiosConfig.put(`${api.baseURL}/board/${board_id}/card/${card_id}`, { description, list_id });
    await getBoard(dispatch, board_id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const changePosBeforeReplacing = async (board_id: string, list_id: number, newPos: number): Promise<void> => {
  const board: ResponseBoard = await axiosConfig.get(`${api.baseURL}/board/${board_id}`);
  await axiosConfig.put(`/board/${board_id}/card`, relocatePosBeforeReplacingHandler(board, board_id, list_id, newPos));
};

export const replaceCard = async (
  boardId: string,
  pos: number | undefined,
  listId: number | undefined,
  currentCard: number,
  dispatch: Dispatch,
  currentList: IList | undefined,
  draggedCardPos: number,
  draggedCardList: number,
  draggedCardListArr: ICard[] | undefined
): Promise<void> => {
  try {
    const updatedList = replaceCardHandler(
      boardId,
      pos,
      listId,
      currentCard,
      dispatch,
      currentList,
      draggedCardPos,
      draggedCardList,
      draggedCardListArr
    );
    await axiosConfig.put(`/board/${boardId}/card`, updatedList);
    await getBoard(dispatch, boardId);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};

export const clearStore = (): PayloadAction<string> => ({ type: 'DELETE_STORE_BOARD', payload: '' });
export const deleteCard = async (
  dispatch: Dispatch,
  board_id: string,
  card_id: number,
  lists: IList[],
  list_id: number
): Promise<void> => {
  try {
    dispatch({
      type: 'QUICK_DELETE_CARD',
      payload: { listData: quickCardDeletingHandler(lists, list_id, card_id) },
    });
    const listData: CardTypeForPutRequest[] = deleteCardHandler(dispatch, board_id, card_id, lists, list_id);
    await axiosConfig.put(`/board/${board_id}/card`, listData).then(() => {
      axiosConfig.delete(`/board/${board_id}/card/${card_id}`).then(() => getBoard(dispatch, board_id));
    });
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};

export const renameCard = async (
  dispatch: Dispatch,
  board_id: string,
  list_id: number,
  card_id: number,
  title: string
): Promise<void> => {
  try {
    dispatch({ type: 'QUICK_RENAME_CARD', payload: { cardTitle: title, listId: list_id, cardId: card_id } });
    await axiosConfig.put(`/board/${board_id}/card/${card_id}`, {
      title,
      list_id,
    });
    await getBoard(dispatch, board_id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const addNewCard = async (
  dispatch: Dispatch,
  position: number,
  board_id: string,
  title: string,
  list_id: number,
  doUpdateBoard: boolean,
  description?: string,
  isCopying?: boolean
): Promise<void> => {
  try {
    if (isCopying === undefined) dispatch({ type: 'QUICK_ADD_NEW_CARD', payload: { title, ListId: list_id } });
    await axiosConfig.post(`/board/${board_id}/card`, {
      title,
      list_id,
      position,
      description,
      custom: '',
    });
    if (doUpdateBoard) await getBoard(dispatch, board_id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const getBoardTitle = async (dispatch: Dispatch, id: string): Promise<string> => {
  try {
    const response: BoardResp = await axiosConfig.get(`/board/${id}`);
    return response.title;
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return '';
  }
};
export const getBoardForModal = async (
  dispatch: Dispatch,
  id: string
): Promise<{ title?: string | undefined; lists: IList[] }> => {
  try {
    return await axiosConfig.get(`${api.baseURL}/board/${id}`);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return { title: '', lists: [] };
  }
};

export const deleteListFetch = async (
  dispatch: Dispatch,
  board_id: string,
  list_id: number,
  newListPoses: { id: number; position: number }[]
): Promise<void> => {
  try {
    await axiosConfig.delete(`${api.baseURL}/board/${board_id}/list/${list_id}`);
    await axiosConfig.put(`${api.baseURL}/board/${board_id}/list`, newListPoses);
    await getBoard(dispatch, board_id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const addList = async (
  dispatch: Dispatch,
  id: string,
  title: { position: number; title: string }
): Promise<void> => {
  try {
    dispatch({ type: 'ADD_EMPTY_LIST', payload: title.title });
    await axiosConfig.post(`${api.baseURL}/board/${id}/list`, title);
    await getBoard(dispatch, id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const changeBoardName = async (dispatch: Dispatch, id: string, NewTitle: string): Promise<void> => {
  try {
    await axiosConfig.put(`${api.baseURL}/board/${id}`, { title: NewTitle });
    await getBoard(dispatch, id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const renameList = async (
  dispatch: Dispatch,
  board_id: string,
  List_id: number,
  NewTitle: string
): Promise<void> => {
  try {
    await axiosConfig.put(`${api.baseURL}/board/${board_id}/list/${List_id}`, { title: NewTitle });
    await getBoard(dispatch, board_id);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};

export const setNewListOfLists = (newListOfLists: IList[]): PayloadAction<IList[]> => ({
  type: 'DRAG_LIST',
  payload: newListOfLists,
});
export const fetchNewListOfLists = async (
  dispatch: Dispatch,
  board_id: string,
  newListOfLists: { id: number; position: number }[]
): Promise<void> => {
  try {
    await axiosConfig.put(`${api.baseURL}/board/${board_id}/list`, newListOfLists);
  } catch (err) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
