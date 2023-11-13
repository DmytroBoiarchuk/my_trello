import { Dispatch } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import axiosConfig from '../../../api/request';
import api from '../../../common/constants/api';
import { AuthorizationData } from '../../../common/types/types';

export const toggleAuthorisation = async (
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<AuthorizationData | undefined> => {
  try {
    dispatch({ type: 'IS_AUTHORIZED', payload: true });
    return await axiosConfig.post(
      `${api.baseURL}/login`,
      { email, password },
      {
        headers: {
          Authorization: undefined,
        },
      }
    );
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return undefined;
  }
};
export const logOut = async (): Promise<void> => {
  await axiosConfig.post('/refresh', { refreshToken: localStorage.getItem('refresh_token') });
  await localStorage.removeItem('access_token');
};
export const setIsAuthorized = (isAuthorized: boolean): PayloadAction<boolean> => ({
  type: 'IS_AUTHORIZED',
  payload: isAuthorized,
});
