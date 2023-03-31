import store from '../../store';
import { ICard } from '../../../common/interfaces/ICard';
export const putCardData = (card: { id: number }) => {
  store.dispatch({ type: 'CURRENT_CARD_DATA', payload: card });
};
export const setModalCardEditBig = (isOpen: boolean) => {
  store.dispatch({ type: 'SET_MODAL_OPENING', payload: isOpen });
};
