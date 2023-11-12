import { Dispatch } from 'redux';
import { CardData, CardTypeForPutRequest, ResponseBoard } from '../types/types';
import { IList } from '../interfaces/IList';
import { ICard } from '../interfaces/ICard';

export const relocatePosBeforeReplacingHandler = (
  board: ResponseBoard,
  board_id: string,
  list_id: number,
  newPos: number
): CardData[] => {
  const update: CardData[] = [];
  board.lists.forEach((list) => {
    if (list.id === list_id) {
      for (let i = 0; i < list.cards.length; i++) {
        if (i < newPos) {
          update.push({ id: list.cards[i].id, position: i, list_id });
        } else {
          update.push({ id: list.cards[i].id, position: i + 1, list_id });
        }
      }
    }
  });
  return update;
};
const ifMovingCardToAnotherList = (
  updatedList: CardTypeForPutRequest[],
  pos: number | undefined,
  currentList: IList,
  listId: undefined | number,
  currentCard: number,
  draggedCardListArr: ICard[] | undefined,
  draggedCardPos: number,
  draggedCardList: number
): CardTypeForPutRequest[] => {
  let position;
  for (
    let i = 0;
    i < (pos === currentList.cards.length ? currentList.cards.length + 1 : currentList.cards.length);
    i++
  ) {
    if (pos !== undefined && i < pos) {
      position = i;
      updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
    }
    if (i === pos) {
      updatedList.push({ id: currentCard, position: pos, list_id: listId });
    }
    if (pos !== undefined && i >= pos && pos !== currentList.cards.length) {
      position = i + 1;
      updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
    }
  }
  if (draggedCardListArr !== undefined) {
    draggedCardListArr.forEach((cards) => {
      if (cards.position > draggedCardPos) {
        updatedList.push({ id: cards.id, position: cards.position - 1, list_id: draggedCardList });
      }
    });
  }
  return updatedList;
};
const ifMovingCardInSameList = (
  updatedList: CardTypeForPutRequest[],
  pos: number | undefined,
  draggedCardPos: number,
  currentList: IList,
  listId: number,
  currentCard: number
): CardTypeForPutRequest[] => {
  if (pos !== undefined && pos < draggedCardPos) {
    for (let i = 0; i < currentList.cards.length; i++) {
      let position;
      if (i < pos || i > draggedCardPos) {
        position = i;
        updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
      }
      if (i >= pos && i < draggedCardPos) {
        position = i + 1;
        updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
      }
      if (i === draggedCardPos) {
        updatedList.push({ id: currentCard, position: pos, list_id: listId });
      }
    }
  }
  if (pos !== undefined && pos - 1 > draggedCardPos) {
    for (let i = 0; i < currentList.cards.length; i++) {
      let position;
      if (i < draggedCardPos || i > pos - 1) {
        position = i;
        updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
      }
      if (i === draggedCardPos) {
        updatedList.push({ id: currentCard, position: pos - 1, list_id: listId });
      }
      if (i > draggedCardPos && i <= pos - 1) {
        position = i - 1;
        updatedList.push({ id: currentList.cards[i].id, position, list_id: listId });
      }
    }
  }
  return updatedList;
};

export const replaceCardHandler = (
  boardId: string,
  pos: number | undefined,
  listId: number | undefined,
  currentCard: number,
  dispatch: Dispatch,
  currentList: IList | undefined,
  draggedCardPos: number,
  draggedCardList: number,
  draggedCardListArr: ICard[] | undefined
): CardTypeForPutRequest[] => {
  let updatedList: CardTypeForPutRequest[] = [];
  if (currentList !== undefined) {
    if (listId !== undefined && draggedCardList === listId) {
      updatedList = ifMovingCardInSameList(updatedList, pos, draggedCardPos, currentList, listId, currentCard);
    } else {
      updatedList = ifMovingCardToAnotherList(
        updatedList,
        pos,
        currentList,
        listId,
        currentCard,
        draggedCardListArr,
        draggedCardPos,
        draggedCardList
      );
    }
  }
  return updatedList;
};
export const changePosAfterDeleting = (
  dispatch: Dispatch,
  iList: IList,
  card_id: number,
  board_id: string,
  list_id: number
): CardTypeForPutRequest[] => {
  const listData: CardTypeForPutRequest[] = [];
  let deletedCardPos: number;
  iList.cards.forEach((card) => {
    if (card.id === card_id) {
      deletedCardPos = card.position;
    }
  });
  iList.cards.forEach((card) => {
    if (card.position < deletedCardPos) {
      listData.push({ id: card.id, position: card.position, list_id });
    }
    if (card.position > deletedCardPos) {
      listData.push({ id: card.id, position: card.position - 1, list_id });
    }
  });
  return listData;
};
export const deleteCardHandler = (
  dispatch: Dispatch,
  board_id: string,
  card_id: number,
  lists: IList[],
  list_id: number
): CardTypeForPutRequest[] => {
  let listData: CardTypeForPutRequest[] = [];
  lists.forEach((list) => {
    if (list.id === list_id && list.cards.length !== 0) {
      listData = changePosAfterDeleting(dispatch, list, card_id, board_id, list_id);
    }
  });
  return listData;
};
export const quickCardDeletingHandler = (lists: IList[], listId: number, cardId: number): IList[] => {
  const updatedLists: IList[] = [];
  const updatedCards: ICard[] = [];
  lists.forEach((list) => {
    if (list.id === listId) {
      list.cards.forEach((card) => {
        if (card.id !== cardId) {
          updatedCards.push(card);
        }
      });
      updatedLists.push({ id: list.id, position: 0, title: list.title, cards: updatedCards });
    } else {
      updatedLists.push(list);
    }
  });
  return updatedLists;
};
