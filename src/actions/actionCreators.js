
export const damage = (entity, value, store) =>{
    store.dispatch({ type: 'DAMAGE', entityName: entity, value: value });
};
export const heal = (entity, health, store) => {
    store.dispatch({ type: 'HEAL', entityName: entity, value: health });
};

export const move = (entity, vector, store) => {
    store.dispatch({ type: 'MOVE', entityName: entity, vector: vector });
};

export const setLocation = (entity, location, store) => {
    store.dispatch({ type: 'SET_LOCATION', entityName: entity, location: location });
};

export const switchWeapon = (weaponName, attack, store) => {
    store.dispatch({ type: 'SWITCH_WEAPON', weapon: weaponName, attack: attack });
};

export const addEntity = (entityName, entityType, health, attack, location, store) => {
    store.dispatch({ type: 'ADD_ENTITY', entityName: entityName, entityType: entityType,
        health: health, attack: attack, location: location });
};

export const removeEntity = (entityName, store) => {
    store.dispatch({ type: 'REMOVE_ENTITY', entityName: entityName });
};

export const resetBoard = (store) => {
    store.dispatch({ type: 'RESET_BOARD' });
};

export const setMap = (map, store) => {
    store.dispatch({ type: 'SET_MAP', map: map });
};

export const increaseLevel = (store) => {
    store.dispatch({ type: 'INCREASE_LEVEL' });
};

export const resetLevel = (store) => {
    store.dispatch({ type: 'RESET_LEVEL' });
};

export const setWindowSize = (store) => {
    store.dispatch({ type: 'SET_WINDOW_SIZE',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    });
};

export const gainXp = (xp, store) => {
    store.dispatch({ type: 'GAIN_XP', xp: xp });
};

export const levelUp = (attack, health, xp, store) => {
    store.dispatch({ type: 'LEVEL_UP',
        attack: attack,
        health: health,
        toNextLevel: xp
    });
};

export const resetMap = (map, store) => {
    store.dispatch({ type: 'RESET_MAP', map: map });
};

export const addBoss = (attack, health, coords, store) => {
    store.dispatch({ type: 'ADD_BOSS', attack: attack, health: health, location: coords });
};

export const toggleDarkness = (store) => {
    store.dispatch({ type: 'TOGGLE_DARKNESS' });
};
