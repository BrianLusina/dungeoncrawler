/**
 * Action creators that will be used to dispatch actions to the store
 * */
import * as types from '../constants/actionTypes';

/**
 * Batch all actions before dispatching them to the store
 * @param{Object} actions actions to dispatch to store
 * @return{object}
 * */
function batchActions(actions) {
    return { type: types.BATCH, payload: actions };
}


//ACTION-CREATORS
function addWeapon(payload) {
    return {
        type: types.ADD_WEAPON,
        payload: payload
    };
}

function addXP(payload) {
    return {
        type: t.ADD_XP,
        payload: payload
    };
}

function changeEntity(entity, coords) {
    return {
        type: t.CHANGE_ENTITY,
        payload: { entity: entity, coords: coords }
    };
}

function changePlayerPosition(payload) {
    return {
        type: t.CHANGE_PLAYER_POSITION,
        payload: payload
    };
}

function _createLevel(level) {
    return {
        type: t.CREATE_LEVEL,
        payload: populateEntities(createMap(), level)
    };
}

function modifyHealth(payload) {
    return {
        type: t.MODIFY_HEALTH,
        payload: payload
    };
}

function newMessage(payload) {
    return {
        type: t.NEW_MESSAGE,
        payload: payload
    };
}

function restart() {
    return {
        type: t.RESTART
    };
}

function _setDungeonLevel(payload) {
    return {
        type: t.SET_DUNGEON_LEVEL,
        payload: payload
    };
}

function _toggleFogMode() {
    return {
        type: t.TOGGLE_FOG_MODE
    };
}

export const damage = (entity, value) =>({
   type: types.DAMAGE,
    entity, value
});

export const heal = (entity, health) => ({
    type: types.HEAL,
    entity, 
    health
});

export const move = (entity, vector) => ({
    type: types.MOVE, 
    entity, 
    vector: vector 
});

export const setLocation = (entity, location) => ({
    type: types.SET_LOCATION, entityName: entity, location: location
});

export const switchWeapon = (weaponName, attack) => ({
    type: types.SWITCH_WEAPON, weapon: weaponName, attack: attack
});

export const addEntity = (entityName, entityType, health, attack, location) => ({
    type: types.ADD_ENTITY, entityName: entityName, entityType: entityType,
        health: health, attack: attack, location: location
});

export const removeEntity = (entityName) => ({
    type: types.REMOVE_ENTITY, entityName: entityName
});

export const resetBoard = () => ({
    type: types.RESET_BOARD
});

export const setMap = (map) => ({
    type: types.SET_MAP, map: map
});

export const increaseLevel = () => ({
    type: types.INCREASE_LEVEL
});

export const resetLevel = () => ({
    type: types.RESET_LEVEL
});

export const setWindowSize = () => ({
    type: types.SET_WINDOW_SIZE,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
});

export const gainXp = (xp) => ({
    type: types.GAIN_XP, xp: xp
});

export const levelUp = (attack, health, xp) => ({
    type: types.LEVEL_UP, attack: attack,
        health: health,
        toNextLevel: xp
});


export const resetMap = (gameMap) => ({
    type: types.RESET_MAP, gameMap
});

export const addBoss = (attack, health, coords) => ({
    type: types.ADD_BOSS, attack: attack, health: health, location: coords
});

export const toggleDarkness = () => ({
    type: types.TOGGLE_DARKNESS
});
