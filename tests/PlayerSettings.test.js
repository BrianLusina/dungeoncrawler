/**
 * @author lusinabrian on 10/05/17.
 * @notes: PlayerSettings test cases
 */
import expect from 'expect';
import { shallow } from 'enzyme';
import PlayerSettings from '../src/containers/PlayerSettings';
import React from 'react';
import { render } from 'react-dom';

describe("PlayerSettings container should", function () {
    var wrapper;

    beforeEach(()=>{
        wrapper = <PlayerSettings/>
    });

    it("render without crashing", function () {
        const div = document.createElement("div");
        render(<wrapper />, div);
    });

});
