import { ICard } from '../../../../common/interfaces/ICard';
import React, { useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Card from '../Card/Card';
import { renameList, deleteListFetch, addNewCard } from '../../../../store/modules/board/actions';
import { useDispatch } from 'react-redux';
import { validate } from '../../../../common/functions/validate';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import Swal from 'sweetalert2';

export default function List(props: { board_id: string; list_id: number; title: string; cards: ICard[] }) {
  const CardList = props.cards.map((key) => {
    return (
      <div key={key.id} className="card-box" id={`card_box_${key.id}`}>
        <Card
          position={key.position}
          board_id={props.board_id}
          list_id={props.list_id}
          key={key.id}
          id={key.id}
          title={key.title}
        />
        <div id={`slot_${key.id}`} className="slot-style"></div>
      </div>
    );
  });
  const initialStatePos = () => {
    if (CardList.length !== 0) {
      return CardList[CardList.length - 1].props.children[0].props.position;
    } else {
      return 0;
    }
  };
  const referenceForCartInput = useRef<HTMLTextAreaElement>(null);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [showInputListName, setShowInputListName] = useState(false);
  const [cardPosition, setCardPosition] = useState(initialStatePos);
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
      addNewCard(dispatch, cardPosition, props.board_id, cardInputValue, props.list_id);
      setCardPosition(cardPosition + 1);
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
        addNewCard(dispatch, cardPosition, props.board_id, cardInputValue, props.list_id);
        setCardPosition(cardPosition + 1);
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
  return (
    <>
      <div className="list-container">
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
          <h2 onClick={() => setShowInputListName(true)}>{listName}</h2>
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
