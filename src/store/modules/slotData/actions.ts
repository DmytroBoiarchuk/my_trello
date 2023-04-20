import store from '../../store';

export const putHeight = (height: number) => {
  store.dispatch({ type: 'CURRENT_HEIGHT', payload: height });
};
export const setPrevId = (id: number) => {
  store.dispatch({ type: 'PREV_ID', payload: id });
};
export const setCurrentCard = (id: number) => {
  store.dispatch({ type: 'SET_CURRENT_CARD', payload: id });
};
export const setDraggedCardList = (id: number) => {
  store.dispatch({ type: 'SET_DRAGGED_CARD_LIST', payload: id });
};
export const setSlotPos = (pos: number) => {
  store.dispatch({ type: 'SET_SLOT_POS', payload: pos });
};
export const setLastEmptyList = (id: number) => {
  store.dispatch({ type: 'SET_LAST_EMPTY_LIST', payload: id });
};
export const setDraggedCardPos = (pos: number) => {
  store.dispatch({ type: 'SET_DRAGGED_CARD_POS', payload: pos });
};
export const putTitle = (title: string) => {
  store.dispatch({ type: 'SET_TITLE_CARD', payload: title });
};
export const isCardDragged = (isCard: boolean) => {
  store.dispatch({ type: 'IS_CARD_DRAGGED', payload: isCard });
};
