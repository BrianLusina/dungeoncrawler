/**
 * @author lusinabrian on 11/05/17.
 * @notes: Game container, where the magic happens?
 */
import React, { Component } from 'react';
import _ from  'lodash';
import { connect } from 'react-redux';
import playerInput, { createLevel, openingMessages, setDungeonLevel } from '../actions/actionCreators';
import Cell from '../components/cell';

/**
 * Grid container*/
class Grid extends Component{
    constructor(){
        super();
        this.state ={
            viewportWidth:0,
            viewportHeight:0
        };

        this.VP_HEIGHT_OFFSET = 5; // in ems to match elements above this component
        this.VP_MINIMUM_HEIGHT = 22; // in ems
        // set ratios for determining the viewport size
        this.VP_WIDTH_RATIO = 30;
        this.VP_HEIGHT_RATIO = 21;
    }
}

/**
 * Maps the state of the store to the props of this container and merges them, making it easier to
 * sync store changes to props and pass them to this container
 * */
const mapStateToProps = ({ ui, grid, player }) => {
    return {
        fogMode: ui.fogMode, grid, player
    };
};

/**
 * Maps actions to be dispatched to props
 * */
const mapDispatchToProps = (dispatch) =>{
    return {
        playerInput: (vector) => dispatch(playerInput(vector)),
        createLevel: () => dispatch(createLevel()),
        setDungeonLevel: (level) => dispatch(setDungeonLevel(level)),
        triggerOpeningMessages: () => dispatch(openingMessages())
    }
};

/**
 * Connect to store and return a function that takes this container as an argument
 * */
export default connect(mapStateToProps, mapDispatchToProps)(Grid);
