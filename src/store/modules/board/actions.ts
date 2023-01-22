import api from '../../../common/constants/api';
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { BoardResp } from '../../../common/types/types';
interface ResponseBoard {
  title: string;
  lists: [{ id: number }];
}
export const getBoardTitle = async (dispatch: Dispatch, id: string) => {
  const response: BoardResp = await instance.get('/board/' + id);
  return response.title;
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
