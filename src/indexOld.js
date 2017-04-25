'use strict';

// This codebase uses react and redux and heavily utilizes certain ES2015
// features like spread operators, destructuring, const, let, and
// arrow functions.
// I'd highly recommend looking into them if any of these technologies are
// unfamiliar

// Game constants

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ATTACK_VARIANCE = 7;
var tileType = {
    WALL: 0,
    FLOOR: 1
};
var reverseLookup = ['WALL', 'FLOOR'];
var weaponTypes = [{
    entityName: 'brass knuckles',
    entityType: 'weapon',
    health: 0,
    attack: 7
}, {
    entityName: 'serrated dagger',
    entityType: 'weapon',
    health: 0,
    attack: 12
}, {
    entityName: 'katana',
    entityType: 'weapon',
    health: 0,
    attack: 16
}, {
    entityName: 'reaper\'s scythe',
    entityType: 'weapon',
    health: 0,
    attack: 22
}, {
    entityName: 'large trout',
    entityType: 'weapon',
    health: 0,
    attack: 30
}];
// enemy attacks and health are the dungeon level + 1 times these constants
var ENEMY = {
    health: 20,
    attack: 12,
    xp: 10
};
var PLAYER = {
    baseHealth: 100,
    health: 20,
    attack: 12,
    toNextLevel: 60
};

// Setup humane toast notifiers
var notifier = humane.create({ baseCls: 'humane-jackedup', timeout: 5000 });
notifier.error = notifier.spawn({ addnCls: 'humane-jackedup-error' });
notifier.success = notifier.spawn({ addnCls: 'humane-jackedup-success' });

/** REDUX code **/
// REDUX Bound Action Creators
function damage(entity, value) {
    store.dispatch({ type: 'DAMAGE', entityName: entity, value: value });
}
function heal(entity, health) {
    store.dispatch({ type: 'HEAL', entityName: entity, value: health });
}
function move(entity, vector) {
    store.dispatch({ type: 'MOVE', entityName: entity, vector: vector });
}
function setLocation(entity, location) {
    store.dispatch({ type: 'SET_LOCATION', entityName: entity, location: location });
}
function switchWeapon(weaponName, attack) {
    store.dispatch({ type: 'SWITCH_WEAPON', weapon: weaponName, attack: attack });
}
function addEntity(entityName, entityType, health, attack, location) {
    store.dispatch({ type: 'ADD_ENTITY', entityName: entityName, entityType: entityType,
        health: health, attack: attack, location: location });
}
function removeEntity(entityName) {
    store.dispatch({ type: 'REMOVE_ENTITY', entityName: entityName });
}
function resetBoard() {
    store.dispatch({ type: 'RESET_BOARD' });
}
function setMap(map) {
    store.dispatch({ type: 'SET_MAP', map: map });
}
function increaseLevel() {
    store.dispatch({ type: 'INCREASE_LEVEL' });
}
function resetLevel() {
    store.dispatch({ type: 'RESET_LEVEL' });
}
function setWindowSize() {
    store.dispatch({ type: 'SET_WINDOW_SIZE',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    });
}
function gainXp(xp) {
    store.dispatch({ type: 'GAIN_XP', xp: xp });
}
function levelUp(attack, health, xp) {
    store.dispatch({ type: 'LEVEL_UP',
        attack: attack,
        health: health,
        toNextLevel: xp
    });
}
function resetMap(map) {
    store.dispatch({ type: 'RESET_MAP', map: map });
}
function addBoss(attack, health, coords) {
    store.dispatch({ type: 'ADD_BOSS', attack: attack, health: health, location: coords });
}
function toggleDarkness() {
    store.dispatch({ type: 'TOGGLE_DARKNESS' });
}

// REDUX Initial State
var initialState = {
    // entities is an map of ids to object describing the entity
    entities: {
        'player': {
            entityType: 'player',
            x: 0,
            y: 0,
            health: 100,
            inventory: {},
            weapon: 'stick',
            attack: 7,
            level: 0,
            toNextLevel: 60
        }
    },
    // Link occupied space with entity id
    occupiedSpaces: {
        '0x0': 'player'
    },
    map: [],
    level: 0,
    windowHeight: 500,
    windowWidth: 500,
    darkness: true
};

// REDUX Reducer
function rogueLikeReducer() {
    var _extends2, _extends3, _extends4, _extends5, _extends6, _extends7, _occupiedSpaces, _extends8;

    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'DAMAGE':
            return _extends({}, state, {
                entities: _extends({}, state.entities, (_extends2 = {}, _extends2[action.entityName] = _extends({}, state.entities[action.entityName], {
                    health: state.entities[action.entityName].health - action.value
                }), _extends2))
            });
        case 'HEAL':
            return _extends({}, state, {
                entities: _extends({}, state.entities, (_extends3 = {}, _extends3[action.entityName] = _extends({}, state.entities[action.entityName], {
                    health: state.entities.player.health + action.value
                }), _extends3))
            });
        case 'SWITCH_WEAPON':
            return _extends({}, state, {
                entities: _extends({}, state.entities, {
                    'player': _extends({}, state.entities.player, {
                        weapon: action.weapon,
                        attack: state.entities.player.attack + action.attack
                    })
                })
            });
        case 'MOVE':
            return _extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(state.entities[action.entityName].x + action.vector.x + 'x' + (state.entities[action.entityName].y + action.vector.y), action.entityName).value(),
                entities: _extends({}, state.entities, (_extends4 = {}, _extends4[action.entityName] = _extends({}, state.entities[action.entityName], {
                    x: state.entities[action.entityName].x + action.vector.x,
                    y: state.entities[action.entityName].y + action.vector.y
                }), _extends4))
            });
        case 'SET_LOCATION':
            return _extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).set(action.location.x + 'x' + action.location.y, action.entityName).value(),
                entities: _extends({}, state.entities, (_extends5 = {}, _extends5[action.entityName] = _extends({}, state.entities[action.entityName], {
                    x: action.location.x,
                    y: action.location.y
                }), _extends5))
            });
        case 'ADD_ENTITY':
            return _extends({}, state, {
                occupiedSpaces: _extends({}, state.occupiedSpaces, (_extends6 = {}, _extends6[action.location.x + 'x' + action.location.y] = action.entityName, _extends6)),
                entities: _extends({}, state.entities, (_extends7 = {}, _extends7[action.entityName] = {
                    entityType: action.entityType,
                    health: action.health,
                    attack: action.attack,
                    x: action.location.x,
                    y: action.location.y
                }, _extends7))
            });
        case 'REMOVE_ENTITY':
            return _extends({}, state, {
                occupiedSpaces: _.chain(state.occupiedSpaces).omit(state.entities[action.entityName].x + 'x' + state.entities[action.entityName].y).value(),
                entities: _.chain(state.entities).omit(action.entityName).value()
            });
        case 'RESET_BOARD':
            return _extends({}, state, {
                entities: {
                    'player': state.entities.player
                },
                occupiedSpaces: (_occupiedSpaces = {}, _occupiedSpaces[state.entities.player.x + 'x' + state.entities.player.y] = 'player', _occupiedSpaces)
            });
        case 'SET_MAP':
            return _extends({}, state, {
                map: action.map
            });
        case 'INCREASE_LEVEL':
            return _extends({}, state, {
                level: state.level + 1
            });
        case 'RESET_LEVEL':
            return _extends({}, state, {
                level: 0
            });
        case 'SET_WINDOW_SIZE':
            return _extends({}, state, {
                windowHeight: action.windowHeight,
                windowWidth: action.windowWidth
            });
        case 'GAIN_XP':
            return _extends({}, state, {
                entities: _extends({}, state.entities, {
                    'player': _extends({}, state.entities.player, {
                        toNextLevel: state.entities.player.toNextLevel - action.xp
                    })
                })
            });
        case 'LEVEL_UP':
            return _extends({}, state, {
                entities: _extends({}, state.entities, {
                    'player': _extends({}, state.entities.player, {
                        attack: state.entities.player.attack + action.attack,
                        health: state.entities.player.health + action.health,
                        toNextLevel: action.toNextLevel,
                        level: state.entities.player.level + 1
                    })
                })
            });
        case 'RESET_MAP':
            return _extends({}, initialState, {
                map: action.map
            });
        case 'ADD_BOSS':
            return _extends({}, state, {
                occupiedSpaces: _extends({}, state.occupiedSpaces, (_extends8 = {}, _extends8[action.location.x + 'x' + action.location.y] = 'boss', _extends8[action.location.x + 1 + 'x' + action.location.y] = 'boss', _extends8[action.location.x + 'x' + (action.location.y + 1)] = 'boss', _extends8[action.location.x + 1 + 'x' + (action.location.y + 1)] = 'boss', _extends8)),
                entities: _extends({}, state.entities, {
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
            return _extends({}, state, {
                darkness: !state.darkness
            });
        default:
            return state;
    }
    return state;
}

// REDUX Store
var store = Redux.createStore(rogueLikeReducer);

// REACT UI
var RogueLike = React.createClass({
    displayName: 'RogueLike',

    propTypes: {
        // This is the algorithm for creating the map.
        // Must be a function that ouputs a matrix of 0 (wall) and 1 (floor) tiles
        mapAlgo: React.PropTypes.func.isRequired,
        getState: React.PropTypes.func.isRequired
    },
    getInitialState: function getInitialState() {
        return this._select(this.props.getState());
    },
    componentWillMount: function componentWillMount() {
        this._setupGame();
    },
    componentDidMount: function componentDidMount() {
        this._storeDataChanged();
        this.unsubscribe = store.subscribe(this._storeDataChanged);
        window.addEventListener('keydown', this._handleKeypress);
        window.addEventListener('resize', setWindowSize);
        // Setup touch controls
        var touchElement = document.getElementById('root');
        var hammertime = new Hammer(touchElement);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.on('swipe', this._handleSwipe);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
        window.removeEventListener('keydown', this._handleKeypress);
        window.removeEventListener('resize', setWindowSize);
    },
    _storeDataChanged: function _storeDataChanged() {
        var newState = this.props.getState();
        // Should player level up?
        if (newState.entities.player.toNextLevel <= 0) this._playerLeveledUp();
        this.setState(this._select(newState));
    },
    _select: function _select(state) {
        return {
            player: state.entities.player,
            entities: state.entities,
            map: state.map,
            occupiedSpaces: state.occupiedSpaces,
            level: state.level,
            windowHeight: state.windowHeight,
            windowWidth: state.windowWidth,
            darkness: state.darkness
        };
    },
    _playerLeveledUp: function _playerLeveledUp() {
        var currLevel = this.state.player.level + 1;
        levelUp(currLevel * PLAYER.attack, currLevel * PLAYER.health, (currLevel + 1) * PLAYER.toNextLevel);
    },
    _setupGame: function _setupGame() {
        resetMap(this.props.mapAlgo());
        this._fillMap();
        this._storeDataChanged();
        setWindowSize();
    },
    _getEmptyCoords: function _getEmptyCoords() {
        var _props$getState = this.props.getState();

        var map = _props$getState.map;
        var occupiedSpaces = _props$getState.occupiedSpaces;

        var coords = undefined,
            x = undefined,
            y = undefined;
        do {
            x = Math.floor(Math.random() * map.length);
            y = Math.floor(Math.random() * map[0].length);
            if (map[x][y] === tileType.FLOOR && !occupiedSpaces[x + 'x' + y]) {
                coords = { x: x, y: y };
            }
        } while (!coords);
        return coords;
    },
    _fillMap: function _fillMap() {
        // Place player
        setLocation('player', this._getEmptyCoords());
        // Place items
        var state = this.props.getState();
        var weapon = weaponTypes[state.level];
        addEntity(weapon.entityName, 'weapon', weapon.health, weapon.attack, this._getEmptyCoords());
        // Place heath and enemies
        var NUM_THINGS = 5,
            HEALTH_VAL = 20,
            LEVEL_MULT = state.level + 1;
        for (var i = 0; i < NUM_THINGS; i++) {
            addEntity('health' + i, 'health', HEALTH_VAL, 0, this._getEmptyCoords());
            addEntity('enemy' + i, 'enemy', LEVEL_MULT * ENEMY.health, LEVEL_MULT * ENEMY.attack, this._getEmptyCoords());
        }
        // Place exit if not last level
        if (state.level < 4) addEntity('exit', 'exit', 0, 0, this._getEmptyCoords());
        // Place boss on last (fifth) level
        if (state.level === 4) addBoss(125, 500, this._getEmptyCoords());
    },
    _addVector: function _addVector(coords, vector) {
        return { x: coords.x + vector.x, y: coords.y + vector.y };
    },
    _toggleDarkness: function _toggleDarkness() {
        toggleDarkness();
    },
    _handleKeypress: function _handleKeypress(e) {
        var vector = '';
        switch (e.keyCode) {
            case 37:
                vector = { x: -1, y: 0 };
                break;
            case 38:
                vector = { x: 0, y: -1 };
                break;
            case 39:
                vector = { x: 1, y: 0 };
                break;
            case 40:
                vector = { x: 0, y: 1 };
                break;
            default:
                vector = '';
                break;
        }
        if (vector) {
            e.preventDefault();
            this._handleMove(vector);
        }
    },
    _handleSwipe: function _handleSwipe(e) {
        var vector = undefined;
        var overallVelocity = e.overallVelocity;
        var angle = e.angle;

        if (Math.abs(overallVelocity) > .75) {
            // swipe up
            if (angle > -100 && angle < -80) {
                vector = { x: 0, y: -1 };
            }
            // swipe right
            if (angle > -10 && angle < 10) {
                vector = { x: 1, y: 0 };
            }
            // swipe down
            if (angle > 80 && angle < 100) {
                vector = { x: 0, y: 1 };
            }
            // swipe left
            if (Math.abs(angle) > 170) {
                vector = { x: -1, y: 0 };
            }
        }
        if (vector) {
            e.preventDefault();
            this._handleMove(vector);
        }
    },
    _handleMove: function _handleMove(vector) {
        var state = this.props.getState();
        var player = state.entities.player;
        var map = state.map;
        var newCoords = this._addVector({ x: player.x, y: player.y }, vector);
        if (newCoords.x > 0 && newCoords.y > 0 && newCoords.x < map.length && newCoords.y < map[0].length && map[newCoords.x][newCoords.y] !== tileType.WALL) {
            // Tile is not a wall, determine if it contains an entity
            var entityName = state.occupiedSpaces[newCoords.x + 'x' + newCoords.y];
            // move and return if empty
            if (!entityName) {
                move('player', vector);
                return;
            }
            // handle encounters with entities
            var entity = state.entities[entityName];
            switch (entity.entityType) {
                case 'weapon':
                    switchWeapon(entityName, entity.attack);
                    move('player', vector);
                    break;
                case 'boss':
                case 'enemy':
                    var playerAttack = Math.floor(Math.random() * ATTACK_VARIANCE + player.attack - ATTACK_VARIANCE);
                    var enemyAttack = Math.floor(Math.random() * ATTACK_VARIANCE + entity.attack - ATTACK_VARIANCE);
                    // Will hit kill enemy?
                    if (entity.health > playerAttack) {
                        // Will rebound hit kill player?
                        if (enemyAttack > player.health) {
                            notifier.error('You died. Better luck next time!');
                            this._setupGame();
                            return;
                        }
                        damage(entityName, playerAttack);
                        damage('player', enemyAttack);
                    } else {
                        // Is the enemy a boss?
                        if (entityName === 'boss') {
                            notifier.success('A winner is you!');
                            this._setupGame();
                            return;
                        }
                        gainXp((state.level + 1) * ENEMY.xp);
                        removeEntity(entityName);
                    }
                    break;
                case 'health':
                    heal('player', entity.health);
                    removeEntity(entityName);
                    move('player', vector);
                    break;
                case 'exit':
                    resetBoard();
                    setMap(this.props.mapAlgo());
                    setLocation('player', this._getEmptyCoords());
                    increaseLevel();
                    this._fillMap();
                    break;
                default:
                    break;
            }
        }
    },

    render: function render() {
        var _state = this.state;
        var map = _state.map;
        var entities = _state.entities;
        var occupiedSpaces = _state.occupiedSpaces;
        var level = _state.level;
        var player = _state.player;
        var windowHeight = _state.windowHeight;
        var windowWidth = _state.windowWidth;
        var winner = _state.winner;
        var darkness = _state.darkness;
        var SIGHT = 7;
        // This should match the css height and width in pixels
        var tileSize = document.getElementsByClassName('tile').item(0) ? document.getElementsByClassName('tile').item(0).clientHeight : 10;

        // Get start coords for current viewport
        var numCols = Math.floor(windowWidth / tileSize - 5),
            numRows = Math.floor(windowHeight / tileSize - 17);
        var startX = Math.floor(player.x - numCols / 2);
        var startY = Math.floor(player.y - numRows / 2);
        // Make sure start isn't less than 0
        if (startX < 0) startX = 0;
        if (startY < 0) startY = 0;
        // Set end coords
        var endX = startX + numCols;
        var endY = startY + numRows;
        // Final validation of start and end coords
        if (endX > map.length) {
            startX = numCols > map.length ? 0 : startX - (endX - map.length);
            endX = map.length;
        }
        if (endY > map[0].length) {
            startY = numRows > map[0].length ? 0 : startY - (endY - map[0].length);
            endY = map[0].length;
        }

        // Create visible gameboard
        var rows = [],
            tileClass = undefined,
            row = undefined;
        for (var y = startY; y < endY; y++) {
            row = [];
            for (var x = startX; x < endX; x++) {
                var entity = occupiedSpaces[x + 'x' + y];
                if (!entity) {
                    tileClass = reverseLookup[map[x][y]];
                } else {
                    tileClass = entities[entity].entityType;
                }
                if (darkness) {
                    // check if it should be dark
                    var xDiff = player.x - x,
                        yDiff = player.y - y;
                    if (Math.abs(xDiff) > SIGHT || Math.abs(yDiff) > SIGHT) {
                        tileClass += ' dark';
                    } else if (Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) >= SIGHT) {
                        tileClass += ' dark';
                    }
                }
                row.push(React.createElement('span', { className: 'tile ' + tileClass, key: x + 'x' + y }, ' '));
            }
            rows.push(React.createElement('div', { className: 'boardRow', key: 'row' + y }, row));
        }

        return React.createElement(
            'div',
            { id: 'game' },
            React.createElement(
                'ul',
                { id: 'ui' },
                React.createElement(
                    'li',
                    { id: 'health' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Health:'
                    ),
                    ' ',
                    player.health
                ),
                React.createElement(
                    'li',
                    { id: 'weapon' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Weapon:'
                    ),
                    ' ',
                    player.weapon
                ),
                React.createElement(
                    'li',
                    { id: 'attack' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Attack:'
                    ),
                    ' ',
                    player.attack
                ),
                React.createElement(
                    'li',
                    { id: 'playerLevel' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Level:'
                    ),
                    ' ',
                    player.level
                ),
                React.createElement(
                    'li',
                    { id: 'xp' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Next Level:'
                    ),
                    ' ',
                    player.toNextLevel,
                    ' XP'
                ),
                React.createElement(
                    'li',
                    { id: 'level' },
                    React.createElement(
                        'span',
                        { className: 'label' },
                        'Dungeon:'
                    ),
                    ' ',
                    level
                )
            ),
            React.createElement(
                'div',
                { className: 'buttons' },
                React.createElement(ToggleButton, {
                    label: 'Toggle Darkness',
                    id: 'toggleDarkness',
                    handleClick: this._toggleDarkness })
            ),
            React.createElement(
                'div',
                { id: 'board' },
                rows
            )
        );
    }
});

var ToggleButton = React.createClass({
    displayName: 'ToggleButton',

    propTypes: {
        label: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired
    },
    render: function render() {
        return React.createElement(
            'button',
            {
                className: 'toggleButton',
                id: this.props.id,
                onClick: this.props.handleClick },
            this.props.label
        );
    }
});

// Render React to page
var targetEl = document.getElementById('root');

React.render(React.createElement(RogueLike, { mapAlgo: createMap, getState: store.getState }), targetEl);

// MAP GENERATOR
// Returns a matrix of the given dimensions with the number of rooms specified
function createMap() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
    var maxRoomSize = arguments.length <= 2 || arguments[2] === undefined ? 20 : arguments[2];
    var minRoomSize = arguments.length <= 3 || arguments[3] === undefined ? 6 : arguments[3];
    var maxHallLength = arguments.length <= 4 || arguments[4] === undefined ? 5 : arguments[4];
    var numRooms = arguments.length <= 5 || arguments[5] === undefined ? 20 : arguments[5];
    var roomChance = arguments.length <= 6 || arguments[6] === undefined ? .75 : arguments[6];

    // init grid of walls
    var map = _.fill(Array(width), 0);
    var blankCol = _.fill(Array(height), tileType.WALL);
    map = map.map(function () {
        return blankCol.slice();
    });

    // create first room
    fillRect(map, { x: 45, y: 45 }, { x: 10, y: 10 }, tileType.FLOOR);

    // create rooms
    for (var i = 0; i < numRooms; i++) {
        placeRoom(map);
    }

    return map;

    // map is a grid, startCoord is an object like {x: 13, y: 15}
    // size is an object like {x: 5, y: 7}, fillVal is an int
    function fillRect(map, startCoord, size, fillVal) {
        for (var i = startCoord.x; i < startCoord.x + size.x; i++) {
            _.fill(map[i], fillVal, startCoord.y, size.y + startCoord.y);
        }
        return map;
    }

    // Will keep trying to place random rooms in random places until it succeeds.
    function placeRoom(map) {
        var wall = undefined,
            width = undefined,
            height = undefined,
            isRoom = undefined,
            startX = undefined,
            startY = undefined,
            coords = undefined,
            numClear = undefined;
        while (true) {
            // Create random location and room
            // TODO - Choose wall or hall
            numClear = 0;
            wall = findWall(map);
            coords = wall.coords;
            width = Math.floor(Math.random() * (maxRoomSize - minRoomSize) + minRoomSize);
            height = Math.floor(Math.random() * (maxRoomSize - minRoomSize) + minRoomSize);
            switch (wall.openDir) {
                case 'right':
                    startX = coords.x - width;
                    startY = coords.y - Math.floor(height / 2) + getDoorOffset(height);
                    break;
                case 'left':
                    startX = coords.x + 1;
                    startY = coords.y - Math.floor(height / 2) + getDoorOffset(height);
                    break;
                case 'top':
                    startX = coords.x - Math.floor(width / 2) + getDoorOffset(width);
                    startY = coords.y + 1;
                    break;
                case 'bottom':
                    startX = coords.x - Math.floor(width / 2) + getDoorOffset(width);
                    startY = coords.y - height;
                    break;
                default:
                    break;
            }
            // Exit if room would be outside matrix
            if (startX < 0 || startY < 0 || startX + width >= map.length || startY + height >= map[0].length) {
                continue;
            }
            // check if all spaces are clear
            for (var i = startX; i < startX + width; i++) {
                if (map[i].slice(startY, startY + height).every(function (tile) {
                        return tile === tileType.WALL;
                    })) {
                    numClear++;
                }
            }
            if (numClear === width) {
                fillRect(map, { x: startX, y: startY }, { x: width, y: height }, tileType.FLOOR);
                map[coords.x][coords.y] = 1;
                return map;
            }
        }

        function getDoorOffset(length) {
            return Math.floor(Math.random() * length - Math.floor((length - 1) / 2));
        }
    }

    // Loops until it finds a wall tile
    function findWall(map) {
        var coords = { x: 0, y: 0 };
        var wallDir = false;
        do {
            coords.x = Math.floor(Math.random() * map.length);
            coords.y = Math.floor(Math.random() * map[0].length);
            wallDir = isWall(map, coords);
        } while (!wallDir);

        return { coords: coords, openDir: wallDir };
    }

    // Takes a map matrix and a coordinate object
    // Returns false if not a wall, otherwise the direction of the open tile
    function isWall(map, coords) {
        // return false if tile isn't wall
        if (map[coords.x][coords.y] !== tileType.WALL) {
            return false;
        }
        // left is open
        if (typeof map[coords.x - 1] !== 'undefined' && map[coords.x - 1][coords.y] === tileType.FLOOR) {
            return 'left';
        }
        // right is open
        if (typeof map[coords.x + 1] !== 'undefined' && map[coords.x + 1][coords.y] === tileType.FLOOR) {
            return 'right';
        }
        // top is open
        if (map[coords.x][coords.y - 1] === tileType.FLOOR) {
            return 'top';
        }
        // bottom is open
        if (map[coords.x][coords.y + 1] === tileType.FLOOR) {
            return 'bottom';
        }

        return false;
    }
}