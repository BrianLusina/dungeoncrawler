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

// Setup humane toast notifiers
// let notifier = humane.create({ baseCls: 'humane-jackedup', timeout: 5000 });
// notifier.error = notifier.spawn({ addnCls: 'humane-jackedup-error' });
// notifier.success = notifier.spawn({ addnCls: 'humane-jackedup-success' });
