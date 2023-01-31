import axios from 'axios';
import { api } from '../common/constants';
import store from '../store/store';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/modules/loading/actiong';

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

export default instance;
