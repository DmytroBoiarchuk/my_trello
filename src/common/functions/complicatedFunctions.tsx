import { Dispatch } from 'redux';
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import {
  addNewCard,
  deleteCard,
  getBoard,
  changePosBeforeReplacing,
  replaceCard,
} from '../../store/modules/board/actions';
import { setModalCardEditBig } from '../../store/modules/cardModal/actions';
import { IList } from '../interfaces/IList';

const MovingOrCopyingToAnotherBoard = async (
  isCopying: boolean,
  title: string,
  dispatch: Dispatch,
  description: string,
  board_id: string,
  card_id: string,
  board: { title: string; lists: IList[] },
  list_id: number,
  navigate: NavigateFunction,
  newPlaceBoard: string,
  newPlaceList: string,
  newPlacePosition: string,
  titleForCopyInputRef: string | undefined
): Promise<void> => {
  await changePosBeforeReplacing(newPlaceBoard, newPlaceList, +newPlacePosition);
  const cardName = isCopying ? titleForCopyInputRef : title;
  await addNewCard(dispatch, +newPlacePosition, newPlaceBoard, cardName!, +newPlaceList, false, description).catch(
    () => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  );
  if (!isCopying) {
    await deleteCard(dispatch, board_id, +card_id, board.lists, list_id).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
  }
  await dispatch(setModalCardEditBig(false));
  navigate(`/board/${board_id}`);
};
const movingInCurrentBoard = (
  list_id: number,
  position: number,
  board_id: string,
  card_id: string,
  dispatch: Dispatch,
  startList: IList | undefined,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>,
  currentList: IList | undefined,
  navigate: NavigateFunction,
  newPlaceBoard: string,
  newPlaceList: string,
  newPlacePosition: string
): void => {
  if (newPlaceList === list_id.toString()) {
    let neededPos = +newPlacePosition;
    if (+newPlacePosition > position) {
      neededPos = +newPlacePosition + 1;
    }
    replaceCard(
      board_id,
      neededPos,
      newPlaceList,
      +card_id,
      dispatch,
      startList,
      position,
      list_id,
      startList?.cards
    ).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
    getBoard(dispatch, board_id).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
    setIsShow(false);
  } else {
    replaceCard(
      board_id,
      +newPlacePosition,
      newPlaceList,
      +card_id,
      dispatch,
      currentList,
      position,
      list_id,
      startList?.cards
    ).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
  }
  navigate(`/board/${board_id}`);
};

const movingInAnotherCases = async (
  dispatch: Dispatch,
  description: string,
  board_id: string,
  navigate: NavigateFunction,
  newPlaceBoard: string,
  newPlaceList: string,
  newPlacePosition: string,
  titleForCopyInputRef: string | undefined
): Promise<void> => {
  await changePosBeforeReplacing(newPlaceBoard, newPlaceList, +newPlacePosition);
  await addNewCard(
    dispatch,
    +newPlacePosition,
    newPlaceBoard,
    titleForCopyInputRef!,
    +newPlaceList,
    true,
    description,
    false
  ).catch(() => {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  });
  await dispatch(setModalCardEditBig(false));
  navigate(`/board/${board_id}`);
};
export const movementHandler = (
  board_id: string,
  isCopying: boolean,
  title: string,
  dispatch: Dispatch,
  description: string,
  card_id: string,
  board: { title: string; lists: IList[] },
  list_id: number,
  navigate: NavigateFunction,
  position: number,
  startList: IList | undefined,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>,
  currentList: IList | undefined,
  newPlaceBoard: string,
  newPlaceList: string,
  newPlacePosition: string,
  titleForCopyInputRef: string | undefined
): void => {
  if (newPlaceBoard !== board_id) {
    MovingOrCopyingToAnotherBoard(
      isCopying,
      title,
      dispatch,
      description,
      board_id,
      card_id,
      board,
      list_id,
      navigate,
      newPlaceBoard,
      newPlaceList,
      newPlacePosition,
      titleForCopyInputRef
    );
    return;
  }
  if (!isCopying) {
    movingInCurrentBoard(
      list_id,
      position,
      board_id,
      card_id,
      dispatch,
      startList,
      setIsShow,
      currentList,
      navigate,
      newPlaceBoard,
      newPlaceList,
      newPlacePosition
    );
    return;
  }
  movingInAnotherCases(
    dispatch,
    description,
    board_id,
    navigate,
    newPlaceBoard,
    newPlaceList,
    newPlacePosition,
    titleForCopyInputRef
  );
};
