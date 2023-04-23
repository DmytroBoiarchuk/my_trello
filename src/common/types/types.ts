export type boardType = {
  id: number;
  title: string;
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
    isItCard: boolean;
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
