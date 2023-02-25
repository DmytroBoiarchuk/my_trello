export type propsType = {
  boards: { id: number; title: string }[];
  getBoards: () => Promise<void>;
};
export type stateType = {
  boards: [];
};
export type boardType = {
  id: number;
  title: string;
  // lists: { id: number; title: string; cards: ICard[] }[];
};
export type boardStateType = {
  id: number;
  title: string;
  lists: [];
};
export type BoardResp = {
  title: string;
};
export interface slotsProps {
  slotsData: {
    slotHeight: number;
    prevId: number;
    currentCard: number;
    last: number;
    slotPos: number;
  };
}
