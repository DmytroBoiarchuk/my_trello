import store from '../../store';

export const putHeight = (height: number) => {
  store.dispatch({ type: 'CURRENT_HEIGHT', payload: height });
};
export const setPrevId = (id: number) => {
  store.dispatch({ type: 'PREV_ID', payload: id });
};
export const deletePrevId = () => {
  store.dispatch({ type: 'DELETE_ID' });
};
export const setCurrentCard = (id: number) => {
  store.dispatch({ type: 'SET_CURRENT_CARD', payload: id });
};
export const setLastSlot = (id: number) => {
  store.dispatch({ type: 'SET_LAST_SLOT', payload: id });
};
export const setSlotPos = (pos: number) => {
  store.dispatch({ type: 'SET_SLOT_POS', payload: pos });
};
