import React, { useEffect, useRef, useState } from 'react';
import './cardEditModal.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { validate } from '../../../../common/functions/validate';
import {
  addNewCard,
  changeCardDescription,
  deleteCard,
  getBoard,
  getBoardForModal,
  relocatePosBeforeReplacing,
  renameCard,
  replaceCard,
} from '../../../../store/modules/board/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BoardProps, BoardsProps, IBoard, ReturnType } from '../../../../common/interfaces/IBoard';
import { ICard } from '../../../../common/interfaces/ICard';
import Swal from 'sweetalert2';
import { setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import { getBoards } from '../../../../store/modules/boards/actions';
import { IList } from '../../../../common/interfaces/IList';
import useOutsideAlerterFor2 from '../../../../common/Hooks/useOutsideAlerterFor2';

/*




--- разобраться с удалением

--- Сделать копирование карточки














 */
const createListOptions = (board: { title?: string; lists: IList[] }, list_ID: number) => {
  return board.lists.map((list: IList) => {
    return (
      <option key={list.id} value={list.id}>
        {list.title}
      </option>
    );
  });
};

const calcListPoses = (resp: { title?: string; lists: IList[] }, list_id: number, current_list: number) => {
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
export default function CardEditModalBig(props: {
  position: number;
  list_id: number;
  list_title: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string | undefined;
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
  const { ref, ref2, isShow, setIsShow } = useOutsideAlerterFor2(false);
  const [isWarning, setWarning] = useState(false);
  const [showInputCardName, setShowInputCardName] = useState(false);
  let navigate = useNavigate();
  const [CardName, setCardName] = useState(props.title);
  const [ListName, setListName] = useState(props.list_title);
  const [listID, setListID] = useState(props.list_id);
  const [selectorsLists, setSelectorLists] = useState<any>([]);
  const [selectorsPoses, setSelectorsPoses] = useState<any>([]);
  const [currentList, setCurrentList] = useState<any>([]);
  const [startList, setStartList] = useState<any>([]);
  const [textareaValue, setTextareaValue] = useState<string>();
  const ignoreBlurRef = useRef(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [temDescr, setTempDescr] = useState(props.description);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const changeHandler = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Escape') {
      ignoreBlurRef.current = true;
      document.getElementById(`descr_${card_id}`)?.blur();
      ignoreBlurRef.current = false;
      setTextareaValue(temDescr);
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
    if (props.description && props.description !== ' ') {
      setTextareaValue(props.description);
    }
    board.lists.map((list) => {
      if (list.id === props.list_id) {
        setStartList(list);
      }
    });
    resizeTextarea(descriptionRef);
  }, [showInputCardName]);
  const onBlurModalHandler = () => {
    setModalCardEditBig(false);
    navigate(`/board/${board_id}`);
  };
  let selectors_board;

  useEffect(() => {
    setSelectorLists(createListOptions(board, props.list_id));
    setSelectorsPoses(calcListPoses(board, listID, props.list_id));
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
    board.lists.map((list) => {
      if (list.id === props.list_id) {
        setStartList(list);
      }
    });
    setIsShow(!isShow);
  };
  const selectBoardHandler = (e: React.SyntheticEvent) => {
    if (document.querySelectorAll('select')[0]) {
      getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
        if (resp !== undefined) {
          setSelectorLists(createListOptions(resp as IBoard, props.list_id));
          setSelectorsPoses(
            calcListPoses(resp, createListOptions(resp as IBoard, props.list_id)[0].props.value, props.list_id)
          );
        }
      });
    }
  };
  const selectListHandler = (e: React.SyntheticEvent) => {
    getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
      if (resp !== undefined) {
        setSelectorsPoses(calcListPoses(resp, +document.querySelectorAll('select')[1].value, props.list_id));
      }
    });
    board.lists.map((list) => {
      if (list.id.toString() === document.querySelectorAll('select')[1].value) {
        setCurrentList(list);
      }
    });
  };
  const movementHandler = () => {
    const newPlace = document.querySelectorAll('select');
    if (newPlace[0].value !== board_id) {
      relocatePosBeforeReplacing(
        document.querySelectorAll('select')[0].value,
        document.querySelectorAll('select')[1].value,
        +document.querySelectorAll('select')[2].value
      )
        .then(() => {
          setTimeout(() => {
            addNewCard(
              dispatch,
              +document.querySelectorAll('select')[2].value,
              document.querySelectorAll('select')[0].value,
              CardName,
              +document.querySelectorAll('select')[1].value,
              false,
              props.description
            );
          }, 100);
        })
        .then(() => {
          setTimeout(() => {
            deleteCard(dispatch, board_id!, +card_id!, board.lists, props.list_id);
            setModalCardEditBig(false);
            navigate(`/board/${board_id}`);
          }, 150);
        });
    } else {
      if (newPlace[1].value === props.list_id.toString()) {
        let neededPos = +newPlace[2].value;
        if (+newPlace[2].value > props.position) {
          neededPos = +newPlace[2].value + 1;
        }
        replaceCard(
          board_id,
          neededPos,
          newPlace[1].value,
          +card_id!,
          dispatch,
          startList,
          props.position,
          props.list_id,
          startList.cards
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
          props.position,
          props.list_id,
          startList.cards
        );
      }
    }
  };
  const archivingHandler = () => {
    deleteCard(dispatch, board_id!, +card_id!, board.lists, props.list_id);
    onBlurModalHandler();
  };
  const onBlurDescriptionHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    document.querySelectorAll('.card-big-modal-button-disabled')[0]?.classList.remove('card-big-modal-button-disabled');
    setIsButtonDisabled(false);
    if (!ignoreBlurRef.current) {
      changeCardDescription(dispatch, e.currentTarget.value, board_id!, card_id!, props.list_id);
      setTempDescr(e.currentTarget.value);
    }
  };
  const textAreaOnChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.currentTarget.value);
  };
  const onClickChangeButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add('card-big-modal-button-disabled');
    setIsButtonDisabled(true);
    document.getElementById(`descr_${card_id}`)?.focus();
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
                  defaultValue={board_id}
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
                    defaultValue={props.list_id}
                    onChange={(e) => selectListHandler(e)}
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
              <button onClick={() => movementHandler()} className="move-button">
                {' '}
                MOVE{' '}
              </button>
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
              <button
                className="card-big-modal-button change"
                onClick={(e) => {
                  onClickChangeButtonHandler(e);
                }}
                disabled={isButtonDisabled}
              >
                Change
              </button>
            </div>
            <textarea
              id={`descr_${card_id}`}
              ref={descriptionRef}
              placeholder="Enter description..."
              className="description-detailed-before"
              onKeyDown={(e) => {
                changeHandler(e, e.currentTarget.value);
              }}
              onChange={(e) => {
                textAreaOnChangeHandler(e);
              }}
              value={textareaValue}
              onBlur={(e) => onBlurDescriptionHandler(e)}
            ></textarea>
          </div>
        </div>
        <div className="actions">
          <p className="actions-header">Actions</p>
          <button className="card-big-modal-button actions-button">Coping</button>
          <button className="card-big-modal-button actions-button" ref={ref2} onClick={() => onClickInListHandler()}>
            Moving
          </button>
          <button className="red-theme card-big-modal-button actions-button" onClick={() => archivingHandler()}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
