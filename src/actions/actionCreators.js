/**
 * Action creators that will be used to dispatch actions to the store
 * */
import * as types from '../constants/actionTypes';


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
