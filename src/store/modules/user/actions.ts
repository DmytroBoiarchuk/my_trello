import { Dispatch } from 'redux';
import instance from '../../../api/request';
import api from '../../../common/constants/api';
import { AuthorizationData } from '../../../common/types/types';

export const authorisationFetch = async (
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<AuthorizationData | undefined> => {
  try {
    dispatch({ type: 'IS_AUTHORIZED', payload: true });
    return await instance.post(`${api.baseURL}/login`, { email, password });
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
    return undefined;
  }
};
export const logOut = async (): Promise<void> => {
  await instance.post('/refresh', { refreshToken: localStorage.getItem('refresh_token') });
  await localStorage.removeItem('access_token');
};
