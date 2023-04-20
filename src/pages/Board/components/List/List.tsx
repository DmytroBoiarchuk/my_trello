import { ICard } from '../../../../common/interfaces/ICard';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Card from '../Card/Card';
import { renameList, deleteListFetch, addNewCard } from '../../../../store/modules/board/actions';
import { useDispatch, useSelector } from 'react-redux';
import { validate } from '../../../../common/functions/validate';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import Swal from 'sweetalert2';
import { slotsProps } from '../../../../common/types/types';
import { setLastEmptyList } from '../../../../store/modules/slotData/actions';
import { dropHandler } from '../../../../common/functions/dnd';
import { BoardProps } from '../../../../common/interfaces/IBoard';
import { Outlet } from 'react-router-dom';

export default function List(props: { board_id: string; list_id: number; title: string; cards: ICard[] }) {
  const CardList = props.cards.map((key) => {
    return (
      <div key={key.id} className="card-box" id={`card_box_${key.id}`}>
        <Card
          list_title={props.title}
          position={key.position}
          board_id={props.board_id}
          list_id={props.list_id}
          key={key.id}
          id={key.id}
          title={key.title}
          description={key.description}
        />
      </div>
    );
  });

  const { slotsData } = useSelector(
    (state: slotsProps): slotsProps => ({
      slotsData: state.slotsData,
    })
  );
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  const referenceForCartInput = useRef<HTMLTextAreaElement>(null);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [showInputListName, setShowInputListName] = useState(false);
  const [listName, setListName] = useState(props.title);
  const [isWarning, setWarning] = useState(false);
  const [listMenu, setListMenu] = useState(false);
  const [cardInputValue, setCardInputValue] = useState('');
  const dispatch = useDispatch();
  const onBlurFunction = (e: React.FormEvent, value: string) => {
    if (!validate(value)) {
      if (value !== listName) {
        setListName(value);
        renameList(dispatch, props.board_id, props.list_id, value);
      }
      setShowInputListName(false);
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setShowInputListName(false);
    }
  };
  const onKeyDownFunction = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (!validate(value)) {
        if (value !== listName) {
          setListName(value);
          renameList(dispatch, props.board_id, props.list_id, value);
        }
        setShowInputListName(false);
      } else {
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
      }
    }
  };
  const deleteList = () => {
    deleteListFetch(dispatch, props.board_id, props.list_id);
    setListMenu(false);
  };
  const submitFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(cardInputValue)) {
      addNewCard(dispatch, CardList.length, props.board_id, cardInputValue, props.list_id, true);
      setCardInputValue('');
      setIsShow(false);
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setCardInputValue('');
    }
  };
  const enterPressedCard = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!validate(cardInputValue)) {
        addNewCard(dispatch, CardList.length, props.board_id, cardInputValue, props.list_id, true);
        setIsShow(false);
        setCardInputValue('');
      } else {
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
        setCardInputValue('');
      }
    } else {
      let el = referenceForCartInput.current;
      setTimeout(function () {
        if (el !== null) {
          el.style.cssText = 'height:auto; padding:0';
          el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }
      }, 1);
    }
  };
  if (isWarning) {
    Swal.fire({
      icon: 'error',
      iconColor: '#da4c4c',
      showConfirmButton: false,
      showCloseButton: true,
      text: 'Error: Prohibited symbols!',
    });
    setWarning(false);
  }
  let slot = document.createElement('div');

  const overEmptyList = () => {
    if (slotsData.isItCard) setLastEmptyList(props.list_id);
    const slots = document.querySelectorAll('.slot-style');
    slots.forEach((slot) => {
      if (slot.id !== `slot_in_empty_list_${props.list_id}`) slot.parentNode!.removeChild(slot);
    });
    if (!document.getElementById(`slot_in_empty_list_${props.list_id}`)) {
      if (
        document.getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`) &&
        slotsData.lastEmptyList !== props.list_id
      ) {
        document
          .getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`)!
          .parentNode!.removeChild(document.getElementById(`slot_in_empty_list_${slotsData.lastEmptyList}`) as Node);
      }
      if (slotsData.isItCard) document.getElementById(`list_container_${props.list_id}`)!.children[1].appendChild(slot);
    }
  };
  useEffect(() => {
    slot.classList.add('slot-style');
    slot.style.height = slotsData.slotHeight + 'px';
    slot.id = `slot_in_empty_list_${props.list_id}`;
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    slot.addEventListener('drop', (e) =>
      dropHandler(
        e,
        props.list_id,
        slotsData.currentCard,
        board,
        props.board_id,
        dispatch,
        slotsData.draggedCardList,
        slotsData.draggedCardPos,
        slotsData.draggedCardTitle
      )
    );
    if (CardList.length === 0 && slotsData.slotHeight !== 0) {
      document.getElementById(`list_container_${props.list_id}`)?.addEventListener('dragover', overEmptyList);
    }
    if (CardList.length > 0) {
      document.getElementById(`list_container_${props.list_id}`)?.removeEventListener('dragover', overEmptyList);
      slot.removeEventListener('dragover', (e) => {
        e.preventDefault();
      });
      slot.removeEventListener('drop', (e) =>
        dropHandler(
          e,
          props.list_id,
          slotsData.currentCard,
          board,
          props.board_id,
          dispatch,
          slotsData.draggedCardList,
          slotsData.draggedCardPos,
          slotsData.draggedCardTitle
        )
      );
    }
    return () => {
      document.getElementById(`list_container_${props.list_id}`)?.removeEventListener('dragover', overEmptyList);
      slot.removeEventListener('dragover', (e) => {
        e.preventDefault();
      });
      slot.removeEventListener('drop', (e) =>
        dropHandler(
          e,
          props.list_id,
          slotsData.currentCard,
          board,
          props.board_id,
          dispatch,
          slotsData.draggedCardList,
          slotsData.draggedCardPos,
          slotsData.draggedCardTitle
        )
      );
    };
  }, [slotsData.slotHeight, CardList.length, document.querySelectorAll(`.slot-style`)]);
  return (
    <>
      <div id={`list_container_${props.list_id}`} className="list-container">
        {showInputListName ? (
          <input
            maxLength={15}
            className="list-name-input"
            autoFocus
            onKeyDown={(e) => onKeyDownFunction(e, e.currentTarget.value)}
            onBlur={(e) => onBlurFunction(e, e.target.value)}
            defaultValue={listName}
          ></input>
        ) : (
          <h2 className="list-container-header" onClick={() => setShowInputListName(true)}>
            {listName}
          </h2>
        )}
        <div className="cards" id={props.list_id.toString()}>
          {CardList}
        </div>
        <BsThreeDots onClick={() => setListMenu(!listMenu)} className="menu-dots" />
        {listMenu && (
          <div className="list-menu">
            <button onClick={() => deleteList()} className="delete-list-button">
              Delete list
            </button>
          </div>
        )}
        {!isShow && (
          <button onClick={() => setIsShow(!isShow)} className="add-card-button">
            + Add card
          </button>
        )}
        {isShow && (
          <form ref={ref} className="from-for-card">
            <textarea
              ref={referenceForCartInput}
              id="resizable"
              autoFocus
              onChange={(e) => {
                setCardInputValue(e.currentTarget.value);
              }}
              placeholder="Enter a card..."
              className="input-for-card"
              onKeyDown={(e) => {
                enterPressedCard(e);
              }}
            />
            <button onClick={(e) => submitFunction(e)} className="submit-button-card">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
}
