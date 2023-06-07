import axios from 'axios';
import Swal from 'sweetalert2';
import { api } from '../common/constants';
import { setLoading } from '../store/modules/loading/actions';
import store from '../store/store';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});
instance.interceptors.request.use((config) => {
  store.dispatch(setLoading(true));
  return config;
});
instance.interceptors.response.use((res) => {
  store.dispatch(setLoading(false));
  return res.data;
});
instance.interceptors.response.use(undefined, (error) => {
  Swal.fire({
    icon: 'error',
    iconColor: '#da4c4c',
    showConfirmButton: false,
    showCloseButton: true,
    text: `Error: ${error.response.data.error}!`,
  });
});
export default instance;
