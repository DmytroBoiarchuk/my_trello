import { IList } from './IList';

export interface IBoard {
  id: number;
  title: string;
  lists: IList[];
}

export interface BoardsInterface {
  boards: IBoard[];
}
