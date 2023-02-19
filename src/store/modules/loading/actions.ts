import store from '../../store';

export const setLoading = (isShown: boolean) => {
  store.dispatch({ type: 'LOADING', payload: isShown });
};
