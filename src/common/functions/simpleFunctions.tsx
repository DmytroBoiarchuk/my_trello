import React, { JSX } from 'react';
import { IList } from '../interfaces/IList';

export const calcListPoses = (
  resp: { title?: string; lists: IList[] },
  list_id: number,
  current_list: number
): JSX.Element[] => {
  const selectorsPoses: JSX.Element[] = [];
  let listPoses = 0;
  resp.lists.forEach((list) => {
    if (list.id === list_id) {
      if (list_id !== current_list) {
        listPoses = list.cards.length + 1;
      } else {
        listPoses = list.cards.length;
      }
    }
  });
  for (let i = 0; i < listPoses; i++) {
    selectorsPoses.push(
      <option key={i} value={i}>
        {i + 1}
      </option>
    );
  }
  return selectorsPoses;
};

export const createListOptions = (board: { title?: string; lists: IList[] }): React.JSX.Element[] => {
  if (board.lists.length !== 0) {
    return board.lists.map((list: IList) => (
      <option key={list.id} value={list.id}>
        {list.title}
      </option>
    ));
  }
  return [<option key={1}>No Lists</option>];
};

export const resizeTextarea = (ref: React.RefObject<HTMLTextAreaElement>): void => {
  const textarea = ref.current;
  setTimeout(() => {
    if (textarea) {
      textarea.style.cssText = `height:${textarea.scrollHeight}px`;
    }
  }, 150);
};
export const handleInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
  if (e.currentTarget) {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight - 7}px`;
  }
};
