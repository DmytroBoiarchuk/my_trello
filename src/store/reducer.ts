import { combineReducers } from 'redux';
import boardReducer from './modules/board/reducer';
import boardsReducer from './modules/boards/reducer';
import userReducer from './modules/user/reducer';
import loadingReducer from './modules/loading/reducer';
import heightReducer from './modules/slotData/reducer';
import cardModalReducer from './modules/cardModal/reducer';

export default combineReducers({
  board: boardReducer,
  boards: boardsReducer,
  user: userReducer,
  loading: loadingReducer,
  slotsData: heightReducer,
  cardModalData: cardModalReducer,
});
