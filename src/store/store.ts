import rootReducer from './reducer';
import { configureStore } from '@reduxjs/toolkit';
import { ICard } from '../common/interfaces/ICard';
import { IBoard } from '../common/interfaces/IBoard';

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = {
  boards: {
    boards: IBoard[];
  };

  board:
    | {
        title: any;
        lists: any;
      }
    | {
        modalIsOpen: any;
        title: string;
        lists: {
          id: number;
          title: string;
          cards: ICard[];
        }[];
      };
  error: {
    isError: boolean;
    errorText: string;
  };
  loading: {
    loading: boolean;
  };
  slotHeight: number;
  user: {};
};
export default store;
