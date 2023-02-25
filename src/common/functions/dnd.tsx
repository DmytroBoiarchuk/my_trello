import React from 'react';
import { insertAfter } from './simple.function';
import { setSlotPos } from '../../store/modules/slotHeihgt/actions';
export const dragStarted = (
  e: React.DragEvent<HTMLDivElement>,
  id: number,
  title: string,
  touchX: number,
  touchY: number,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {
  let touchCord = findTouchPoint(touchX, touchY, e);
  const draggableImage = document.createElement('div');
  draggableImage.classList.add('draggable-img');
  draggableImage.innerHTML = title;
  const card = document.getElementById(id.toString());
  const box = document.getElementById(`card_box_${id}`);
  card?.appendChild(draggableImage);
  e.dataTransfer.setDragImage(draggableImage, touchCord[0], touchCord[1]);
  setTimeout(() => {
    box!.style.display = 'none';
  }, 0);
};
const findTouchPoint = (touchX: number, touchY: number, e: React.DragEvent) => {
  let pointX = touchX - e.currentTarget.getBoundingClientRect().x;
  let pointY = touchY - e.currentTarget.getBoundingClientRect().y;
  return [pointX, pointY];
};

export const dragEnd = (
  e: React.DragEvent<HTMLDivElement>,
  id: string,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {
  const card = document.getElementById(id.toString());
  const box = document.getElementById(`card_box_${id}`);
  if (card?.lastChild !== null) card?.removeChild(card.lastChild);
  box!.style.display = 'block';
  const lastSlot = document.getElementById(`slot_${slotsData.prevId}`) as Node;
  if (lastSlot !== null) lastSlot.parentNode?.removeChild(lastSlot);
  // if (slotsData.prevId !== 0) {
  //   const prevSlot = document.getElementById(`slot_${slotsData.prevId}`);
  //   prevSlot!.style.height = '0';
  // }
};
export const dragEnter = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number; slotPos: number },
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
  const slot = document.createElement('div');
  slot.classList.add('card-box');
  slot.classList.add('slot-style');
  // if (slotsData.prevId !== 0) {
  //   const prevSlot = document.getElementById(`slot_${slotsData.prevId}`);
  //   prevSlot!.style.height = '0';
  // }
  // const slot = document.getElementById(`slot_${e.currentTarget.id}`);
  // slot!.style.height = slotsData.slotHeight + 'px';
};
export const dragOver = (
  e: React.DragEvent<HTMLDivElement>,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number; slotPos: number },
  list_id: number,
  id: string,
  position: number
) => {
  let midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  const slot = document.createElement('div');
  slot.classList.add('card-box');
  slot.classList.add('slot-style');
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
  //  let midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  // const box = document.getElementById(`card_box_${id}`);
  // const slot = document.getElementById(`slot_${id}`);
  // if (e.clientY < midlOfCard) {
  //   box!.style.flexDirection = 'column-reverse';
  // }
  // if (e.clientY > midlOfCard) {
  //   box!.style.flexDirection = 'column';
  // }
};
export const dragLeave = (
  e: React.DragEvent<HTMLDivElement>,
  slotData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {};
