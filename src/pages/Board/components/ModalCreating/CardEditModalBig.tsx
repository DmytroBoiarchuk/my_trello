import React, { useEffect, useRef, useState } from 'react';
import './cardEditModal.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { validate } from '../../../../common/functions/validate';
import { getBoard, getBoardForModal, renameCard } from '../../../../store/modules/board/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BoardProps, BoardsProps, IBoard, ReturnType } from '../../../../common/interfaces/IBoard';
import { ICard } from '../../../../common/interfaces/ICard';
import Swal from 'sweetalert2';
import { setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import { getBoards } from '../../../../store/modules/boards/actions';
import { IList } from '../../../../common/interfaces/IList';

const createListOptions = (board: { title?: string; lists: IList[] }) => {
  return board.lists.map((list: IList) => {
    return (
      <option key={list.id} value={list.id}>
        {list.title}
      </option>
    );
  });
};

const calcListPoses = (resp: { title?: string; lists: IList[] }, list_id: number) => {
  let selectors_poses = [];
  let list_poses = 0;
  resp.lists.map((list) => {
    if (list.id === list_id) {
      list_poses = list.cards.length;
    }
  });
  for (let i = 0; i < list_poses + 1; i++) {
    selectors_poses.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return selectors_poses;
};
export default function CardEditModalBig(props: {
  position: number;
  list_id: number;
  list_title: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { boards } = useSelector(
    (state: BoardsProps): ReturnType => ({
      boards: state.boards.boards,
    })
  );
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  let { card_id } = useParams();
  let { board_id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    getBoards(dispatch);
    getBoard(dispatch, board_id!);
  }, []);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [isWarning, setWarning] = useState(false);
  const [showInputCardName, setShowInputCardName] = useState(false);
  let navigate = useNavigate();
  const [CardName, setCardName] = useState(props.title);
  const [ListName, setListName] = useState(props.list_title);
  const [listID, setListID] = useState(props.list_id);
  const [selectorsLists, setSelectorLists] = useState<any>([]);
  const [selectorsPoses, setSelectorsPoses] = useState<any>([]);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const changeHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
    } else {
      let el = descriptionRef.current;
      setTimeout(function () {
        if (el !== null) {
          el.style.cssText = 'height:auto; padding:0';
          el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }
      }, 1);
    }
  };
  const onKeyDownFunction = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (!validate(value)) {
        if (value !== CardName) {
          setCardName(value);
          props.setTitle(value);
          renameCard(dispatch, board_id!, listID, +card_id!, value);
        }
        setShowInputCardName(false);
      } else {
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
      }
    } else {
      let el = descriptionRef.current;
      setTimeout(function () {
        if (el !== null) {
          el.style.cssText = 'height:10px';
          el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }
      }, 1);
    }
  };
  const onBlurFunction = (e: React.FormEvent, value: string) => {
    if (!validate(value)) {
      setCardName(value);
      if (value !== CardName) {
        setCardName(value);
        props.setTitle(value);
        renameCard(dispatch, board_id!, listID, +card_id!, value);
      }
      setShowInputCardName(false);
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setShowInputCardName(false);
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
  const resizeTextarea = (ref: React.RefObject<HTMLTextAreaElement>) => {
    const textarea = ref.current;
    setTimeout(() => {
      if (textarea) {
        textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
      }
    }, 1);
  };
  useEffect(() => {
    resizeTextarea(descriptionRef);
  }, [showInputCardName]);
  const onBlurModalHandler = () => {
    setModalCardEditBig(false);
    navigate(`/board/${board_id}`);
  };
  let selectors_board;
  let list_poses: number;

  useEffect(() => {
    setSelectorLists(createListOptions(board));
    setSelectorsPoses(calcListPoses(board, listID));
  }, []);

  if (boards) {
    selectors_board = boards.map((board_1) => {
      return (
        <option key={board_1.id} value={board_1.id}>
          {board_1.title}
        </option>
      );
    });
  }
  const onClickInListHandler = () => {
    setIsShow(true);
  };
  const selectBoardHandler = (e: React.SyntheticEvent) => {
    if (document.querySelectorAll('select')[0]) {
      getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
        if (resp !== undefined) {
          setSelectorLists(createListOptions(resp as IBoard));
          setSelectorsPoses(calcListPoses(resp, createListOptions(resp as IBoard)[0].props.value));
        }
      });
    }
  };
  const selectListHandler = (e: React.SyntheticEvent) => {
    getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
      if (resp !== undefined) {
        setSelectorsPoses(calcListPoses(resp, +document.querySelectorAll('select')[1].value));
      }
    });
  };
  return (
    <div className="back-ground-modal-card" onClick={() => onBlurModalHandler()}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="other">
          {showInputCardName ? (
            <textarea
              className="card-name-editor"
              autoFocus
              ref={descriptionRef}
              onKeyDown={(e) => onKeyDownFunction(e, e.currentTarget.value)}
              onBlur={(e) => onBlurFunction(e, e.target.value)}
              defaultValue={CardName}
            ></textarea>
          ) : (
            <h2 className="card-name-modal" onClick={() => setShowInputCardName(true)}>
              {CardName}
            </h2>
          )}{' '}
          <p className="in-list">
            In list{' '}
            <span onClick={() => onClickInListHandler()} className="list-name-span">
              {ListName}
            </span>{' '}
          </p>
          {isShow && (
            <div ref={ref} className="moving-card-modal">
              <p className="big-text"> Card Moving</p>
              <hr className="hr-style" />
              <p className="small-text">Select column</p>
              <div className="chosen-column board-modal">
                <p className="small-text inside">Board</p>
                <select
                  onChange={(e) => selectBoardHandler(e)}
                  defaultValue={board.title}
                  id="selector_board"
                  className="selection small-text custom-text"
                >
                  {selectors_board}
                </select>
              </div>
              <div className="chosen-columns-container">
                <div className="chosen-column list-modal">
                  <p className="small-text inside">List</p>
                  <select
                    onChange={(e) => selectListHandler(e)}
                    defaultValue={ListName}
                    className="selection list-size small-text custom-text"
                  >
                    {selectorsLists}
                  </select>
                </div>
                <div className="chosen-column position-modal">
                  <p className="small-text inside">Position</p>
                  <select defaultValue={props.position} className="selection pos-size small-text custom-text">
                    {selectorsPoses}
                  </select>
                </div>
              </div>
              <button className="move-button"> MOVE </button>
            </div>
          )}
          <div className="users">
            <p className="users-h">Users</p>
            <div className="users-container">
              <div className="circles">
                <div className="circle red"></div>
                <div className="circle green"></div>
                <div className="circle blue"></div>
                <div className="circle plus">
                  <AiOutlinePlus className="plus-icon" />
                </div>
              </div>
              <button className="card-big-modal-button">Join</button>
            </div>
          </div>
          <div className="description">
            <div className="description-container">
              <p className="description-header"> Description</p>
              <button className="card-big-modal-button change">Change</button>
            </div>
            <textarea
              id={`descr_${card_id}`}
              ref={descriptionRef}
              placeholder="Enter description..."
              className="description-detailed-before"
              onKeyDown={(e) => {
                changeHandler(e);
              }}
            ></textarea>
          </div>
        </div>
        <div className="actions">
          <p className="actions-header">Actions</p>
          <button className="card-big-modal-button actions-button">Coping</button>
          <button className="card-big-modal-button actions-button">Moving</button>
          <button className="card-big-modal-button actions-button">Archiving</button>
        </div>
      </div>
    </div>
  );
}
