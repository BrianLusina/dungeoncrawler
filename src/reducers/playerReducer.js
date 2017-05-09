import initialState from './initialState';
import * as types from '../constants/actionTypes';

/**
 * Pure reducer function that will handle the changes in the state of the application
 * This will tak care of the play state in the application.
 * @param{object} state the current state of the  application
 * @param{object} type the action to dispatch to the store
 * @param{object} payload
 * @return{object} next state of the application
 * */
export default (state = initialState.player, {type, payload}) => {
    switch (type){
        case types.ADD_WEAPON:
            return {...state, weapon: payload};

        case types.ADD_XP:
            return {...state, xp: state.xp + payload};

        case types.MODIFY_HEALTH:
            return {...state, health: payload};

        case types.RESTART:
            return initialState.player;

        default:
            return state;
    }
}
