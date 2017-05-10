/**
 * Action creators that will be used to dispatch actions to the store
 * */
import * as types from '../constants/actionTypes';
import _ from 'lodash';
import createMap from '../utils/createMap';
import populateEntities from '../utils/entityCreator';
import { batchActions } from 'redux-batched-actions';

//ACTION-CREATORS
function addWeapon(payload) {
    return {
        type: types.ADD_WEAPON,
        payload: payload
    };
}

function addXP(payload) {
    return {
        type: types.ADD_XP,
        payload: payload
    };
}

function changeEntity(entity, coords) {
    return {
        type: types.CHANGE_ENTITY,
        payload: { entity: entity, coords: coords }
    };
}

function changePlayerPosition(payload) {
    return {
        type: types.CHANGE_PLAYER_POSITION,
        payload: payload
    };
}

function createLevel(level) {
    return {
        type: types.CREATE_LEVEL,
        payload: populateEntities(createMap(), level)
    };
}

function modifyHealth(payload) {
    return {
        type: types.MODIFY_HEALTH,
        payload: payload
    };
}

function newMessage(payload) {
    return {
        type: types.NEW_MESSAGE,
        payload: payload
    };
}

function restart() {
    return {
        type: types.RESTART
    };
}

function setDungeonLevel(payload) {
    return {
        type: types.SET_DUNGEON_LEVEL,
        payload: payload
    };
}

function toggleFogMode() {
    return {
        type: types.TOGGLE_FOG_MODE
    };
}

// thunk
export default (vector) => {
    return (dispatch, getState) => {
        const { grid, player } = getState();

        // cache some useful variables
        const [ x, y ] = grid.playerPosition.slice(0); // get current location
        const [ vectorX, vectorY ] = vector; // get direction modifier
        const newPosition = [vectorX + x, vectorY + y]; // define where we're moving to
        const newPlayer = grid.entities[y][x];
        const destination = grid.entities[y + vectorY][x + vectorX]; // whats in the cell we're heading to
        // store the actions in array to be past to batchActions
        const actions = [];

        // move the player unless destination is an enemy or a '0' cell
        if (destination.type && destination.type !== 'enemy' && destination.type !== 'boss') {
            actions.push(
                changeEntity({ type: 'floor' }, [x, y]),
                changeEntity(newPlayer, newPosition),
                changePlayerPosition(newPosition)
            );
        }
        switch (destination.type) {
            case 'boss':
            case 'enemy': {
                const playerLevel = Math.floor(player.xp / 100);
                // player attacks enemy
                const enemyDamageTaken = Math.floor(player.weapon.damage * _.random(1, 1.3) * playerLevel);
                destination.health -= enemyDamageTaken;

                if (destination.health > 0) {
                    // enemy attacks player
                    const playerDamageTaken = Math.floor(_.random(4, 7) * destination.level);

                    actions.push(
                        changeEntity(destination, newPosition),
                        modifyHealth(player.health - playerDamageTaken),
                        newMessage(`FIGHT! You hurt the enemy with attack of [${enemyDamageTaken}].	The enemy hits back with an attack of [${playerDamageTaken}].  Enemy has [${destination.health}] health remaining.`)
                    );

                    if (player.health - playerDamageTaken <= 0) {
                        // player dies
                        dispatch(modifyHealth(0));
                        setTimeout(() => dispatch(setDungeonLevel('death')), 250);
                        setTimeout(() => dispatch(newMessage(`YOU DIED`)),
                            1000);
                        setTimeout(() => dispatch(newMessage(`Everything goes dark..`)),
                            2000);
                        setTimeout(() => dispatch(newMessage(`You resolve to try harder next time`)),
                            4000);
                        setTimeout(() => dispatch(newMessage(`The grid resets itself....`)),
                            6000);
                        setTimeout(() => dispatch(batchActions([
                                restart(), createLevel(1), setDungeonLevel(1)
                            ])),
                            8000);
                        return;
                    }
                }

                if (destination.health <= 0) {
                    // the fight is over and the player has won
                    // add XP and move the player
                    if (destination.type === 'boss') {
                        actions.push(
                            addXP(10),
                            changeEntity({ type: 'floor'}, [x, y]),
                            changeEntity(newPlayer, newPosition),
                            changePlayerPosition(newPosition),
                            newMessage(`VICTORY! Your attack of [${enemyDamageTaken}] is too powerful for the enemy, who dissolves before your very eyes.`)
                        );
                        setTimeout(() => dispatch(setDungeonLevel('victory')), 250);
                        setTimeout(() => dispatch(newMessage(`YOU DEFATED THE BOSS!`)),
                            1000);
                        setTimeout(() => dispatch(newMessage(`The BOSS emits an almighty scream`)),
                            2000);
                        setTimeout(() => dispatch(newMessage(`You bask momentarily in your glory`)),
                            4000);
                        setTimeout(() => dispatch(newMessage(`The grid resets itself....`)),
                            6000);
                        setTimeout(() => dispatch(batchActions([
                                restart(), createLevel(1), setDungeonLevel(1)
                            ])),
                            8000);
                    } else {
                        actions.push(
                            addXP(10),
                            changeEntity({ type: 'floor'}, [x, y]),
                            changeEntity(newPlayer, newPosition),
                            changePlayerPosition(newPosition),
                            newMessage(`VICTORY! Your attack of [${enemyDamageTaken}] is too powerful for the enemy, who dissolves before your very eyes.`)
                        );
                        setTimeout(() => dispatch(newMessage(`You gain 10XP and feel yourself growing stronger..`)),
                            2500);
                        if ((player.xp + 10) % 100 === 0) {
                            setTimeout(() => dispatch(newMessage(`LEVEL UP!`)), 5000);
                        }
                    }
                }
                break;
            }
            case 'exit':
                setTimeout(() => dispatch(batchActions([
                    setDungeonLevel(grid.dungeonLevel + 1),
                    createLevel(grid.dungeonLevel + 1)
                ])), 3000);
                actions.push(
                    newMessage(`The cells start to shift... you transit to zone ${grid.dungeonLevel + 1}`)
                );
                setTimeout(() => dispatch(setDungeonLevel(`transit-${grid.dungeonLevel + 1}`)), 250);
                break;
            case 'potion':
                actions.push(
                    modifyHealth(player.health + 30),
                    newMessage(`You drink a potion for [30] health`)
                );
                break;
            case 'weapon':
                actions.push(
                    addWeapon(destination),
                    newMessage(`You pick up a ${destination.name}`)
                );
                break;
            default:
                break;
        }

        dispatch(batchActions(actions));
    };
};

export function openingMessages() {
    return (dispatch) => {
        dispatch(newMessage(`Welcome to The Grid...`));
        setTimeout(() => {
            dispatch(newMessage(`You find yourself in a world filled with strange cells`));
        }, 3000);
        setTimeout(() => {
            dispatch(newMessage(`'Hmm... there must be a way out of here..'`));
        }, 6000);
    };
}

export function restartGame() {
    return (dispatch) => {
        dispatch(newMessage(`The grid resets itself....`));
        setTimeout(() => dispatch(batchActions([
                restart(), createLevel(1), setDungeonLevel(1)
            ])),
            1000);
    };
}
