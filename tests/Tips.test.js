/**
 * @author lusinabrian on 10/05/17.
 * @notes: Tests for Tips component
 */
import ReactDOM from 'react-dom';
import expect from 'expect';
import { shallow}from 'enzyme';
import React from 'react';
import Tips from '../src/containers/Tips';

describe("Test Tips Container", function () {
    var wrapper;

    beforeEach(function () {
        wrapper = shallow(<Tips/>);
    });

    it("should render as expected", function () {
        const div = document.createElement("div");
        ReactDOM.render(<wrapper />, div);
    });

    it("should have 1 div element", ()=>{
       expect(wrapper.find("div").length).toEqual(1)
    });

    it("div should have class of strip", function () {
        expect(wrapper.find("div").hasClass("strip")).toBe(true);
    });

    it("div should have 1 p tag with a tip", function () {
        expect(wrapper.find("p").length).toEqual(1);
    });

    it("p tag should have children that are strings", function () {
        expect(typeof wrapper.find("p").text()).toBe("string");
    });
});