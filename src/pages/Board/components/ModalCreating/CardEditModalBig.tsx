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
import Swal from 'sweetalert2';
import { setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import { getBoards } from '../../../../store/modules/boards/actions';
import { IList } from '../../../../common/interfaces/IList';
import ModalInModal from '../Card/ModalInModal';

const createListOptions = (board: { title?: string; lists: IList[] }) => {
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
export default function CardEditModalBig() {
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
  const [list_id, setList_id] = useState(0);
  const [position, setPosition] = useState(0);

  const [list_title, setList_title] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>('');

  let { card_id } = useParams();
  let { board_id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    getBoards(dispatch);
    getBoard(dispatch, board_id!).then(() => {
      board.lists.map((list) => {
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
    });
    resizeTextarea(descriptionRef);
  }, []);
  useEffect(() => {
    setSelectorLists(createListOptions(board));
    setSelectorsPoses(calcListPoses(board, list_id, list_id));
  }, [list_id]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isWarning, setWarning] = useState(false);
  const [showInputCardName, setShowInputCardName] = useState(false);
  let navigate = useNavigate();
  const [selectorsLists, setSelectorLists] = useState<Array<JSX.Element>>([]);
  const [selectorsPoses, setSelectorsPoses] = useState<Array<JSX.Element>>([]);
  const [currentList, setCurrentList] = useState<IList>();
  const [startList, setStartList] = useState<IList>();
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>();
  const ignoreBlurRef = useRef(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [temDescr, setTempDescr] = useState(description);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const changeHandler = (e: React.KeyboardEvent) => {
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
        if (value !== title) {
          setTitle(value);
          //props.setTitle(value);
          renameCard(dispatch, board_id!, list_id, +card_id!, value);
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
      setTitle(value);
      if (value !== title) {
        setTitle(value);
        //props.setTitle(value);
        renameCard(dispatch, board_id!, list_id, +card_id!, value);
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
        console.log(textarea.scrollHeight);
        textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
      }
    }, 150);
  };
  useEffect(() => {
    if (description && description !== ' ') {
      setTextareaValue(description);
    }
    board.lists.map((list) => {
      if (list.id === list_id) {
        setStartList(list);
      }
    });
  }, [showInputCardName]);
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
  const movementHandler = () => {
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
                description
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
  const textAreaOnChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.currentTarget.value);
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
              defaultValue={title}
            ></textarea>
          ) : (
            <h2 className="card-name-modal" onClick={() => setShowInputCardName(true)}>
              {title}
            </h2>
          )}{' '}
          <p className="in-list">
            In list{' '}
            <span onClick={() => onClickInListHandler()} className="list-name-span">
              {list_title}
            </span>{' '}
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
              movementHandler={movementHandler}
              setIsShow={setIsShow}
            />
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
                textAreaOnChangeHandler(e);
              }}
              value={description}
              onBlur={(e) => onBlurDescriptionHandler(e)}
            ></textarea>
          </div>
        </div>
        <div className="actions">
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