import axios from 'axios';
import { api } from '../common/constants';
import { setLoading } from '../store/modules/loading/actions';
import store from '../store/store';
import { AuthorizationData } from '../common/types/types';
import { useSweetAlert } from '../common/functions/sweetAlertHandler';

const axiosConfig = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

axiosConfig.interceptors.request.use((config) => {
  store.dispatch(setLoading(true));
  return config;
});

axiosConfig.interceptors.response.use((res) => {
  store.dispatch(setLoading(false));
  return res.data;
});

const refreshToken = async (): Promise<void> => {
  const response: AuthorizationData = await axiosConfig.post('/refresh', {
    refreshToken: localStorage.getItem('refresh_token'),
  });
  localStorage.setItem('access_token', response.token);
  localStorage.setItem('refresh_token', response.refreshToken);
  axiosConfig.defaults.headers.Authorization = `Bearer ${response.token}`;
};

axiosConfig.interceptors.response.use(undefined, (error) => {
  if (!(error.response.data.error === 'Unauthorized')) {
    useSweetAlert(error.response.data.error);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000000);
  } else if (window.location.pathname === '/login') {
    useSweetAlert('Wrong login or password');
  } else if (localStorage.getItem('access_token') === null) {
    window.location.href = '/login';
  } else {
    refreshToken().catch(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    });
  }
});
export default axiosConfig;
