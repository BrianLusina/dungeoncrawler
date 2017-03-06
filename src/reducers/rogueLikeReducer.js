import initialState from './initialState';
import * as types from '../constants/game-constants';

// REDUX Reducer
export default function rogueLikeReducer() {
    var _extends2, _extends3, _extends4, _extends5, _extends6, _extends7, _occupiedSpaces, _extends8;

    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'DAMAGE':
            return types._extends({}, state, {
                entities: types._extends({}, state.entities, (_extends2 = {}, _extends2[action.entityName] = types._extends({}, state.entities[action.entityName], {
                    health: state.entities[action.entityName].health - action.value
                }), 
                    _extends2))
            });
        case 'HEAL':
            return types._extends({}, state, {
                entities:types. _extends({}, state.entities, (_extends3 = {}, _extends3[action.entityName] = types._extends({}, state.entities[action.entityName], {
                    health: state.entities.player.health + action.value
                }), _extends3))
            });
        case 'SWITCH_WEAPON':
            return types._extends({}, state, {
                entities: types._extends({}, state.entities, {
                    'player': types._extends({}, state.entities.player, {
                        weapon: action.weapon,
                        attack: state.entities.player.attack + action.attack
                    })
                })
            });
        case 'MOVE':
            return types._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(state.entities[action.entityName].x + action.vector.x + 'x' + (state.entities[action.entityName].y + action.vector.y), action.entityName).value(),
                entities: types._extends({}, state.entities, (_extends4 = {}, _extends4[action.entityName] = types._extends({}, state.entities[action.entityName], {
                    x: state.entities[action.entityName].x + action.vector.x,
                    y: state.entities[action.entityName].y + action.vector.y
                }), _extends4))
            });
        case 'SET_LOCATION':
            return types._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(action.location.x + 'x' + action.location.y, action.entityName).value(),
                entities: types._extends({}, state.entities, (_extends5 = {}, _extends5[action.entityName] = types._extends({}, state.entities[action.entityName], {
                    x: action.location.x,
                    y: action.location.y
                }), _extends5))
            });
        case 'ADD_ENTITY':
            return types._extends({}, state, {
                occupiedSpaces: types._extends({}, state.occupiedSpaces, (_extends6 = {}, _extends6[action.location.x + 'x' + action.location.y] = action.entityName, _extends6)),
                entities: types._extends({}, state.entities, (_extends7 = {}, _extends7[action.entityName] = {
                    entityType: action.entityType,
                    health: action.health,
                    attack: action.attack,
                    x: action.location.x,
                    y: action.location.y
                }, _extends7))
            });
        case 'REMOVE_ENTITY':
            return types._extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).value(),
                entities: _.chain(state.entities).omit(action.entityName).value()
            });
        case 'RESET_BOARD':
            return types._extends({}, state, {
                entities: {
                    'player': state.entities.player
                },
                occupiedSpaces: (_occupiedSpaces = {}, _occupiedSpaces[state.entities.player.x + 'x' + state.entities.player.y] = 'player', _occupiedSpaces)
            });
        case 'SET_MAP':
            return types._extends({}, state, {
                map: action.map
            });
        case 'INCREASE_LEVEL':
            return types._extends({}, state, {
                level: state.level + 1
            });
        case 'RESET_LEVEL':
            return types._extends({}, state, {
                level: 0
            });
        case 'SET_WINDOW_SIZE':
            return types._extends({}, state, {
                windowHeight: action.windowHeight,
                windowWidth: action.windowWidth
            });
        case 'GAIN_XP':
            return types._extends({}, state, {
                entities: types._extends({}, state.entities, {
                    'player': types._extends({}, state.entities.player, {
                        toNextLevel: state.entities.player.toNextLevel - action.xp
                    })
                })
            });
        case 'LEVEL_UP':
            return types._extends({}, state, {
                entities: types._extends({}, state.entities, {
                    'player': types._extends({}, state.entities.player, {
                        attack: state.entities.player.attack + action.attack,
                        health: state.entities.player.health + action.health,
                        toNextLevel: action.toNextLevel,
                        level: state.entities.player.level + 1
                    })
                })
            });
        case 'RESET_MAP':
            return types._extends({}, initialState, {
                map: action.map
            });
        case 'ADD_BOSS':
            return types._extends({}, state, {
                occupiedSpaces: types._extends({}, state.occupiedSpaces, (types._extends8 = {}, types._extends8[action.location.x + 'x' + action.location.y] = 'boss', types._extends8[action.location.x + 1 + 'x' + action.location.y] = 'boss', types._extends8[action.location.x + 'x' + (action.location.y + 1)] = 'boss', types._extends8[action.location.x + 1 + 'x' + (action.location.y + 1)] = 'boss', types._extends8)),
                entities: types._extends({}, state.entities, {
                    boss: {
                        entityType: 'enemy',
                        health: action.health,
                        attack: action.attack,
                        x: action.location.x,
                        y: action.location.y
                    }
                })
            });
        case 'TOGGLE_DARKNESS':
            return types._extends({}, state, {
                darkness: !state.darkness
            });
        default:
            return state;
    }
    return state;
}
