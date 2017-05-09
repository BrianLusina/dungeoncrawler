/**
 * @author lusinabrian on 09/05/17.
 * @notes: Reducer tests for Grid reducer
 */
import * as types from '../src/constants/actionTypes';
import update from 'immutability-helper';
import expect from 'expect';
import gridReducer from '../src/reducers/gridReducer';


describe("Grid Reducer tests", function(){
    const initialState = {
        entities:[[]],
        dungeonLevel:0,
        playerPosition:[],
    };

    it("should return initial state on undetermined action type", ()=>{
       expect(gridReducer(initialState, [])).toEqual(initialState);
    });

    //TODO: grid reducer tests per action type
/*        case types.CHANGE_ENTITY:
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
 */
});
