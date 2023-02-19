import React from 'react';
import { Dispatch } from 'redux';
import { putHeight } from '../../store/modules/slotHeihgt/actions';
import { useSelector } from 'react-redux';
import { slotsProps } from '../types/types';

export const dragStarted = (e: React.DragEvent, id: number, title: string, touchX: number, touchY: number) => {
  e.dataTransfer.setData('text/plain', e.currentTarget.id);
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
  if (slotsData.prevId !== 0) {
    const prevSlot = document.getElementById(`slot_${slotsData.prevId}`);
    prevSlot!.style.height = '0';
  }
};
export const dragEnter = (
  e: React.DragEvent,
  slotsData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {
  if (slotsData.prevId !== +e.currentTarget.id) {
    if (slotsData.prevId !== 0) {
      const prevSlot = document.getElementById(`slot_${slotsData.prevId}`);
      prevSlot!.style.height = '0';
    }
    const slot = document.getElementById(`slot_${e.currentTarget.id}`);
    slot!.style.height = slotsData.slotHeight + 'px';
  }
};
export const dragOver = (e: React.DragEvent, id: string) => {
  let midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  const box = document.getElementById(`card_box_${id}`);
  const slot = document.getElementById(`slot_${id}`);
  if (e.clientY < midlOfCard) {
    box!.style.flexDirection = 'column-reverse';
    box!.style.height = +box!.style.height - 5 + 'px';
    slot!.style.margin = '0 0 5px 0';
  }
  if (e.clientY > midlOfCard) {
    box!.style.flexDirection = 'column';
    slot!.style.margin = '5px 0 0 0';
  }
};
export const dragLeave = (
  e: React.DragEvent,
  slotData: { slotHeight: number; prevId: number; currentCard: number; last: number }
) => {};
