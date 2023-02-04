import axios from 'axios';
import { api } from '../common/constants';
import { setLoading } from '../store/modules/loading/actiong';
import Swal from 'sweetalert2';

//123
const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});
instance.interceptors.request.use(function (config) {
  setLoading(true);
  return config;
});
instance.interceptors.response.use(function (res) {
  setLoading(false);
  return res.data;
});
instance.interceptors.response.use(undefined, (error) => {
  Swal.fire({
    icon: 'error',
    iconColor: '#da4c4c',
    showConfirmButton: false,
    showCloseButton: true,
    text: 'Error: ' + error.response.data.error + '!',
  });
});
export default instance;
