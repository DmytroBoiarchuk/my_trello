import { Dispatch } from 'redux';
import { NavigateFunction } from 'react-router-dom';
import { toggleAuthorisation, setIsAuthorized } from '../../store/modules/user/actions';
import instance from '../../api/request';
import api from '../constants/api';

export const authorizeFunc = (
  email: string,
  password: string,
  dispatch: Dispatch,
  navigate: NavigateFunction
): void => {
  toggleAuthorisation(email, password, dispatch).then((authorisationData) => {
    if (authorisationData) {
      localStorage.setItem('access_token', authorisationData.token);
      localStorage.setItem('refresh_token', authorisationData.refreshToken);
      instance.defaults.headers.Authorization = `Bearer ${authorisationData.token}`;
      if (authorisationData.result === 'Authorized') {
        setIsAuthorized(true);
        navigate('/');
      }
    }
  });
};

export const userRegistration = async (
  email: string,
  password: string,
  dispatch: Dispatch,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    await instance.post(
      `${api.baseURL}/user`,
      { email, password },
      {
        headers: {
          Authorization: undefined,
        },
      }
    );
    await authorizeFunc(email, password, dispatch, navigate);
  } catch (e) {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
