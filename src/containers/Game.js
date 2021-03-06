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
 * Game container*/
class Game extends Component{
    constructor(){
        super();
        this.state ={
            viewportWidth:0,
            viewportHeight:0
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleResize = this.handleResize.bind(this);

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
     * magically render to the DOM
     */
    render(){
        // ensure the viewport height and width is always even
        const viewportHeight = this.state.viewportHeight - this.state.viewportHeight % 2;
        const viewportWidth = this.state.viewportWidth - this.state.viewportWidth % 2;

        const { entities } = this.props.grid;
        const [ playerX, playerY ] = this.props.grid.playerPosition;

        // define the limits of the cells to be displayed in the viewport
        const top = _.clamp(playerY - viewportHeight / 2, 0, entities.length - viewportHeight);
        const right = Math.max(playerX + viewportWidth / 2, viewportWidth);
        const bottom = Math.max(playerY + viewportHeight / 2, viewportHeight);
        const left = _.clamp(playerX - viewportWidth / 2, 0, entities[0].length - viewportWidth);

        // create a new array of entities which includes the distance from the player
        // used to enable fog mode
        const newEntities = entities.map((row, i) => row.map((cell, j) => {
            cell.distanceFromPlayer = (Math.abs(playerY - i)) + (Math.abs(playerX - j));
            return cell;
        }));

        // create cell components from the entities that are in scope of the viewport
        const cells = newEntities.filter((row, i) => i >= top && i < bottom)
            .map((row, i) => {
                return (
                    <div key={i} className="row">
                        {
                            row
                                .filter((row, i) => i >= left && i < right)
                                .map((cell, j) => {
                                    return (
                                        <Cell
                                            key={j}
                                            cell={cell}
                                            distance={cell.distanceFromPlayer}
                                            zone={this.props.grid.dungeonLevel}
                                            visible={this.props.fogMode}
                                        />
                                    );
                                })
                        }
                    </div>
                );
            });

        return (
            <div className="grid-wrapper">
                {cells}
            </div>
        );
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

    /**
     * Component will go away now
     * this is the best place to remove the event listeners we set above
     */
    componentWillUnmount(){
        window.removeEventListener("keydown", _.throttle(this.handleKeyPress, 100));
        window.removeEventListener("resize", _.throttle(this.handleResize, 500));
    }

    /**
     * Handles key presses on the application
     * @param{object} e, event object
     * */
    handleKeyPress(e){
        e.preventDefault();
        if(typeof (this.props.grid.dungeonLevel) ===  "number"){
            switch (e.keyCode){
                // north
                case 38:
                case 87:
                    this.props.playerInput([0, -1]);
                    break;
                // east
                case 39:
                case 68:
                    this.props.playerInput([1, 0]);
                    break;
                // south
                case 40:
                case 83:
                    this.props.playerInput([0, 1]);
                    break;
                // west
                case 37:
                case 65:
                    this.props.playerInput([-1, 0]);
                    break;
                default:
                    return;
            }
        }
    }

    /**
     * Handles resizing of the game grid
     * @param{object} e, event object from calling this method
     * */
    handleResize(e){
        e.preventDefault();
        const viewportWidth = e.target.innerWidth / this.VP_WIDTH_RATIO;
        const viewportHeight = Math.max(
            this.VP_MINIMUM_HEIGHT,
            (e.target.innerHeight / this.VP_HEIGHT_RATIO) - this.VP_HEIGHT_OFFSET
        );
        this.setState({ viewportWidth, viewportHeight });
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
export default connect(mapStateToProps, mapDispatchToProps)(Game);
