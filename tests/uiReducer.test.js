/**
 * @author lusinabrian on 09/05/17.
 * @notes: Tests for uiReducer
 */

import expect from 'expect';
import uiReducer from '../src/reducers/uiReducer';
import * as types from '../src/constants/actionTypes';

describe("Tests for uiReducer", function(){
    const messages = [];

    const initialState = {
        fogMode: true,
        messages
    };

    it("should return the initial state when action type is undefined", ()=>{
       expect(uiReducer(undefined, [])).toEqual(initialState)
    });

    it("should return the initial state when the action type is restart", ()=>{
        expect(uiReducer(initialState, types.RESTART)).toEqual(initialState)
    });

    //TODO: unskip these tests when ui reducer functionality is figured out
    xit("should be able to toggle fog mode to false", ()=>{
        expect(uiReducer(initialState, types.TOGGLE_FOG_MODE)).toEqual({
            fogMode: false, messages
        });
    });

    xit("should be able to toggle fog mode to true", ()=>{
        let state = {
            fogMode: false, messages
        };
        expect(uiReducer(state, types.TOGGLE_FOG_MODE)).toEqual({
            fogMode: true, messages
        });
    });
});