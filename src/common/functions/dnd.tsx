import React from 'react';
import { insertAfter } from './simple.function';
import { setSlotPos } from '../../store/modules/slotData/actions';
import { IList } from '../interfaces/IList';
import { IBoard } from '../interfaces/IBoard';
import { replaceCard } from '../../store/modules/board/actions';
import { AnyAction, Dispatch } from 'redux';
import { ICard } from '../interfaces/ICard';
export const dragStarted = (
  e: React.DragEvent<HTMLDivElement>,
  id: number,
  title: string,
  touchX: number,
  touchY: number
) => {
  const card = document.getElementById(`${id}`);
  const box = document.getElementById(`card_box_${id}`);

  setTimeout(() => {
    box!.style.display = 'none';
  });
  // let touchCord = findTouchPoint(touchX, touchY, e);
  // const draggableImage = document.createElement('div');
  // draggableImage.classList.add('draggable-img');
  // draggableImage.innerHTML = title;
  // const card = document.getElementById(id.toString());
  // const box = document.getElementById(`card_box_${id}`);
  // card?.appendChild(draggableImage);
  // e.dataTransfer.setDragImage(draggableImage, touchCord[0], touchCord[1]);
  // setTimeout(() => {
  //   box!.style.display = 'none';
  // }, 0);
};
const findTouchPoint = (touchX: number, touchY: number, e: React.DragEvent) => {
  let pointX = touchX - e.currentTarget.getBoundingClientRect().x;
  let pointY = touchY - e.currentTarget.getBoundingClientRect().y;
  return [pointX, pointY];
};

export const dragEnd = (e: React.DragEvent<HTMLDivElement>, id: string) => {
  setSlotPos(-2);
  const card = document.getElementById(`${id}`);
  const box = document.getElementById(`card_box_${id}`);
  box!.style.display = 'block';
  // const card = document.getElementById(id.toString());
  // const box = document.getElementById(`card_box_${id}`);
  // if (card?.lastChild !== null) card?.removeChild(card.lastChild);
  // box!.style.display = 'block';
  const slots = document.querySelectorAll('.slot-style');
  slots.forEach((slot) => {
    slot.parentNode!.removeChild(slot);
  });
};
export const dragEnter = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: {
    slotHeight: number;
    prevId: number;
    currentCard: number;
    draggedCardList: number;
    slotPos: number;
    lastEmptyList: number;
    draggedCardPos: number;
  },
  position: number,
  list_id: number
) => {
  if (
    slotsData.prevId !== 0 &&
    slotsData.prevId.toString() !== e.currentTarget.id &&
    position !== slotsData.slotPos &&
    position - slotsData.slotPos !== 1
  ) {
    document
      .getElementById(`slot_${slotsData.prevId}`)
      ?.parentNode?.removeChild(document.getElementById(`slot_${slotsData.prevId}`) as Node);
  }
  if (document.getElementById(`slot_${slotsData.prevId}`)?.parentNode !== document.getElementById(list_id.toString())) {
    document
      .getElementById(`slot_${slotsData.prevId}`)
      ?.parentNode?.removeChild(document.getElementById(`slot_${slotsData.prevId}`) as Node);
  }
  if (document.getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`)) {
    document
      .getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`)
      ?.parentNode?.removeChild(document.getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`) as Node);
  }
};
export const dropHandler = (
  e: any,
  list_id: number,
  currentCard: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch,
  draggedCardList: number,
  draggedCardPos: number
) => {
  let currentListArr = board.lists.map((list) => {
    if (list.id === list_id) {
      return list;
    }
  });
  let currentList: IList | undefined;
  for (let i = 0; i < currentListArr.length; i++) {
    if (currentListArr[i] !== undefined) {
      currentList = currentListArr[i];
    }
  }
  let neededPos;

  if (e.target.id.slice(0, 4) === 'slot') {
    const neededPosArr = currentList?.cards.map((card) => {
      if (e.target.nextSibling === null) {
        return currentList?.cards.length;
      }
      if (card.id === +e.target.nextSibling.id.slice(9)) {
        return card.position;
      }
    });

    if (neededPosArr !== undefined) {
      if (neededPosArr.length === 0) {
        neededPos = 0;
      }
      for (let i = 0; i < neededPosArr.length; i++) {
        if (neededPosArr[i] !== undefined) {
          neededPos = neededPosArr[i];
        }
      }
    }
  } else {
    let arr = e.target.parentNode.parentNode.children;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id.slice(0, 4) === 'slot') {
        neededPos = i;
      }
    }
  }
  let startListArr = board.lists.map((list) => {
    if (list.id === draggedCardList) {
      return list;
    }
  });
  let startList: IList | undefined;
  for (let i = 0; i < startListArr.length; i++) {
    if (startListArr[i] !== undefined) {
      startList = startListArr[i];
    }
  }
  replaceCard(
    board_id,
    neededPos,
    list_id.toString(),
    currentCard,
    dispatch,
    currentList,
    draggedCardPos,
    draggedCardList,
    startList?.cards
  );
};
export const dragOver = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: {
    slotHeight: number;
    prevId: number;
    currentCard: number;
    draggedCardList: number;
    slotPos: number;
    lastEmptyList: number;
    draggedCardPos: number;
  },
  list_id: number,
  id: string,
  position: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch<AnyAction>
) => {
  e.preventDefault();
  let midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  const slot = document.createElement('div');
  slot.classList.add('card-box');
  slot.classList.add('slot-style');
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  slot.addEventListener('drop', (e) =>
    dropHandler(
      e,
      list_id,
      slotsData.currentCard,
      board,
      board_id,
      dispatch,
      slotsData.draggedCardList,
      slotsData.draggedCardPos
    )
  );
  slot!.id = `slot_${e.currentTarget.id}`;
  slot!.style.height = slotsData.slotHeight + 'px';
  const list = document.getElementById(list_id.toString());
  if (e.clientY < midlOfCard && position - slotsData.slotPos !== 1) {
    //top
    setSlotPos(position - 1);
    if (
      document.getElementById(`slot_${e.currentTarget.id}`) &&
      document.getElementById(`slot_${e.currentTarget.id}`) === e.currentTarget.parentNode?.nextSibling
    ) {
      const removableNode = document.getElementById(`slot_${e.currentTarget.id}`);
      list?.removeChild(removableNode as Node);
    }
    if (!document.getElementById(`slot_${e.currentTarget.id}`)) {
      list?.insertBefore(slot, e.currentTarget.parentNode);
    }
  }
  if (e.clientY > midlOfCard) {
    //bot
    setSlotPos(position);
    if (
      document.getElementById(`slot_${e.currentTarget.id}`) &&
      document.getElementById(`slot_${e.currentTarget.id}`) !== e.currentTarget.parentNode?.nextSibling
    ) {
      const removableNode = document.getElementById(`slot_${e.currentTarget.id}`);
      list?.removeChild(removableNode as Node);
    }
    if (document.getElementById(`slot_${slotsData.prevId}`)) {
      const removableNode = document.getElementById(`slot_${slotsData.prevId}`);
      list?.removeChild(removableNode as Node);
    }
    if (!document.getElementById(`slot_${e.currentTarget.id}`)) {
      insertAfter(e.currentTarget.parentNode, slot);
    }
  }
};

export const drop = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: {
    slotHeight: number;
    prevId: number;
    currentCard: number;
    draggedCardList: number;
    slotPos: number;
    lastEmptyList: number;
    draggedCardPos: number;
  },
  list_id: number,
  position: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch<AnyAction>
) => {
  dropHandler(
    e,
    list_id,
    slotsData.currentCard,
    board,
    board_id,
    dispatch,
    slotsData.draggedCardList,
    slotsData.draggedCardPos
  );
};
