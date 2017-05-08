import rogueLikeReducer from './rogueReducer';
import batchReducer from './batchingReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    rogueLikeReducer, batchReducer
});

export default rootReducer;

