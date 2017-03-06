import {} from 'redux';

export const damage = (entity, value) =>{
    store.dispatch({ type: 'DAMAGE', entityName: entity, value: value });
};
export const heal = (entity, health) => {
    store.dispatch({ type: 'HEAL', entityName: entity, value: health });
};

export const move = (entity, vector) => {
    store.dispatch({ type: 'MOVE', entityName: entity, vector: vector });
};

export const setLocation = (entity, location) => {
    store.dispatch({ type: 'SET_LOCATION', entityName: entity, location: location });
};

export const switchWeapon = (weaponName, attack) => {
    store.dispatch({ type: 'SWITCH_WEAPON', weapon: weaponName, attack: attack });
};

export const addEntity = (entityName, entityType, health, attack, location) => {
    store.dispatch({ type: 'ADD_ENTITY', entityName: entityName, entityType: entityType,
        health: health, attack: attack, location: location });
};

export const removeEntity = (entityName) => {
    store.dispatch({ type: 'REMOVE_ENTITY', entityName: entityName });
};

export const resetBoard = () => {
    store.dispatch({ type: 'RESET_BOARD' });
};

export const setMap = (map) => {
    store.dispatch({ type: 'SET_MAP', map: map });
};

export const increaseLevel = () => {
    store.dispatch({ type: 'INCREASE_LEVEL' });
};

export const resetLevel = () => {
    store.dispatch({ type: 'RESET_LEVEL' });
};

export const setWindowSize = () => {
    store.dispatch({ type: 'SET_WINDOW_SIZE',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    });
};

export const gainXp = (xp) => {
    store.dispatch({ type: 'GAIN_XP', xp: xp });
};

export const levelUp = (attack, health, xp) => {
    store.dispatch({ type: 'LEVEL_UP',
        attack: attack,
        health: health,
        toNextLevel: xp
    });
};

export const resetMap = (map) => {
    store.dispatch({ type: 'RESET_MAP', map: map });
};

export const addBoss = (attack, health, coords) => {
    store.dispatch({ type: 'ADD_BOSS', attack: attack, health: health, location: coords });
};

export const toggleDarkness = () => {
    store.dispatch({ type: 'TOGGLE_DARKNESS' });
};
