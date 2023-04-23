import {
  addNewCard,
  deleteCard,
  getBoard,
  relocatePosBeforeReplacing,
  replaceCard,
} from '../../store/modules/board/actions';
import { setModalCardEditBig } from '../../store/modules/cardModal/actions';
import { Dispatch } from 'redux';
import { IList } from '../interfaces/IList';
import React from 'react';
import { NavigateFunction } from 'react-router-dom';

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
  currentList: IList | undefined
) => {
  const newPlace = document.querySelectorAll('select');
  if (newPlace[0].value !== board_id) {
    relocatePosBeforeReplacing(
      document.querySelectorAll('select')[0].value,
      document.querySelectorAll('select')[1].value,
      +document.querySelectorAll('select')[2].value
    )
      .then(() => {
        const inputElement = document.getElementById('title_for_copy') as HTMLInputElement;
        const card_name = isCopying ? inputElement.value : title;
        setTimeout(() => {
          addNewCard(
            dispatch,
            +document.querySelectorAll('select')[2].value,
            document.querySelectorAll('select')[0].value,
            card_name!,
            +document.querySelectorAll('select')[1].value,
            false,
            description
          );
        }, 100);
      })
      .then(() => {
        setTimeout(() => {
          if (!isCopying) {
            deleteCard(dispatch, board_id!, +card_id!, board.lists, list_id);
          }
          setModalCardEditBig(false);
          navigate(`/board/${board_id}`);
        }, 150);
      });
  } else {
    if (!isCopying) {
      if (newPlace[1].value === list_id.toString()) {
        let neededPos = +newPlace[2].value;
        if (+newPlace[2].value > position) {
          neededPos = +newPlace[2].value + 1;
        }
        replaceCard(
          board_id,
          neededPos,
          newPlace[1].value,
          +card_id!,
          dispatch,
          startList,
          position,
          list_id,
          startList?.cards
        );
        getBoard(dispatch, board_id);
        setIsShow(false);
      } else {
        replaceCard(
          board_id,
          +newPlace[2].value,
          newPlace[1].value,
          +card_id!,
          dispatch,
          currentList,
          position,
          list_id,
          startList?.cards
        );
      }
      navigate(`/board/${board_id}`);
    } else {
      relocatePosBeforeReplacing(
        document.querySelectorAll('select')[0].value,
        document.querySelectorAll('select')[1].value,
        +document.querySelectorAll('select')[2].value
      )
        .then(() => {
          const inputElement = document.getElementById('title_for_copy') as HTMLInputElement;
          setTimeout(() => {
            addNewCard(
              dispatch,
              +document.querySelectorAll('select')[2].value,
              document.querySelectorAll('select')[0].value,
              inputElement.value,
              +document.querySelectorAll('select')[1].value,
              true,
              description,
              false
            );
          }, 100);
        })
        .then(() => {
          setTimeout(() => {
            setModalCardEditBig(false);
            navigate(`/board/${board_id}`);
          }, 150);
        });
    }
  }
};
