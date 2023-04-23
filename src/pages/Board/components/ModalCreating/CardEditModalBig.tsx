import React, { useEffect, useRef, useState } from 'react';
import './cardEditModal.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { validate } from '../../../../common/functions/validate';
import {
  changeCardDescription,
  deleteCard,
  getBoard,
  getBoardForModal,
  renameCard,
} from '../../../../store/modules/board/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BoardProps, BoardsProps, IBoard, ReturnType } from '../../../../common/interfaces/IBoard';
import Swal from 'sweetalert2';
import { setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import { getBoards } from '../../../../store/modules/boards/actions';
import { IList } from '../../../../common/interfaces/IList';
import ModalInModal from '../Card/ModalInModal';
import { cardModalState } from '../../../../common/types/types';
import {
  calcListPoses,
  createListOptions,
  handleInput,
  resizeTextarea,
} from '../../../../common/functions/simple.function';
import { movementHandler } from '../../../../common/functions/functions';

export default function CardEditModalBig() {
  let { card_id } = useParams();
  let { board_id } = useParams();
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
  const { cardModalData } = useSelector(
    (state: cardModalState): cardModalState => ({
      cardModalData: state.cardModalData,
    })
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>('');
  const [list_id, setList_id] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isWarning, setWarning] = useState(false);
  const [showInputCardName, setShowInputCardName] = useState(false);
  const [selectorsLists, setSelectorLists] = useState<Array<JSX.Element>>([]);
  const [selectorsPoses, setSelectorsPoses] = useState<Array<JSX.Element>>([]);
  const [currentList, setCurrentList] = useState<IList>();
  const [startList, setStartList] = useState<IList>();
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const ignoreBlurRef = useRef(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [temDescr, setTempDescr] = useState(description);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [list_title, setList_title] = useState('');

  let navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (cardModalData.isOpen) {
      resizeTextarea(descriptionRef);
    }
  }, [cardModalData.isOpen]);
  useEffect(() => {
    getBoards(dispatch);
    getBoard(dispatch, board_id!);
  }, []);
  useEffect(() => {
    board.lists.map((list: IList) => {
      list.cards.map((card) => {
        if (card.id.toString() === card_id) {
          setList_id(list.id);
          setPosition(card.position);
          setList_title(list.title);
          setTitle(card.title);
          setDescription(card.description);
          setTempDescr(description);
        }
      });
    });
  }, [board]);
  useEffect(() => {
    setSelectorLists(createListOptions(board));
    setSelectorsPoses(calcListPoses(board, list_id, list_id));
  }, [list_id]);
  useEffect(() => {
    board.lists.map((list) => {
      if (list.id === list_id) {
        setStartList(list);
      }
    });
  }, [showInputCardName]);

  const changeHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      ignoreBlurRef.current = true;
      document.getElementById(`descr_${card_id}`)?.blur();
      ignoreBlurRef.current = false;
      setDescription(temDescr);
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
        if (value !== title) {
          setTitle(value);
          renameCard(dispatch, board_id!, list_id, +card_id!, value);
        }
        setShowInputCardName(false);
      } else {
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
      }
    }
  };
  const onBlurFunction = (e: React.FormEvent, value: string) => {
    if (!validate(value)) {
      setTitle(value);
      if (value !== title) {
        setTitle(value);
        renameCard(dispatch, board_id!, list_id, +card_id!, value);
      }
      setShowInputCardName(false);
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setShowInputCardName(false);
    }
  };

  const onBlurModalHandler = () => {
    setModalCardEditBig(false);
    navigate(`/board/${board_id}`);
  };
  let selectors_board;

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
      if (list.id === list_id) {
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
  const selectBoardHandler = () => {
    if (document.querySelectorAll('select')[0]) {
      getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
        if (resp !== undefined) {
          setSelectorLists(createListOptions(resp as IBoard));
          setSelectorsPoses(calcListPoses(resp, createListOptions(resp as IBoard)[0].props.value, list_id));
        }
      });
    }
  };
  const selectListHandler = () => {
    getBoardForModal(dispatch, document.querySelectorAll('select')[0].value).then((resp) => {
      if (resp !== undefined) {
        setSelectorsPoses(calcListPoses(resp, +document.querySelectorAll('select')[1].value, list_id));
      }
    });
    board.lists.map((list) => {
      if (list.id.toString() === document.querySelectorAll('select')[1].value) {
        setCurrentList(list);
      }
    });
  };

  const archivingHandler = () => {
    deleteCard(dispatch, board_id!, +card_id!, board.lists, list_id);
    onBlurModalHandler();
  };
  const onBlurDescriptionHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    document.querySelectorAll('.card-big-modal-button-disabled')[0]?.classList.remove('card-big-modal-button-disabled');
    setIsButtonDisabled(false);
    if (!ignoreBlurRef.current) {
      changeCardDescription(dispatch, e.currentTarget.value, board_id!, card_id!, list_id);
      setTempDescr(e.currentTarget.value);
    }
  };
  const onClickChangeButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add('card-big-modal-button-disabled');
    setIsButtonDisabled(true);
    document.getElementById(`descr_${card_id}`)?.focus();
  };
  const onClickCopingHandler = () => {
    if (isShow && !isCopying) {
      setIsCopying(true);
    } else {
      setIsCopying(true);
      setIsShow(!isShow);
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
    <div className="back-ground-modal-card" onClick={() => onBlurModalHandler()}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="other">
          <div className="title-container-big-modal">
            <div className="mark"></div>
            {showInputCardName ? (
              <textarea
                className="card-name-editor"
                autoFocus
                onKeyDown={(e) => onKeyDownFunction(e, e.currentTarget.value)}
                onBlur={(e) => onBlurFunction(e, e.target.value)}
                defaultValue={title}
                onInput={(e) => {
                  handleInput(e);
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = target.scrollHeight + 'px';
                }}
              ></textarea>
            ) : (
              <h2 className="card-name-modal" onClick={() => setShowInputCardName(true)}>
                {title}
              </h2>
            )}
          </div>
          <p className="in-list">
            In list{' '}
            <span onClick={() => onClickInListHandler()} className="list-name-span">
              {list_title}
            </span>
          </p>
          {isShow && (
            <ModalInModal
              board_id={board_id!}
              position={position}
              list_id={list_id.toString()}
              selectors_board={selectors_board}
              selectorsLists={selectorsLists}
              key={card_id}
              selectorsPoses={selectorsPoses}
              isCopying={isCopying}
              selectBoardHandler={selectBoardHandler}
              selectListHandler={selectListHandler}
              movementHandler={() =>
                movementHandler(
                  board_id!,
                  isCopying,
                  title,
                  dispatch,
                  description!,
                  card_id!,
                  board,
                  list_id,
                  navigate,
                  position,
                  startList,
                  setIsShow,
                  currentList
                )
              }
              setIsShow={setIsShow}
            />
          )}
          <div className="users">
            <p className="users-h">Users</p>
            <div className="users-container">
              <div className="circles">
                <div className="circle first"></div>
                <div className="circle second"></div>
                <div className="circle third"></div>
                <div className="circle plus">
                  <AiOutlinePlus className="plus-icon" />
                </div>
              </div>
              <button className="card-big-modal-button">Join</button>
            </div>
          </div>
          <div>
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
                changeHandler(e);
              }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
              onBlur={(e) => onBlurDescriptionHandler(e)}
            ></textarea>
          </div>
        </div>
        <div className="actions">
          <GrClose className="close-modal" onClick={() => onBlurModalHandler()} />
          <p className="actions-header">Actions</p>
          <button
            className="card-big-modal-button actions-button"
            onClick={() => {
              onClickCopingHandler();
            }}
          >
            Coping
          </button>
          <button className="card-big-modal-button actions-button" onClick={() => onClickInListHandler()}>
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
