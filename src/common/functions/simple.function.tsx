import { IList } from '../interfaces/IList';
import React from 'react';

export function insertAfter(referenceNode: any, newNode: any) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
export const calcListPoses = (resp: { title?: string; lists: IList[] }, list_id: number, current_list: number) => {
  let selectors_poses = [];
  let list_poses = 0;
  resp.lists.map((list) => {
    if (list.id === list_id) {
      if (list_id !== current_list) {
        list_poses = list.cards.length + 1;
      } else {
        list_poses = list.cards.length;
      }
    }
  });
  for (let i = 0; i < list_poses; i++) {
    selectors_poses.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return selectors_poses;
};
export const createListOptions = (board: { title?: string; lists: IList[] }) => {
  return board.lists.map((list: IList) => {
    return (
      <option key={list.id} value={list.id}>
        {list.title}
      </option>
    );
  });
};
export const resizeTextarea = (ref: React.RefObject<HTMLTextAreaElement>) => {
  const textarea = ref.current;
  setTimeout(() => {
    if (textarea) {
      textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
    }
  }, 150);
};
export const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
  if (e.currentTarget) {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight - 7 + 'px';
  }
};
