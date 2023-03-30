import api from '../../../common/constants/api';
import { Dispatch } from 'redux';
import { IBoard } from '../../../common/interfaces/IBoard';
import instance from '../../../api/request';
import store from '../../store';
import { clearStore } from '../board/actions';
interface Response {
  boards: IBoard[];
}

export const getBoards = async (dispatch: Dispatch) => {
  // clearStore();
  try {
    const { boards }: Response = await instance.get(api.baseURL + '/board');
    dispatch({ type: 'UPDATE_BOARDS', payload: boards });
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const createBoard = (title: string) => async (dispatch: Dispatch) => {
  try {
    await instance.post(api.baseURL + '/board', { title });
    await getBoards(dispatch);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const deleteBoard = (id: number) => async (dispatch: Dispatch) => {
  try {
    await instance.delete(api.baseURL + '/board/' + id);
    await getBoards(dispatch);
  } catch (e) {
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
