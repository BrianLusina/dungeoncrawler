/**
 * @author lusinabrian on 11/05/17.
 * @notes: Test cases for Game container
 */
import Grid from '../src/containers/Game';
import React from 'react';
import { render } from 'react-dom';
import expect from 'expect';
import { shallow } from 'enzyme';

const setup = () =>{
    const props = {

    };

    const Wrapper = <Grid {...props}/>;
    return { Wrapper, Grid };
};

describe("Grid container should", function () {

    it("render without crash", () =>{
        const { Wrapper } = setup();

        const div = document.createElement("div");
        render( <Wrapper/>, div);
    });


});
