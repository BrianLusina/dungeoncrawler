/**
 * @author lusinabrian on 09/05/17.
 * @notes: Player reducer tests, check if reducer is returning the expected next state of the
 * application.
 */
import expect from 'expect';
import * as types from '../src/constants/actionTypes';
import playerReducer from '../src/reducers/playerReducer';


describe("Tests for player reducer", function(){

    const initialState = {
        health: 100,
        xp: 100,
        weapon:{
            name: "sword",
            damage: 15
        },
    };

    it("should return initial state on an undetermined action type", ()=>{
        expect(playerReducer(initialState, [])).toEqual(initialState);
    });

    //TODO: test for these action types
    /*        case types.ADD_WEAPON:
     return {...state, weapon: payload};

     case types.ADD_XP:
     return {...state, xp: state.xp + payload};

     case types.MODIFY_HEALTH:
     return {...state, health: payload};

     case types.RESTART:
     return initialState.player;
     */

});
