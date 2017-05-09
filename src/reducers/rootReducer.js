import playerReducer from './playerReducer';
import uiReducer from './uiReducer';
import gridReducer from './gridReducer';
import { combineReducers } from 'redux';

/**
 * The state tree of the application will be reduced using actions that will be dispatched
 * to the store and return the next state of the application
 * */
const rootReducer = combineReducers({
    playerReducer, uiReducer, gridReducer
});

export default rootReducer;

