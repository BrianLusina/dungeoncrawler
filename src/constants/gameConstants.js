export let _extends = Object.assign || function(target) {
        for (let i = 1; i < arguments.length; i++) {
            let source = arguments[i];
            for (let key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

export let ATTACK_VARIANCE = 7;

export let tileType = {
    WALL: 0,
    FLOOR: 1
};

export let reverseLookup = ['WALL', 'FLOOR'];

export let weaponTypes = [
    {
        entityName: 'brass knuckles',
        entityType: 'weapon',
        health: 0,
        attack: 7
    },
    {
        entityName: 'serrated dagger',
        entityType: 'weapon',
        health: 0,
        attack: 12
    },
    {
        entityName: 'katana',
        entityType: 'weapon',
        health: 0,
        attack: 16
    },
    {
        entityName: 'reaper\'s scythe',
        entityType: 'weapon',
        health: 0,
        attack: 22
    },
    {
        entityName: 'large trout',
        entityType: 'weapon',
        health: 0,
        attack: 30
    }
];

// enemy attacks and health are the dungeon level + 1 times these constants
export let ENEMY = {
    health: 20,
    attack: 12,
    xp: 10
};

export let PLAYER = {
    baseHealth: 100,
    health: 20,
    attack: 12,
    toNextLevel: 60
};

export let c = {
    GRID_HEIGHT: 60,
    GRID_WIDTH: 80,
    MAX_ROOMS: 15,
    ROOM_SIZE_RANGE: [7, 12],
    STARTING_ROOM_POSITION: [40, 40]
};

export let t = {
    ADD_WEAPON: 'ADD_WEAPON',
    ADD_XP: 'ADD_XP',
    CHANGE_ENTITY: 'CHANGE_ENTITY',
    CHANGE_PLAYER_POSITION: 'CHANGE_PLAYER_POSITION',
    CREATE_LEVEL: 'CREATE_LEVEL',
    MODIFY_HEALTH: 'MODIFY_HEALTH',
    NEW_MESSAGE: 'NEW_MESSAGE',
    RESTART: 'RESTART',
    SET_DUNGEON_LEVEL: 'SET_DUNGEON_LEVEL',
    TOGGLE_FOG_MODE: 'TOGGLE_FOG_MOD'
};
