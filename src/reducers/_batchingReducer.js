/**
 * @author lusinabrian on 08/05/17.
 * @notes: will batch all actions and pass to the store and return a new state for the application
 */
import initialState from './initialState';
import * as gConstants from '../constants/gameConstants';
import * as types from '../constants/actionTypes';

export default function enableBatching(reduce) {
    return function batchingReducer(state, action) {
        switch (action.type) {
            case types.BATCH:
                return action.payload.reduce(batchingReducer, state);
            default:
                return reduce(state, action);
        }
    };
}
