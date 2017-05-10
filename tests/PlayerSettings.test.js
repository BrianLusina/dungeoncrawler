/**
 * @author lusinabrian on 10/05/17.
 * @notes: PlayerSettings test cases
 */
import expect from 'expect';
import { shallow, mount } from 'enzyme';
import PlayerSettings from '../src/containers/PlayerSettings';
import React from 'react';
import { render } from 'react-dom';

const setup = () =>{
    const props = {
        fogMode: true
    };

    const Wrapper = <PlayerSettings {...props}/>;
    return {Wrapper, props}
};

describe("PlayerSettings container should", function () {

    it("render without crashing", function () {
        const { Wrapper } = setup();

        const div = document.createElement("div");
        render(<Wrapper />, div);
    });

    it("should call dispatch on toggleFogMode", function () {
       const { Wrapper, props } = setup();

       const input = Wrapper.find("input");
       input.props.toggleFogMode(true);
       expect(props.dispatch.calls.length).toBe(1);
    });

    it("should call dispatch on restart game", ()=>{
        const { Wrapper, props } = setup();

        const restartBtn = Wrapper.find("div.restart-btn");
        restartBtn.props.restartGame();
        expect(props.dispatch.calls.length).toBe(1);
    });
});
