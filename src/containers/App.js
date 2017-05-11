import { connect } from 'react-redux';
import React from 'react';
import Game from '../containers/Game';
import Header from '../components/header';
import Messages from '../containers/Messages';
import PlayerSettings from '../containers/PlayerSettings';
import Scoreboard from '../components/scoreboard';
import Tips from '../containers/Tips';

const App = ({grid, player}) => {
    return (
        <div>
            <Header level={grid.dungeonLevel}/>
            <div id="app">
                <Game/>
                <div className="sidebar">
                    <Scoreboard player={player} grid={grid}/>
                    <PlayerSettings/>
                    <Messages/>
                </div>
            </div>
            <Tips/>
        </div>
    );
};

const mapStateToProps = ({ grid, player }) => {
    return { grid, player };
};

export default connect(mapStateToProps)(App);
