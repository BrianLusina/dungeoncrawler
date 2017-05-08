'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// You may prefer to view the source at https://github.com/thepeted/dungeon-crawler

//REACT & REDUX LIBRARIES SET UP
var _React = React;
var Component = _React.Component;
var update = React.addons.update;
var _Redux = Redux;
var createStore = _Redux.createStore;
var applyMiddleware = _Redux.applyMiddleware;
var _ReactRedux = ReactRedux;
var Provider = _ReactRedux.Provider;
var _ReactRedux2 = ReactRedux;
var connect = _ReactRedux2.connect;
var _Redux2 = Redux;
var combineReducers = _Redux2.combineReducers;

var thunk = ReduxThunk.default;


// a thunk!
var _playerInput = function _playerInput(vector) {
    return function (dispatch, getState) {
        var _getState = getState();

        var grid = _getState.grid;
        var player = _getState.player;

        // cache some useful variables

        var _grid$playerPosition$ = grid.playerPosition.slice(0);

        var x = _grid$playerPosition$[0];
        var y = _grid$playerPosition$[1]; // get current location

        var vectorX = vector[0];
        var vectorY = vector[1]; // get direction modifier

        var newPosition = [vectorX + x, vectorY + y]; // define where we're moving to
        var newPlayer = grid.entities[y][x];
        var destination = grid.entities[y + vectorY][x + vectorX]; // whats in the cell we're heading to
        // store the actions in array to be past to batchActions
        var actions = [];

        // move the player unless destination is an enemy or a '0' cell
        if (destination.type && destination.type !== 'enemy' && destination.type !== 'boss') {
            actions.push(changeEntity({ type: 'floor' }, [x, y]), changeEntity(newPlayer, newPosition), changePlayerPosition(newPosition));
        }
        switch (destination.type) {
            case 'boss':
            case 'enemy':
            {
                var playerLevel = Math.floor(player.xp / 100);
                // player attacks enemy
                var enemyDamageTaken = Math.floor(player.weapon.damage * _.random(1, 1.3) * playerLevel);
                destination.health -= enemyDamageTaken;

                if (destination.health > 0) {
                    // enemy attacks player
                    var playerDamageTaken = Math.floor(_.random(4, 7) * destination.level);

                    actions.push(changeEntity(destination, newPosition), modifyHealth(player.health - playerDamageTaken), newMessage('FIGHT! You hurt the enemy with attack of [' + enemyDamageTaken + '].\tThe enemy hits back with an attack of [' + playerDamageTaken + '].  Enemy has [' + destination.health + '] health remaining.'));

                    if (player.health - playerDamageTaken <= 0) {
                        // player dies
                        dispatch(modifyHealth(0));
                        setTimeout(function () {
                            return dispatch(_setDungeonLevel('death'));
                        }, 250);
                        setTimeout(function () {
                            return dispatch(newMessage('YOU DIED'));
                        }, 1000);
                        setTimeout(function () {
                            return dispatch(newMessage('Everything goes dark..'));
                        }, 2000);
                        setTimeout(function () {
                            return dispatch(newMessage('You resolve to try harder next time'));
                        }, 4000);
                        setTimeout(function () {
                            return dispatch(newMessage('The grid resets itself....'));
                        }, 6000);
                        setTimeout(function () {
                            return dispatch(batchActions([restart(), _createLevel(1), _setDungeonLevel(1)]));
                        }, 8000);
                        return;
                    }
                }

                if (destination.health <= 0) {
                    // the fight is over and the player has won
                    // add XP and move the player
                    if (destination.type === 'boss') {
                        actions.push(addXP(10), changeEntity({ type: 'floor' }, [x, y]), changeEntity(newPlayer, newPosition), changePlayerPosition(newPosition), newMessage('VICTORY! Your attack of [' + enemyDamageTaken + '] is too powerful for the enemy, who dissolves before your very eyes.'));
                        setTimeout(function () {
                            return dispatch(_setDungeonLevel('victory'));
                        }, 250);
                        setTimeout(function () {
                            return dispatch(newMessage('YOU DEFATED THE BOSS!'));
                        }, 1000);
                        setTimeout(function () {
                            return dispatch(newMessage('The BOSS emits an almighty scream'));
                        }, 2000);
                        setTimeout(function () {
                            return dispatch(newMessage('You bask momentarily in your glory'));
                        }, 4000);
                        setTimeout(function () {
                            return dispatch(newMessage('The grid resets itself....'));
                        }, 6000);
                        setTimeout(function () {
                            return dispatch(batchActions([restart(), _createLevel(1), _setDungeonLevel(1)]));
                        }, 8000);
                    } else {
                        actions.push(addXP(10), changeEntity({ type: 'floor' }, [x, y]), changeEntity(newPlayer, newPosition), changePlayerPosition(newPosition), newMessage('VICTORY! Your attack of [' + enemyDamageTaken + '] is too powerful for the enemy, who dissolves before your very eyes.'));
                        setTimeout(function () {
                            return dispatch(newMessage('You gain 10XP and feel yourself growing stronger..'));
                        }, 2500);
                        if ((player.xp + 10) % 100 === 0) {
                            setTimeout(function () {
                                return dispatch(newMessage('LEVEL UP!'));
                            }, 5000);
                        }
                    }
                }
                break;
            }
            case 'exit':
                setTimeout(function () {
                    return dispatch(batchActions([_setDungeonLevel(grid.dungeonLevel + 1), _createLevel(grid.dungeonLevel + 1)]));
                }, 3000);
                actions.push(newMessage('The cells start to shift... you transit to zone ' + (grid.dungeonLevel + 1)));
                setTimeout(function () {
                    return dispatch(_setDungeonLevel('transit-' + (grid.dungeonLevel + 1)));
                }, 250);
                break;
            case 'potion':
                actions.push(modifyHealth(player.health + 30), newMessage('You drink a potion for [30] health'));
                break;
            case 'weapon':
                actions.push(addWeapon(destination), newMessage('You pick up a ' + destination.name));
                break;
            default:
                break;
        }
        dispatch(batchActions(actions));
    };
};

var openingMessages = function openingMessages() {
    return function (dispatch) {
        dispatch(newMessage('Welcome to The Grid...'));
        setTimeout(function () {
            dispatch(newMessage('You find yourself in a world filled with strange cells'));
        }, 3000);
        setTimeout(function () {
            dispatch(newMessage('\'Hmm... there must be a way out of here..\''));
        }, 6000);
    };
};

var _restartGame = function _restartGame() {
    return function (dispatch) {
        dispatch(newMessage('The grid resets itself....'));
        setTimeout(function () {
            return dispatch(batchActions([restart(), _createLevel(1), _setDungeonLevel(1)]));
        }, 1000);
    };
};

// COMPONENTS
var Cell = function Cell(_ref4) {
    var cell = _ref4.cell;
    var distance = _ref4.distance;
    var visible = _ref4.visible;
    var zone = _ref4.zone;

    var opacityValue = cell.opacity;
    if (visible && distance > 10) {
        opacityValue = 0;
    } else if (cell.type !== 0) {
        opacityValue = 1;
    }

    return React.createElement('div', {
        className: cell.type ? cell.type + ' cell' : 'back-' + zone + ' cell',
        style: { opacity: opacityValue }
    });
};

var Header = function Header(_ref5) {
    var level = _ref5.level;

    return React.createElement(
        'div',
        { className: 'strip' },
        React.createElement(
            'h1',
            null,
            React.createElement(
                'span',
                {
                    className: 'title title-' + level
                },
                'THE GRID'
            ),
            ' - Roguelike'
        )
    );
};

var Score = function Score(_ref6) {
    var iconClass = _ref6.iconClass;
    var title = _ref6.title;
    var value = _ref6.value;

    return React.createElement(
        'div',
        { className: 'score-item' },
        React.createElement('div', { className: 'icon cell ' + iconClass }),
        React.createElement(
            'span',
            { className: 'score-label' },
            title + ': ' + value
        )
    );
};

//CONTAINERS

var Game_ = function (_Component) {
    _inherits(Game_, _Component);

    function Game_() {
        _classCallCheck(this, Game_);

        var _this = _possibleConstructorReturn(this, _Component.call(this));

        _this.state = {
            viewportWidth: 0,
            viewportHeight: 0
        };

        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.handleResize = _this.handleResize.bind(_this);

        _this.VP_HEIGHT_OFFSET = 5; // in ems to match elements above this component
        _this.VP_MINIMUM_HEIGHT = 22; // in ems
        // set ratios for determining the viewport size
        _this.VP_WIDTH_RATIO = 30;
        _this.VP_HEIGHT_RATIO = 21;
        return _this;
    }

    Game_.prototype.componentWillMount = function componentWillMount() {
        // set the initial veiwport size
        var viewportWidth = window.innerWidth / this.VP_WIDTH_RATIO;
        var viewportHeight = Math.max(this.VP_MINIMUM_HEIGHT, window.innerHeight / this.VP_HEIGHT_RATIO - this.VP_HEIGHT_OFFSET);
        this.setState({ viewportWidth: viewportWidth, viewportHeight: viewportHeight });
        this.props.createLevel();
        this.props.setDungeonLevel(1);
    };

    Game_.prototype.componentDidMount = function componentDidMount() {
        window.addEventListener('keydown', _.throttle(this.handleKeyPress, 100));
        window.addEventListener('resize', _.debounce(this.handleResize, 500));
        this.props.triggerOpeningMessages();
    };

    Game_.prototype.componentWillUnmount = function componentWillUnmount() {
        window.removeEventListener('keydown', _.throttle(this.handleKeyPress, 100));
        window.removeEventListener('resize', _.debounce(this.handleResize, 500));
    };

    Game_.prototype.handleKeyPress = function handleKeyPress(e) {
        if (typeof this.props.grid.dungeonLevel === 'number') {
            switch (e.keyCode) {
                // north
                case 38:
                case 87:
                    this.props.playerInput([0, -1]);
                    break;
                // east
                case 39:
                case 68:
                    this.props.playerInput([1, 0]);
                    break;
                // south
                case 40:
                case 83:
                    this.props.playerInput([0, 1]);
                    break;
                // west
                case 37:
                case 65:
                    this.props.playerInput([-1, 0]);
                    break;
                default:
                    return;
            }
        }
    };

    Game_.prototype.handleResize = function handleResize(e) {
        var viewportWidth = e.target.innerWidth / this.VP_WIDTH_RATIO;
        var viewportHeight = Math.max(this.VP_MINIMUM_HEIGHT, e.target.innerHeight / this.VP_HEIGHT_RATIO - this.VP_HEIGHT_OFFSET);
        this.setState({ viewportWidth: viewportWidth, viewportHeight: viewportHeight });
    };

    Game_.prototype.render = function render() {
        var _this2 = this;

        // ensure the viewport height and width is always even
        var viewportHeight = this.state.viewportHeight - this.state.viewportHeight % 2;
        var viewportWidth = this.state.viewportWidth - this.state.viewportWidth % 2;

        var entities = this.props.grid.entities;
        var _props$grid$playerPos = this.props.grid.playerPosition;
        var playerX = _props$grid$playerPos[0];
        var playerY = _props$grid$playerPos[1];

        // define the limits of the cells to be displayed in the viewport

        var top = _.clamp(playerY - viewportHeight / 2, 0, entities.length - viewportHeight);
        var right = Math.max(playerX + viewportWidth / 2, viewportWidth);
        var bottom = Math.max(playerY + viewportHeight / 2, viewportHeight);
        var left = _.clamp(playerX - viewportWidth / 2, 0, entities[0].length - viewportWidth);

        // create a new array of entities which includes the distance from the player
        // used to enable fog mode
        var newEntities = entities.map(function (row, i) {
            return row.map(function (cell, j) {
                cell.distanceFromPlayer = Math.abs(playerY - i) + Math.abs(playerX - j);
                return cell;
            });
        });

        // create cell components from the entities that are in scope of the viewport
        var cells = newEntities.filter(function (row, i) {
            return i >= top && i < bottom;
        }).map(function (row, i) {
            return React.createElement(
                'div',
                { key: i, className: 'row' },
                row.filter(function (row, i) {
                    return i >= left && i < right;
                }).map(function (cell, j) {
                    return React.createElement(Cell, {
                        key: j,
                        cell: cell,
                        distance: cell.distanceFromPlayer,
                        zone: _this2.props.grid.dungeonLevel,
                        visible: _this2.props.fogMode
                    });
                })
            );
        });

        return React.createElement(
            'div',
            { className: 'grid-wrapper' },
            cells
        );
    };

    return Game_;
}(Component);

var mapStateToGameProps = function mapStateToGameProps(_ref7) {
    var ui = _ref7.ui;
    var grid = _ref7.grid;
    var player = _ref7.player;

    return { fogMode: ui.fogMode, grid: grid, player: player };
};

var mapDispatchToGameProps = function mapDispatchToGameProps(dispatch) {
    return {
        playerInput: function playerInput(vector) {
            return dispatch(_playerInput(vector));
        },
        createLevel: function createLevel() {
            return dispatch(_createLevel());
        },
        setDungeonLevel: function setDungeonLevel(level) {
            return dispatch(_setDungeonLevel(level));
        },
        triggerOpeningMessages: function triggerOpeningMessages() {
            return dispatch(openingMessages());
        }
    };
};

var Game = connect(mapStateToGameProps, mapDispatchToGameProps)(Game_);

var Tips = function (_Component2) {
    _inherits(Tips, _Component2);

    function Tips() {
        _classCallCheck(this, Tips);

        var _this3 = _possibleConstructorReturn(this, _Component2.call(this));

        _this3.state = {
            tips: ['Use WASD or arrow keys to move', 'Defeat the Boss in Zone 4 to win', 'Toggle Fog Mode with the \'F\' key', 'Restart the game with the \'R\' key', 'Defeat enemies to increase your XP', 'Level up to increase your damage', 'A new weapon might not be as good as your current one ', 'Be sure to gain as much XP as you can in each zone'],
            displayIdx: 0,
            intervalId: null
        };
        return _this3;
    }

    Tips.prototype.componentDidMount = function componentDidMount() {
        var _this4 = this;

        var counter = 1;
        var intervalId = setInterval(function () {
            if (counter === _this4.state.tips.length) {
                counter = 0;
            }
            _this4.setState({
                displayIdx: counter
            });
            counter++;
        }, 10000);

        this.setState({
            intervalId: intervalId
        });
    };

    Tips.prototype.componentWillUnmount = function componentWillUnmount() {
        clearInterval(this.state.intervalId);
    };

    Tips.prototype.render = function render() {
        return React.createElement(
            'div',
            { className: 'strip' },
            React.createElement(
                'p',
                null,
                ' Tip: ',
                this.state.tips[this.state.displayIdx]
            )
        );
    };

    return Tips;
}(Component);

var Messages_ = function Messages_(_ref8) {
    var messages = _ref8.messages;

    return React.createElement(
        'div',
        { className: 'panel messages' },
        React.createElement(
            'ul',
            null,
            messages.slice(-3).map(function (msg, i) {
                return React.createElement(
                    'li',
                    { key: i },
                    msg
                );
            })
        )
    );
};

var mapStateToMessagesProps = function mapStateToMessagesProps(_ref9) {
    var ui = _ref9.ui;

    return { messages: ui.messages };
};

var Messages = connect(mapStateToMessagesProps)(Messages_);

var PlayerSettings_ = function (_Component3) {
    _inherits(PlayerSettings_, _Component3);

    function PlayerSettings_() {
        _classCallCheck(this, PlayerSettings_);

        var _this5 = _possibleConstructorReturn(this, _Component3.call(this));

        _this5.handleKeyPress = _this5.handleKeyPress.bind(_this5);
        return _this5;
    }

    PlayerSettings_.prototype.componentDidMount = function componentDidMount() {
        window.addEventListener('keydown', this.handleKeyPress);
    };

    PlayerSettings_.prototype.componentWillUnmount = function componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyPress);
    };

    PlayerSettings_.prototype.render = function render() {
        var _props = this.props;
        var fogMode = _props.fogMode;
        var restartGame = _props.restartGame;
        var toggleFogMode = _props.toggleFogMode;

        return React.createElement(
            'div',
            { className: 'panel' },
            React.createElement(
                'div',
                { className: 'score-item' },
                React.createElement('input', {
                    onChange: toggleFogMode,
                    id: 'toggle',
                    type: 'checkbox',
                    checked: fogMode
                }),
                React.createElement(
                    'label',
                    { htmlFor: 'toggle' },
                    'Toggle fog mode'
                )
            ),
            React.createElement(
                'div',
                { className: 'score-item' },
                React.createElement('div', { onClick: restartGame, className: 'restart-btn' }),
                React.createElement(
                    'span',
                    { onClick: restartGame, className: 'setting-label' },
                    'Restart'
                )
            )
        );
    };

    PlayerSettings_.prototype.handleKeyPress = function handleKeyPress(e) {
        switch (e.keyCode) {
            // north
            case 70:
                this.props.toggleFogMode();
                break;
            case 82:
                this.props.restartGame();
                break;
            default:
                return;
        }
    };

    return PlayerSettings_;
}(Component);

var mapStateToPlayerSettingsProps = function mapStateToPlayerSettingsProps(_ref10) {
    var ui = _ref10.ui;

    return { fogMode: ui.fogMode };
};

var mapDispatchToPlayerSettingsProps = function mapDispatchToPlayerSettingsProps(dispatch) {
    return {
        toggleFogMode: function toggleFogMode() {
            return dispatch(_toggleFogMode());
        },
        restartGame: function restartGame() {
            return dispatch(_restartGame());
        }
    };
};

var PlayerSettings = connect(mapStateToPlayerSettingsProps, mapDispatchToPlayerSettingsProps)(PlayerSettings_);

var ScoreBoard = function ScoreBoard(_ref11) {
    var grid = _ref11.grid;
    var player = _ref11.player;

    return React.createElement(
        'div',
        { className: 'panel scoreboard' },
        React.createElement(Score, {
            iconClass: 'potion',
            title: 'Health',
            value: player.health
        }),
        React.createElement(Score, {
            iconClass: 'back-' + grid.dungeonLevel,
            title: 'Zone',
            value: grid.dungeonLevel
        }),
        React.createElement(Score, {
            iconClass: 'weapon',
            title: "Weapon",
            value: player.weapon.name + ' (DMG: ' + player.weapon.damage + ')'
        }),
        React.createElement(Score, {
            iconClass: 'player',
            title: 'Level',
            value: Math.floor(player.xp / 100)
        }),
        React.createElement(Score, {
            iconClass: 'triangle',
            title: 'XP to level up',
            value: 100 - player.xp % 100
        })
    );
};

var App_ = function App_(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(Header, { level: props.grid.dungeonLevel }),
        React.createElement(
            'div',
            { id: 'app' },
            React.createElement(Game, null),
            React.createElement(
                'div',
                { className: 'sidebar' },
                React.createElement(ScoreBoard, { player: props.player, grid: props.grid }),
                React.createElement(PlayerSettings, null),
                React.createElement(Messages, null)
            )
        ),
        React.createElement(Tips, null)
    );
};

var mapStateToAppProps = function mapStateToAppProps(_ref12) {
    var grid = _ref12.grid;
    var player = _ref12.player;

    return { grid: grid, player: player };
};

var App = connect(mapStateToAppProps)(App_);

//REDUCERS

var gridInitialState = {
    entities: [[]],
    dungeonLevel: 0,
    playerPosition: []
};

var grid = function grid() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? gridInitialState : arguments[0];
    var _ref13 = arguments[1];
    var type = _ref13.type;
    var payload = _ref13.payload;

    switch (type) {
        case t.CHANGE_ENTITY:
        {
            var _y, _update;

            var _payload$coords = payload.coords;
            var x = _payload$coords[0];
            var y = _payload$coords[1];

            var entities = update(state.entities, (_update = {}, _update[y] = (_y = {}, _y[x] = { $set: payload.entity }, _y), _update));
            return _extends({}, state, { entities: entities });
        }
        case t.CHANGE_PLAYER_POSITION:
            return _extends({}, state, { playerPosition: payload });
        case t.CREATE_LEVEL:
            return _extends({}, state, {
                playerPosition: payload.playerPosition,
                entities: payload.entities
            });
        case t.SET_DUNGEON_LEVEL:
            return _extends({}, state, { dungeonLevel: payload });
        default:
            return state;
    }
};

var playerInitialState = {
    health: 100,
    xp: 100,
    weapon: {
        name: 'Taser',
        damage: 10
    }
};

var player = function player() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? playerInitialState : arguments[0];
    var _ref14 = arguments[1];
    var type = _ref14.type;
    var payload = _ref14.payload;

    switch (type) {
        case t.ADD_WEAPON:
            return _extends({}, state, { weapon: payload });
        case t.ADD_XP:
            return _extends({}, state, { xp: state.xp + payload });
        case t.MODIFY_HEALTH:
            return _extends({}, state, { health: payload });
        case t.RESTART:
            return playerInitialState;
        default:
            return state;
    }
};

var messages = [];

var uIInitialState = {
    fogMode: true,
    messages: messages
};

var ui = function ui() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? uIInitialState : arguments[0];
    var _ref15 = arguments[1];
    var type = _ref15.type;
    var payload = _ref15.payload;

    switch (type) {
        case t.NEW_MESSAGE:
            return _extends({}, state, { messages: [].concat(state.messages, [payload]) });
        case t.TOGGLE_FOG_MODE:
            return _extends({}, state, { fogMode: !state.fogMode });
        case t.RESTART:
            return uIInitialState;
        default:
            return state;
    }
};

//COMBINE REDUCERS
var reducers = combineReducers({ grid: grid, player: player, ui: ui });

//WRAP WITH STORE AND RENDER

var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
ReactDOM.render(React.createElement(
    Provider,
    { store: createStoreWithMiddleware(enableBatching(reducers)) },
    React.createElement(App, null)
), document.querySelector('.container'));