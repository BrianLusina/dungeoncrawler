import player from './playerReducer';
import ui from './uiReducer';
import grid from './gridReducer';
import { combineReducers } from 'redux';

/**
 * The state tree of the application will be reduced using actions that will be dispatched
 * to the store and return the next state of the application
 * */
const rootReducer = combineReducers({
    player, ui, grid
});

export default rootReducer;

