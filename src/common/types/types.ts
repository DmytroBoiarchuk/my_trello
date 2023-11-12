import React, { JSX, MouseEventHandler } from 'react';
import { IList } from '../interfaces/IList';
import { IBoard } from '../interfaces/IBoard';

export type TypeForSlotData = {
  payload: {
    height: number;
    currentCardId: number;
    draggedCardListId: number;
    draggedCardPos: number;
    title: string;
  };
  type: string;
};
export type BoardResp = {
  title: string;
};
export type SlotsProps = {
  slotsData: {
    slotHeight: number;
    isOriginSlotShown: boolean;
    currentCard: number;
    draggedCardList: number;
    slotPos: number;
    currentList: number;
    draggedCardPos: number;
    draggedCardTitle: string;
    isCardDragged: boolean;
  };
};

export type CardModalState = {
  cardModalData: {
    card: {
      id: number;
    };
    isOpen: boolean;
  };
};

export type ResponseBoard = {
  title: string;
  lists: IList[];
};
export type CardData = {
  id: number;
  title?: string;
  position: number;
  list_id?: number;
};
export type CardTypeForPutRequest = {
  id: number;
  position: number;
  list_id: number | undefined;
};
export type CardModalType = {
  card: {
    id: number;
  };
  isOpen: boolean;
};
export type LoadingType = {
  loading: boolean;
};
export type Response = {
  boards: IBoard[];
};
export type VoidFunctionsType = () => void;
export type ReplacingCardModalProps = {
  defaultValueForCopying: string;
  isCopying: boolean;
  list_id: string;
  board_id: string;
  selectors_board: JSX.Element[] | undefined;
  selectorsLists: Array<JSX.Element>;
  selectorsPoses: Array<JSX.Element>;
  position: number;
  selectBoardHandler: VoidFunctionsType;
  selectListHandler: VoidFunctionsType;
  movementHandler: MouseEventHandler<HTMLButtonElement>;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ReplacingCardModalRef = {
  boardSelectorRef: HTMLSelectElement | null;
  listSelectorRef: HTMLSelectElement | null;
  positionsSelectorRef: HTMLSelectElement | null;
  titleForCopyInputRef: HTMLTextAreaElement | null;
};

export type BoardProps = {
  board: {
    title: string;
    lists: IList[];
  };
};
export type BoardsProps = {
  boards: {
    boards: IBoard[];
  };
};
export type AuthorizationData = {
  refreshToken: string;
  result: string;
  token: string;
};
export type GetUsersType = {
  id: number;
  username: string;
};
export type ModalIsOpen = {
  openCloseModal: () => void;
};
