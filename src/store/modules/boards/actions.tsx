import { Dispatch } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import api from '../../../common/constants/api';
import instance from '../../../api/request';
import { Response } from '../../../common/types/types';

export const clearEntireStore = (): PayloadAction<string> => ({ type: 'DELETE_STORE', payload: '' });
export const getBoards = async (dispatch: Dispatch): Promise<void> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };
    const { boards }: Response = await instance.get(`${api.baseURL}/board`, config);
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
