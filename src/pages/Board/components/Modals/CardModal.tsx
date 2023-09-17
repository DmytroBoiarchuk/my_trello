import React, { JSX, useEffect, useRef, useState } from 'react';
import './cardModal.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCard, getBoard } from '../../../../store/modules/board/actions';
import { BoardsInterface } from '../../../../common/interfaces/IBoard';
import { setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import { getBoards } from '../../../../store/modules/boards/actions';
import { IList } from '../../../../common/interfaces/IList';
import ReplacingCardModal from './ReplacingCardModal';
import { BoardProps, BoardsProps, CardModalState, ReplacingCardModalRef } from '../../../../common/types/types';
import {
  calcListPoses,
  createListOptions,
  handleInput,
  resizeTextarea,
} from '../../../../common/functions/simpleFunctions';
import { movementHandler } from '../../../../common/functions/complicatedFunctions';
import {
  changeHandlerFunc,
  onBlurDescriptionHandlerFunc,
  onBlurFunctionHandler,
  onClickCopingHandlerFunk,
  onClickInListHandlerFunk,
  onKeyDownFunctionHandler,
  selectBoardHandlerFunc,
  selectListHandlerFunc,
} from '../../../../common/functions/cardModalHandlers';
import { useSweetAlert } from '../../../../common/functions/sweetAlertHandler';

export default function CardModal(): JSX.Element {
  const { cardId } = useParams();
  const { boardId } = useParams();
  const { boards } = useSelector(
    (state: BoardsProps): BoardsInterface => ({
      boards: state.boards.boards,
    })
  );
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  const { cardModalData } = useSelector(
    (state: CardModalState): CardModalState => ({
      cardModalData: state.cardModalData,
    })
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string>('');
  const [stateListId, setStateListId] = useState(0);
  const [position, setPosition] = useState(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isWarning, setWarning] = useState(false);
  const [showInputCardName, setShowInputCardName] = useState(false);
  const [selectorsLists, setSelectorLists] = useState<Array<JSX.Element>>([]);
  const [selectorsPoses, setSelectorsPoses] = useState<Array<JSX.Element>>([]);
  const [currentList, setCurrentList] = useState<IList>();
  const [startList, setStartList] = useState<IList>();
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [temDescr, setTempDescr] = useState(description || '');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [stateListTitle, setStateListTitle] = useState('');
  const ignoreBlurRef = useRef(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const childRefs = useRef<ReplacingCardModalRef>(null);
  const cardModalButton = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (cardModalData.isOpen) {
      resizeTextarea(descriptionRef);
    }
  }, [cardModalData.isOpen]);
  useEffect(() => {
    getBoards(dispatch).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
    if (boardId)
      getBoard(dispatch, boardId).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
  }, []);
  useEffect(() => {
    board.lists.forEach((list: IList) => {
      list.cards.forEach((card) => {
        if (card.id.toString() === cardId) {
          setStateListId(list.id);
          setPosition(card.position);
          setStateListTitle(list.title);
          setTitle(card.title);
          if (card.description !== undefined) setDescription(card.description);
          setTempDescr(description || '');
        }
      });
    });
  }, [board]);
  useEffect(() => {
    setSelectorLists(createListOptions(board));
    setSelectorsPoses(calcListPoses(board, stateListId, stateListId));
  }, [stateListId]);
  useEffect(() => {
    board.lists.forEach((list) => {
      if (list.id === stateListId) {
        setStartList(list);
      }
    });
  }, [showInputCardName]);

  const changeHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>): void =>
    changeHandlerFunc(e, ignoreBlurRef, descriptionRef, setDescription, temDescr);
  const onKeyDownFunction = (e: React.KeyboardEvent, value: string): void =>
    onKeyDownFunctionHandler(
      e,
      value,
      title,
      setTitle,
      dispatch,
      boardId,
      stateListId,
      cardId,
      setShowInputCardName,
      setWarning
    );
  const onBlurFunction = (e: React.FormEvent, value: string): void =>
    onBlurFunctionHandler(
      e,
      value,
      setTitle,
      title,
      dispatch,
      boardId,
      stateListId,
      cardId,
      setShowInputCardName,
      setWarning
    );

  const onBlurModalHandler = (): void => {
    dispatch(setModalCardEditBig(false));
    navigate(`/board/${boardId}`);
  };
  let selectorsBoard;

  if (boards) {
    selectorsBoard = boards.map((board_1) => (
      <option key={board_1.id} value={board_1.id}>
        {board_1.title}
      </option>
    ));
  }
  const onClickInListHandler = (): void =>
    onClickInListHandlerFunk(board, stateListId, setStartList, isShow, isCopying, setIsCopying, setIsShow);

  const selectBoardHandler = (): void =>
    selectBoardHandlerFunc(childRefs, dispatch, setSelectorLists, setSelectorsPoses, stateListId);
  const selectListHandler = (): void =>
    selectListHandlerFunc(childRefs, dispatch, setSelectorsPoses, stateListId, board, setCurrentList);

  const archivingHandler = (): void => {
    if (boardId)
      deleteCard(dispatch, boardId, +cardId!, board.lists, stateListId).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
    onBlurModalHandler();
  };
  const onBlurDescriptionHandler = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
    onBlurDescriptionHandlerFunc(
      e,
      cardModalButton,
      setIsButtonDisabled,
      ignoreBlurRef,
      dispatch,
      boardId,
      cardId,
      stateListId,
      setTempDescr,
      board
    );
  };
  const onClickChangeButtonHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.classList.add('card-big-modal-button-disabled');
    setIsButtonDisabled(true);
    descriptionRef.current?.focus();
  };
  const onClickCopingHandler = (): void => onClickCopingHandlerFunk(isShow, isCopying, setIsCopying, setIsShow);

  if (isWarning) {
    useSweetAlert('Prohibited symbols');
    setWarning(false);
  }

  return (
    <div className="back-ground-modal-card" onClick={(): void => onBlurModalHandler()}>
      <div
        className="modal"
        onClick={(e): void => {
          e.stopPropagation();
        }}
      >
        <div className="other">
          <div className="title-container-big-modal">
            <div className="mark" />
            {showInputCardName ? (
              <textarea
                className="card-name-editor"
                autoFocus
                onKeyDown={(e): void => onKeyDownFunction(e, e.currentTarget.value)}
                onBlur={(e): void => onBlurFunction(e, e.target.value)}
                defaultValue={title}
                onInput={(e): void => {
                  handleInput(e);
                }}
                onFocus={(e): void => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            ) : (
              <h2 className="card-name-modal" onClick={(): void => setShowInputCardName(true)}>
                {title}
              </h2>
            )}
          </div>
          <p className="in-list">
            In list{' '}
            <span onClick={(): void => onClickInListHandler()} className="list-name-span">
              {stateListTitle}
            </span>
          </p>
          {isShow && (
            <ReplacingCardModal
              defaultValueForCopying={title}
              ref={childRefs}
              board_id={boardId!}
              position={position}
              list_id={stateListId.toString()}
              selectors_board={selectorsBoard}
              selectorsLists={selectorsLists}
              key={cardId}
              selectorsPoses={selectorsPoses}
              isCopying={isCopying}
              selectBoardHandler={selectBoardHandler}
              selectListHandler={selectListHandler}
              movementHandler={(): void => {
                if (
                  boardId &&
                  cardId &&
                  childRefs.current?.boardSelectorRef?.value &&
                  childRefs.current?.listSelectorRef?.value &&
                  childRefs.current?.positionsSelectorRef?.value
                )
                  movementHandler(
                    boardId,
                    isCopying,
                    title,
                    dispatch,
                    description,
                    cardId,
                    board,
                    stateListId,
                    navigate,
                    position,
                    startList,
                    setIsShow,
                    currentList,
                    childRefs.current?.boardSelectorRef.value,
                    childRefs.current?.listSelectorRef.value,
                    childRefs.current?.positionsSelectorRef.value,
                    childRefs.current?.titleForCopyInputRef?.value
                  );
              }}
              setIsShow={setIsShow}
            />
          )}
          <div className="users">
            <p className="users-h">Users</p>
            <div className="users-container">
              <div className="circles">
                <div className="circle first" />
                <div className="circle second" />
                <div className="circle third" />
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
                onClick={(e): void => {
                  onClickChangeButtonHandler(e);
                }}
                disabled={isButtonDisabled}
              >
                Change
              </button>
            </div>
            <textarea
              id={`descr_${cardId}`}
              ref={descriptionRef}
              placeholder="Enter description..."
              className="description-detailed"
              onKeyDown={(e): void => {
                changeHandler(e);
              }}
              onChange={(e): void => {
                setDescription(e.target.value);
              }}
              value={description}
              onBlur={(e): void => onBlurDescriptionHandler(e)}
            />
          </div>
        </div>
        <div className="actions">
          <GrClose className="close-modal" onClick={(): void => onBlurModalHandler()} />
          <p className="actions-header">Actions</p>
          <button
            ref={cardModalButton}
            className="card-big-modal-button actions-button"
            onClick={(): void => {
              onClickCopingHandler();
            }}
          >
            Coping
          </button>
          <button className="card-big-modal-button actions-button" onClick={(): void => onClickInListHandler()}>
            Moving
          </button>
          <button className="red-theme card-big-modal-button actions-button" onClick={(): void => archivingHandler()}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
