import { IBoard } from '../interfaces/IBoard';
import store from '../../store/store';
import { IList } from '../interfaces/IList';

export type boardType = {
  id: number;
  title: string;
};
export type RootState = ReturnType<typeof store.getState>;

export type boardStateType = {
  id: number;
  title: string;
  lists: IList[];
};
export type BoardResp = {
  title: string;
};
export interface slotsProps {
  slotsData: {
    slotHeight: number;
    prevId: number;
    currentCard: number;
    draggedCardList: number;
    slotPos: number;
    lastEmptyList: number;
    draggedCardPos: number;
    draggedCardTitle: string;
  };
}
export interface cardModalState {
  cardModalData: {
    card: {
      id: number;
    };
    isOpen: boolean;
  };
}
