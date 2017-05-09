import initialState from './initialState';
import * as gConstants from '../constants/gameSettings';
import * as types from '../constants/actionTypes';
import _ from 'lodash';

/**
 * Pure reducer function that will handle the changes in the state of the application
 * The state tree of the application will be reduced using actions that will be dispatched
 * to the store and return the next state of the application
 * @param{object} state the current state of the  application
 * @param{object} action the action to dispatch to the store
 * @return{object} next state of the application
 * */
export default function rogueReducer(state = initialState, action) {
    let _extends2, _extends3, _extends4, _extends5, _extends6, _extends7, _occupiedSpaces, _extends8;

    switch (action.type) {
        case types.DAMAGE:
            return gConstants._extends({}, state, {
                entities: gConstants._extends({}, state.entities,
                    (_extends2 = {},
                        _extends2[action.entityName] = gConstants._extends({},
                            state.entities[action.entityName],
                            { health: state.entities[action.entityName].health - action.value
                    }), _extends2)
                )
            });
        case types.HEAL:
            return gConstants._extends({}, state, {
                entities: gConstants._extends({}, state.entities, (_extends3 = {}, _extends3[action.entityName] = gConstants._extends({}, state.entities[action.entityName], {
                    health: state.entities.player.health + action.value
                }), _extends3))
            });

        case types.SWITCH_WEAPON:
            return gConstants._extends({}, state, {
                entities: gConstants._extends({}, state.entities, {
                    'player': gConstants._extends({}, state.entities.player, {
                        weapon: action.weapon,
                        attack: state.entities.player.attack + action.attack
                    })
                })
            });

        case types.MOVE:
            return gConstants._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(state.entities[action.entityName].x + action.vector.x + 'x' + (state.entities[action.entityName].y + action.vector.y), action.entityName).value(),
                entities: gConstants._extends({}, state.entities, (_extends4 = {}, _extends4[action.entityName] = gConstants._extends({}, state.entities[action.entityName], {
                    x: state.entities[action.entityName].x + action.vector.x,
                    y: state.entities[action.entityName].y + action.vector.y
                }), _extends4))
            });

        case types.SET_LOCATION:
            return gConstants._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(action.location.x + 'x' + action.location.y, action.entityName).value(),
                entities: gConstants._extends({}, state.entities, (_extends5 = {}, _extends5[action.entityName] = gConstants._extends({}, state.entities[action.entityName], {
                    x: action.location.x,
                    y: action.location.y
                }), _extends5))
            });
        case types.ADD_ENTITY:
            return gConstants._extends({}, state, {
                occupiedSpaces: gConstants._extends({}, state.occupiedSpaces, (_extends6 = {}, _extends6[action.location.x + 'x' + action.location.y] = action.entityName, _extends6)),
                entities: gConstants._extends({}, state.entities, (_extends7 = {}, _extends7[action.entityName] = {
                    entityType: action.entityType,
                    health: action.health,
                    attack: action.attack,
                    x: action.location.x,
                    y: action.location.y
                }, _extends7))
            });
        case types.REMOVE_ENTITY:
            return gConstants._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).value(),
                entities: _.chain(state.entities).omit(action.entityName).value()
            });
        case types.RESET_BOARD:
            return gConstants._extends({}, state, {
                entities: {
                    'player': state.entities.player
                },
                occupiedSpaces: (_occupiedSpaces = {}, _occupiedSpaces[state.entities.player.x + 'x' + state.entities.player.y] = 'player', _occupiedSpaces)
            });
        case types.SET_MAP:
            return gConstants._extends({}, state, {
                gameMap: action.map
            });
        case types.INCREASE_LEVEL:
            return gConstants._extends({}, state, {
                level: state.level + 1
            });
        case types.RESET_LEVEL:
            return gConstants._extends({}, state, {
                level: 0
            });
        case types.SET_WINDOW_SIZE:
            return gConstants._extends({}, state, {
                windowHeight: action.windowHeight,
                windowWidth: action.windowWidth
            });
        case types.GAIN_XP:
            return gConstants._extends({}, state, {
                entities: gConstants._extends({}, state.entities, {
                    'player': gConstants._extends({}, state.entities.player, {
                        toNextLevel: state.entities.player.toNextLevel - action.xp
                    })
                })
            });
        case types.LEVEL_UP:
            return gConstants._extends({}, state, {
                entities: gConstants._extends({}, state.entities, {
                    'player': gConstants._extends({}, state.entities.player, {
                        attack: state.entities.player.attack + action.attack,
                        health: state.entities.player.health + action.health,
                        toNextLevel: action.toNextLevel,
                        level: state.entities.player.level + 1
                    })
                })
            });
        case types.RESET_MAP:
            return gConstants._extends({}, initialState, {
                gameMap: action.map
            });

        case types.ADD_BOSS:
            return gConstants._extends({}, state, {
                occupiedSpaces: gConstants._extends({}, state.occupiedSpaces, (gConstants._extends8 = {}, gConstants._extends8[action.location.x + 'x' + action.location.y] = 'boss', gConstants._extends8[action.location.x + 1 + 'x' + action.location.y] = 'boss', gConstants._extends8[action.location.x + 'x' + (action.location.y + 1)] = 'boss', gConstants._extends8[action.location.x + 1 + 'x' + (action.location.y + 1)] = 'boss', gConstants._extends8)),
                entities: gConstants._extends({}, state.entities, {
                    boss: {
                        entityType: 'enemy',
                        health: action.health,
                        attack: action.attack,
                        x: action.location.x,
                        y: action.location.y
                    }
                })
            });

        case types.TOGGLE_DARKNESS:
            return gConstants._extends({}, state, {
                darkness: !state.darkness
            });
        default:
            return state;
    }
}
