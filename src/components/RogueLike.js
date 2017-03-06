import React, {Component, PropTypes} from 'react';


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