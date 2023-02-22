import React from 'react';
import { insertAfter } from './simple.function';
export const dragStarted = (e: React.DragEvent, id: number, title: string, touchX: number, touchY: number) => {
  e.dataTransfer.effectAllowed = 'all';
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
  e: React.DragEvent,
  id: string,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {
  const card = document.getElementById(id.toString());
  const box = document.getElementById(`card_box_${id}`);
  if (card?.lastChild !== null) card?.removeChild(card.lastChild);
  box!.style.display = 'flex';
  // if (slotsData.prevId !== 0) {
  //   const prevSlot = document.getElementById(`slot_${slotsData.prevId}`);
  //   prevSlot!.style.height = '0';
  // }
};
export const dragEnter = (
  e: React.DragEvent,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number },
  position: number
) => {
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
  e: React.DragEvent,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number },
  list_id: number,
  id: string
) => {
  let midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  const slot = document.createElement('div');
  //console.log(e.currentTarget.parentNode!.parentNode!.children[0]);
  //const nextCard;
  slot.classList.add('card-box');
  slot.classList.add('slot-style');
  slot!.id = `slot_${e.currentTarget.id}`;
  slot!.style.height = slotsData.slotHeight + 'px';
  const list = document.getElementById(list_id.toString());
  if (e.clientY < midlOfCard) {
    //top
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
    if (
      document.getElementById(`slot_${e.currentTarget.id}`) &&
      document.getElementById(`slot_${e.currentTarget.id}`) !== e.currentTarget.parentNode?.nextSibling
    ) {
      const removableNode = document.getElementById(`slot_${e.currentTarget.id}`);
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
  e: React.DragEvent,
  slotData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {};
