import { AnyAction } from 'redux';

type AuthorizationType = {
  isAuthorized: boolean;
};
const initialState: AuthorizationType = {
  isAuthorized: localStorage.getItem('access_token') !== null,
};

export default function reducer(state = initialState, action: AnyAction): AuthorizationType {
  switch (action.type) {
    case 'IS_AUTHORIZED':
      return { isAuthorized: action.payload };
    default: {
      return { ...state };
    }
  }
}
