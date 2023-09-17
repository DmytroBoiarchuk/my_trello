import React, { JSX } from 'react';
import { Dispatch } from 'redux';
import { inputValidation } from './inputValidation';
import {
  changeCardDescription,
  getBoardForModal,
  quickSetDescription,
  renameCard,
} from '../../store/modules/board/actions';
import { IList } from '../interfaces/IList';
import { calcListPoses, createListOptions } from './simpleFunctions';
import { IBoard } from '../interfaces/IBoard';
import { ReplacingCardModalRef } from '../types/types';

export const changeHandlerFunc = (
  e: React.KeyboardEvent,
  ignoreBlurRef: React.MutableRefObject<boolean>,
  descriptionRef: React.RefObject<HTMLTextAreaElement>,
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  temDescry: string
): void => {
  if (e.key === 'Escape') {
    ignoreBlurRef.current = true;
    descriptionRef.current?.blur();
    ignoreBlurRef.current = false;
    setDescription(temDescry);
    return;
  }
  const el = descriptionRef.current;
  setTimeout(() => {
    if (el !== null) {
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = `height:${el.scrollHeight}px`;
    }
  }, 1);
};
export const onKeyDownFunctionHandler = (
  e: React.KeyboardEvent,
  value: string,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  dispatch: Dispatch,
  boardId: string | undefined,
  stateListId: number,
  cardId: string | undefined,
  setShowInputCardName: React.Dispatch<React.SetStateAction<boolean>>,
  setWarning: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (e.key === 'Enter') {
    if (!inputValidation(value)) {
      if (value !== title) {
        setTitle(value);
        renameCard(dispatch, boardId!, stateListId, +cardId!, value).catch(() => {
          dispatch({ type: 'ERROR_ACTION_TYPE' });
        });
      }
      setShowInputCardName(false);
    } else {
      e.preventDefault();
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
    }
  } else if (e.key === 'Escape') {
    setShowInputCardName(false);
  }
};
export const onBlurFunctionHandler = (
  e: React.FormEvent,
  value: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  title: string,
  dispatch: Dispatch,
  boardId: string | undefined,
  stateListId: number,
  cardId: string | undefined,
  setShowInputCardName: React.Dispatch<React.SetStateAction<boolean>>,
  setWarning: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (!inputValidation(value)) {
    setTitle(value);
    if (value !== title) {
      setTitle(value);
      renameCard(dispatch, boardId!, stateListId, +cardId!, value).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
    }
    setShowInputCardName(false);
  } else {
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
    setShowInputCardName(false);
  }
};
export const onClickInListHandlerFunk = (
  board: { title: string; lists: IList[] },
  stateListId: number,
  setStartList: React.Dispatch<React.SetStateAction<IList | undefined>>,
  isShow: boolean,
  isCopying: boolean,
  setIsCopying: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  board.lists.forEach((list) => {
    if (list.id === stateListId) {
      setStartList(list);
    }
  });
  if (isShow && isCopying) {
    setIsCopying(false);
  } else {
    setIsCopying(false);
    setIsShow(!isShow);
  }
};

export const selectBoardHandlerFunc = (
  childRefs: React.RefObject<ReplacingCardModalRef>,
  dispatch: Dispatch,
  setSelectorLists: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  setSelectorsPoses: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  stateListId: number
): void => {
  if (childRefs.current?.boardSelectorRef) {
    getBoardForModal(dispatch, childRefs.current?.boardSelectorRef.value).then((resp) => {
      if (resp !== undefined) {
        setSelectorLists(createListOptions(resp as IBoard));
        setSelectorsPoses(calcListPoses(resp, createListOptions(resp as IBoard)[0].props.value, stateListId));
      }
    });
  }
};

export const selectListHandlerFunc = (
  childRefs: React.RefObject<ReplacingCardModalRef>,
  dispatch: Dispatch,
  setSelectorsPoses: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  stateListId: number,
  board: { title: string; lists: IList[] },
  setCurrentList: React.Dispatch<React.SetStateAction<IList | undefined>>
): void => {
  if (childRefs.current?.boardSelectorRef)
    getBoardForModal(dispatch, childRefs.current?.boardSelectorRef?.value).then((resp) => {
      if (resp !== undefined && childRefs.current?.listSelectorRef) {
        setSelectorsPoses(calcListPoses(resp, parseInt(childRefs.current?.listSelectorRef.value, 10), stateListId));
      }
    });
  board.lists.forEach((list) => {
    if (childRefs.current?.listSelectorRef && list.id.toString() === childRefs.current?.listSelectorRef.value) {
      setCurrentList(list);
    }
  });
};

export const onBlurDescriptionHandlerFunc = async (
  e: React.FocusEvent<HTMLTextAreaElement>,
  cardModalButton: React.RefObject<HTMLButtonElement>,
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  ignoreBlurRef: React.MutableRefObject<boolean>,
  dispatch: Dispatch,
  boardId: string | undefined,
  cardId: string | undefined,
  stateListId: number,
  setTempDescr: React.Dispatch<React.SetStateAction<string>>,
  board: { title: string; lists: IList[] }
): Promise<void> => {
  const { value } = e.currentTarget;
  cardModalButton.current?.classList.remove('card-big-modal-button-disabled');
  setIsButtonDisabled(false);
  if (!ignoreBlurRef.current) {
    quickSetDescription(board, e.target.value, stateListId, +cardId!, dispatch);
    await changeCardDescription(dispatch, value, boardId!, cardId!, stateListId);
    setTempDescr(value);
  }
};

export const onClickCopingHandlerFunk = (
  isShow: boolean,
  isCopying: boolean,
  setIsCopying: React.Dispatch<React.SetStateAction<boolean>>,
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (isShow && !isCopying) {
    setIsCopying(true);
    return;
  }
  setIsCopying(true);
  setIsShow(!isShow);
};
