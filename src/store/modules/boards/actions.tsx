import { Dispatch } from 'redux';
import api from '../../../common/constants/api';
import instance from '../../../api/request';
import { Response } from '../../../common/types/types';

export const getBoards = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { boards }: Response = await instance.get(`${api.baseURL}/board`);
    dispatch({ type: 'UPDATE_BOARDS', payload: boards });
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const createBoard = async (title: string, dispatch: Dispatch): Promise<void> => {
  try {
    await instance.post(`${api.baseURL}/board`, { title });
    await getBoards(dispatch);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
export const deleteBoard =
  (id: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      await instance.delete(`${api.baseURL}/board/${id}`);
      await getBoards(dispatch);
    } catch (e) {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
