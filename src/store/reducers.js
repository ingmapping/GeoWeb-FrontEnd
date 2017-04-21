import { combineReducers } from 'redux';
const reducer = require('../reducers/adagucReducer').default;
const defaultReducer = require('./defaultReducer').default;

export const makeRootReducer = () => {
  return combineReducers({
    adagucProperties: reducer,
    header: defaultReducer,
    rightSideBar: defaultReducer,
    leftSideBar: defaultReducer,
    mainViewport: defaultReducer
  });
};
export default makeRootReducer;
