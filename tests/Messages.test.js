/**
 * @author lusinabrian on 11/05/17.
 * @notes: Messages Container
 */
import expect from 'expect';
import React from 'react';
import { render } from 'react-dom';
import { shallow } from 'enzyme';
import Messages from '../src/containers/Messages';

const setup = () => {
    const props = {
        messages:[]
    };

    const Wrapper = <Messages {...props}/>;
    return { Wrapper, props};
};


describe("Messages container should", function () {

    it("render without crash", function () {
       const { Wrapper }= setup();

       const div = document.createElement("div");

       render(<Wrapper />, div);
    });

    it("have props of type array", () => {
        const { Wrapper } = setup();

        expect(typeof Wrapper.props().messages).toBe("array");
    });

});