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

    /**
     * Called right before render, this will be called once, so, make it count!
     * Set the initial settings from the application, window height, width
     * set and create the level the player will start in.
     * */
    componentWillMount(){
        // set the initial viewport size
        const viewportWidth = window.innerWidth / this.VP_WIDTH_RATIO;
        const viewportHeight = Math.max(this.VP_MINIMUM_HEIGHT,
            (window.innerHeight / this.VP_HEIGHT_RATIO) - this.VP_HEIGHT_OFFSET
        );

        // update the states
        this.setState({
            viewportHeight, viewportWidth
        });

        // create the level and set the level to 1
        this.props.createLevel();
        this.props.setDungeonLevel(1);
    }

    /***
     * Component will render!
     */
    render(){
        return(

        )
    }

    /**
     * Component did mount, we add event listeners to the window and trigger opening cred...err..
     * messages :D
     * Will add event listeners and a function. These will be invoked once every set period of time
     * The keydown event will be set once 0.1 seconds ad resizing will be set once in .5 seconds
     * This is similar to setTimeout
     * */
    componentDidMount(){
        window.addEventListener("keydown", _.throttle(this.handleKeyPress, 100));
        window.addEventListener("resize", _.throttle(this.handleResize, 500));
        this.props.triggerOpeningMessages();
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
