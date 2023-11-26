import React from 'react';
import { Dispatch } from 'redux';
import { isCardDragged, setDraggedItem, setDraggedListId, setSlotPos } from '../../store/modules/slotData/actions';
import { IList } from '../interfaces/IList';
import { fetchNewListOfLists, getBoard, replaceCard, setNewListOfLists } from '../../store/modules/board/actions';
import { ICard } from '../interfaces/ICard';
import store from '../../store/store';
import { SlotDataType } from '../types/types';

export const dragStarted = (
  e: React.DragEvent<HTMLDivElement>,
  id: number,
  cardRef: React.RefObject<HTMLDivElement>
): void => {
  const card = cardRef.current;
  setTimeout(() => {
    if (card) card.style.display = 'none';
  }, 1);
};

export const dragEnd = (
  e: React.DragEvent<HTMLDivElement>,
  id: string,
  cardRef: React.RefObject<HTMLDivElement>
): void => {
  store.dispatch(setSlotPos(-2));
  const card = cardRef.current;
  if (card) card.style.display = 'block';
};
const ifMovingToAnotherList = (
  list: IList,
  currentCard: number,
  draggedCardTitle: string,
  neededPos: number
): ICard[] => {
  if (list.cards.length === 0) {
    return [{ id: currentCard, position: 0, title: draggedCardTitle }];
  }
  const updatedList: ICard[] = [];
  list.cards.forEach((card) => {
    if (card.position === neededPos) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
    }
    updatedList.push(card);
  });
  if (list.cards.length === neededPos) {
    updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
  }
  return updatedList;
};
const ifTargetList = (
  list: IList,
  neededPos: number,
  draggedCardPos: number,
  currentCard: number,
  draggedCardTitle: string
): ICard[] => {
  const updatedList: ICard[] = [];
  list.cards.forEach((card) => {
    if (card.position !== draggedCardPos && card.position !== neededPos) {
      updatedList.push(card);
    } else if (card.position === neededPos) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
      updatedList.push(card);
    }
  });
  if (neededPos === list.cards.length) {
    updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
  }
  return updatedList;
};
const getListPairForDrop = (
  board: { title: string; lists: IList[] },
  list_id: number,
  draggedCardList: number
): (IList | undefined)[] => {
  const currentList = board.lists.find((list) => list.id === list_id);
  const startList = board.lists.find((list) => list.id === draggedCardList);
  return [currentList, startList];
};
export const dropHandler = (
  e: React.DragEvent<HTMLDivElement>,
  list_id: number,
  currentCard: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch,
  draggedCardList: number,
  draggedCardPos: number,
  draggedCardTitle: string,
  neededPos: number
): void => {
  const [currentList, startList] = getListPairForDrop(board, list_id, draggedCardList);
  const lists = board.lists.map((list) => {
    if (list.id === list_id) {
      return {
        ...list,
        cards:
          list_id !== draggedCardList
            ? ifMovingToAnotherList(list, currentCard, draggedCardTitle, neededPos)
            : ifTargetList(list, neededPos, draggedCardPos, currentCard, draggedCardTitle),
      };
    }
    if (list.id === draggedCardList) {
      return { ...list, cards: list.cards.filter((card) => card.position !== draggedCardPos) };
    }
    return list;
  });
  dispatch({ type: 'UPDATE_BOARD_DRAG`N`DROP', payload: lists });
  replaceCard(
    board_id,
    neededPos,
    list_id,
    currentCard,
    dispatch,
    currentList,
    draggedCardPos,
    draggedCardList,
    startList?.cards
  ).catch(() => {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  });
  dispatch(isCardDragged(false));
};
export const dragOver = (
  e: React.DragEvent<HTMLDivElement>,
  position: number,
  setFirstSlotShown: React.Dispatch<React.SetStateAction<boolean>>,
  setBottomSlotShown: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch
): void => {
  const midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  if (e.clientY < midlOfCard) {
    if (position === 0) {
      setFirstSlotShown(true);
      setBottomSlotShown(false);
    } else {
      dispatch(setSlotPos(position - 1));
    }
  } else {
    dispatch(setSlotPos(position));
    setFirstSlotShown(false);
    setBottomSlotShown(true);
  }
};

export const dragStartList = (
  e: React.DragEvent<HTMLDivElement>,
  dispatch: Dispatch,
  listContainerRef: React.RefObject<HTMLDivElement>
): void => {
  if (!(e.target instanceof HTMLParagraphElement)) {
    dispatch(setDraggedItem(false));
    dispatch(setDraggedListId(parseInt(e.currentTarget.id.slice(15), 10)));
    setTimeout((): void => {
      if (listContainerRef.current) listContainerRef.current.style.visibility = 'hidden';
    }, 1);
  }
};

export const listDragOver = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: SlotDataType,
  board: { title: string; lists: IList[] },
  dispatch: Dispatch
): void => {
  if (!slotsData.isItCArdDragged) {
    const midlOfList = e.currentTarget.scrollWidth / 2 + e.currentTarget.getBoundingClientRect().x;
    const overListId = parseInt(e.currentTarget.id.slice(15), 10);
    const newListOfLists: IList[] = [];
    let draggedList: IList;
    board.lists.forEach((list) => {
      if (list.id === slotsData.draggedListId) {
        draggedList = list;
      }
    });
    board.lists.forEach((list) => {
      if (list.id !== slotsData.draggedListId && list.id !== overListId) {
        newListOfLists.push(list);
      }
      if (list.id === overListId && draggedList && e.clientX < midlOfList) {
        newListOfLists.push(draggedList);
        newListOfLists.push(list);
      }
      if (list.id === overListId && draggedList && e.clientX >= midlOfList) {
        newListOfLists.push(list);
        newListOfLists.push(draggedList);
      }
    });
    dispatch(setNewListOfLists(newListOfLists));
  }
};

const compareNewAndOldLists = (
  board: { title: string; lists: IList[] },
  newListOfList: { id: number; position: number }[]
): boolean => {
  for (let i = 0; i < board.lists.length; i++) {
    if (board.lists[i].position !== newListOfList[i].position) return true;
  }
  return false;
};

export const listDragEnd = (
  board: { title: string; lists: IList[] },
  dispatch: Dispatch,
  board_id: string
): void => {
  const newListOfList: { id: number; position: number }[] = [];
  let positionCounter = 0;
  board.lists.forEach((list) => {
    newListOfList.push({ id: list.id, position: positionCounter });
    positionCounter++;
  });
  if (compareNewAndOldLists(board, newListOfList)) {
    fetchNewListOfLists(dispatch, board_id, newListOfList).then(() => {
      getBoard(dispatch, board_id);
    });
  }
};
