import { ICard } from './ICard';
import { IList } from './IList';

export interface IBoard {
  id: number;
  title: string;
}

export interface BoardProps {
  board: {
    title: string;
    lists: IList[];
  };
}
