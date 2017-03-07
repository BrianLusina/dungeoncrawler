import React, { Component } from 'react';
import '../styles/App.css';
import RogueLike from '../components/RogueLike';
import { tileType } from '../constants/game-constants';
import _ from 'lodash';
import configureStore from '../store/configureStore';

const store = configureStore();

class App extends Component {
    constructor(){
        super();

        this.createMap = this.createMap.bind(this);
    }

    render() {
        return (
            <RogueLike
                mapAlgo={this.createMap}
                getState={store.getState}
                store={store}
            />
        );
    }

  // MAP GENERATOR
  // Returns a matrix of the given dimensions with the number of rooms specified
  createMap() {
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
}

export default App;
