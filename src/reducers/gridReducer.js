/**
 * @author lusinabrian on 09/05/17.
 * @notes: Grid reducer handling actions dealing with the grid of the application
 */

import * as types from '../constants/actionTypes';
import initialState from './initialState';
import update from 'immutability-helper';

/**
 * Reducer for the grid
 * @param{object} state, current state of the grid in the application
 * @param{String} type, action type to dispatch to the store
 * @param{object} payload, optional payload to dispatch along with the action to the store to update
 * the application state
 * @return{object} next state of the grid in the application
 * */
export default (state = initialState.grid, {type, payload}) => {
    switch (type){
        case types.CHANGE_ENTITY:
            const [x, y] = payload.coords;
            const entities =	update(state.entities, {
                [y]: {
                    [x]: {$set: payload.entity }
                }
            });
            return { ...state, entities };

        case types.CHANGE_PLAYER_POSITION:
            return { ...state, playerPosition: payload };

        case types.CREATE_LEVEL:
            return {
                ...state,
                playerPosition: payload.playerPosition,
                entities: payload.entities
            };

        case types.SET_DUNGEON_LEVEL:
            return { ...state, dungeonLevel: payload };

        default:
            return state;
    }
}
