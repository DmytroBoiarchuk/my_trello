import React from 'react';
import { insertAfter } from './simple.function';
import { isCardDragged, setSlotPos } from '../../store/modules/slotData/actions';
import { IList } from '../interfaces/IList';
import { replaceCard } from '../../store/modules/board/actions';
import { AnyAction, Dispatch } from 'redux';
import { ICard } from '../interfaces/ICard';
export const dragStarted = (e: React.DragEvent<HTMLDivElement>, id: number) => {
  const box = document.getElementById(`card_box_${id}`);
  setTimeout(() => {
    box!.style.display = 'none';
  });
};

export const dragEnd = (e: React.DragEvent<HTMLDivElement>, id: string) => {
  setSlotPos(-2);
  const box = document.getElementById(`card_box_${id}`);
  box!.style.display = 'block';

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
  draggedCardPos: number,
  draggedCardTitle: string
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
  let neededPos: number | undefined = 0;

  if (e.target.id.slice(0, 4) === 'slot') {
    currentList?.cards.map((card) => {
      if (e.target.nextSibling === null) {
        neededPos = currentList?.cards.length;
        return;
      }
      if (card.id === +e.target.nextSibling.id.slice(9)) {
        neededPos = card.position;
      }
    });
  } else {
    let arr = e.target.parentNode.parentNode.children;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id.slice(0, 4) === 'slot') {
        neededPos = i;
      }
    }
  }
  let startList: IList | undefined;
  board.lists.map((list) => {
    if (list.id === draggedCardList) {
      startList = list;
    }
  });

  let lists: { id: number; cards: ICard[] }[] = [];
  board.lists.map((list) => {
    if (list_id !== draggedCardList) {
      if (list.id === list_id) {
        let updated: ICard[] = [];
        if (list.cards.length === 0) {
          updated.push({ id: currentCard, position: 0, title: draggedCardTitle });
        }
        for (let i = 0; i < list.cards.length; i++) {
          if (list.cards[i].position === neededPos) {
            updated.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
          }
          updated.push(list.cards[i]);
          if (i + 1 === list.cards.length && neededPos === i + 1) {
            updated.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
          }
        }
        lists.push({ id: list_id, cards: updated });
      } else if (list.id === draggedCardList) {
        let updated: ICard[] = [];
        for (let i = 0; i < list.cards.length; i++) {
          if (i !== draggedCardPos) {
            updated.push(list.cards[i]);
          }
        }
        lists.push({ id: draggedCardList, cards: updated });
      } else {
        lists.push(list);
      }
    } else {
      if (list.id === list_id) {
        let updated: ICard[] = [];
        for (let i = 0; i < list.cards.length; i++) {
          if (i !== neededPos && i !== draggedCardPos) {
            updated.push(list.cards[i]);
          } else if (i === neededPos) {
            if (neededPos !== draggedCardPos) {
              updated.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
            }
            updated.push(list.cards[i]);
          }
        }
        if (neededPos === list.cards.length) {
          updated.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
        }
        lists.push({ id: list_id, cards: updated });
      } else {
        lists.push(list);
      }
    }
  });
  const slots = document.querySelectorAll('.slot-style');
  slots.forEach((slot) => {
    slot.parentNode!.removeChild(slot);
  });
  dispatch({ type: 'UPDATE_BOARD_DND', payload: lists });
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
  isCardDragged(false);
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
    draggedCardTitle: string;
  },
  list_id: number,
  id: string,
  position: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch
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
      slotsData.draggedCardPos,
      slotsData.draggedCardTitle
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
    draggedCardTitle: string;
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
    slotsData.draggedCardPos,
    slotsData.draggedCardTitle
  );
};
