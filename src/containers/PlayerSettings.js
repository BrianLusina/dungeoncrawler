/**
 * @author lusinabrian on 10/05/17.
 * @notes: Player Settings Container
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { restartGame, toggleFogMode } from '../actions/actionCreators';


/**
 * Container with player settings
 * */
class PlayerSettings extends Component{
    constructor(){
        super();

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /**
     * Add event listener when the component is mount
     * */
    componentDidMount(){
        window.addEventListener("keydown", this.handleKeyPress);
    }

    /**
     * Render component
     * */
    render(){
        const { fogMode, restartGame, toggleFogMode } = this.props;
        return(
            <div className="panel">
                <div className="score-item">
                    <input
                        onChange={toggleFogMode}
                        id="toggle"
                        type="checkbox"
                        checked={fogMode}
                    />
                    <label htmlFor="toggle">
                        Toggle Fog mode
                    </label>
                </div>
                <div className="score-item">
                    <div onClick={restartGame} className="restart-btn"></div>
                    <div onClick={restartGame} className="setting-label">Restart</div>
                </div>
            </div>
        )
    }

    /**
     * remove listener when container is unmount
     * */
    componentWillUnmount(){
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    /**
     * Listener for handling key press
     * @param{object} e, event object received
     * */
    handleKeyPress(e){
        e.preventDefault();
        switch(e.keyCode()){
            case 70:
                this.props.toggleFogMode();
                break;
            case 82:
                this.props.restartGame();
                break;
            default:
                return;
        }
    }
}

/**
 * Subscribe component to redux store and merge state into components
 * allows us keep in sync with store's updates and to format our state values before
 * passing as props to the React component.
 * */
const mapStateToProps = ({ ui }) =>{
    return {fogMode: ui.fogMode}
};

const mapDispatchToProps = (dispatch) =>{
    return {
        toggleFogMode: () => dispatch(toggleFogMode()),
        restartGame: () => dispatch(restartGame())
    }
};

/**
 * connect method from react redux connects the component to redux store
 * this will return a function that will take this container as an argument
 */
export default connect(mapStateToProps, mapDispatchToProps)(PlayerSettings);
