/**
 * @author lusinabrian on 08/05/17.
 * @notes: Reducer for UI
 */
// import initialState from './initialState';
import * as types from '../constants/actionTypes';

const messages = [];

const initialState = {
    fogMode: true,
    messages
};


export default (state=initialState, {type, payload})=>{
    switch (type){
        case types.NEW_MESSAGE:
            return {...state, messages:[...state.messages, payload]};

        case types.TOGGLE_FOG_MODE:
            return {...state, fogMode: !state.fogMode};

        case types.RESTART:
            return initialState;

        default:
            return state
    }
}
