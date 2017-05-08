/**
 * @author lusinabrian on 08/05/17.
 * @notes:
 */

export default function createMap() {
    // HELPER FUNCTIONS FOR CREATING THE MAP
    var isValidRoomPlacement = function isValidRoomPlacement(grid, _ref) {
        var x = _ref.x;
        var y = _ref.y;
        var _ref$width = _ref.width;
        var width = _ref$width === undefined ? 1 : _ref$width;
        var _ref$height = _ref.height;
        var height = _ref$height === undefined ? 1 : _ref$height;

        // check if on the edge of or outside of the grid
        if (y < 1 || y + height > grid.length - 1) {
            return false;
        }
        if (x < 1 || x + width > grid[0].length - 1) {
            return false;
        }

        // check if on or adjacent to existing room
        for (var i = y - 1; i < y + height + 1; i++) {
            for (var j = x - 1; j < x + width + 1; j++) {
                if (grid[i][j].type === 'floor') {
                    return false;
                }
            }
        }
        // all grid cells are clear
        return true;
    };

    var placeCells = function placeCells(grid, _ref2) {
        var x = _ref2.x;
        var y = _ref2.y;
        var _ref2$width = _ref2.width;
        var width = _ref2$width === undefined ? 1 : _ref2$width;
        var _ref2$height = _ref2.height;
        var height = _ref2$height === undefined ? 1 : _ref2$height;
        var type = arguments.length <= 2 || arguments[2] === undefined ? 'floor' : arguments[2];

        for (var i = y; i < y + height; i++) {
            for (var j = x; j < x + width; j++) {
                grid[i][j] = { type: type };
            }
        }
        return grid;
    };

    var createRoomsFromSeed = function createRoomsFromSeed(grid, _ref3) {
        var x = _ref3.x;
        var y = _ref3.y;
        var width = _ref3.width;
        var height = _ref3.height;
        var range = arguments.length <= 2 || arguments[2] === undefined ? c.ROOM_SIZE_RANGE : arguments[2];

        // range for generating the random room heights and widths
        var min = range[0];
        var max = range[1];

        // generate room values for each edge of the seed room

        var roomValues = [];

        var north = { height: _.random(min, max), width: _.random(min, max) };
        north.x = _.random(x, x + width - 1);
        north.y = y - north.height - 1;
        north.doorx = _.random(north.x, Math.min(north.x + north.width, x + width) - 1);
        north.doory = y - 1;
        roomValues.push(north);

        var east = { height: _.random(min, max), width: _.random(min, max) };
        east.x = x + width + 1;
        east.y = _.random(y, height + y - 1);
        east.doorx = east.x - 1;
        east.doory = _.random(east.y, Math.min(east.y + east.height, y + height) - 1);
        roomValues.push(east);

        var south = { height: _.random(min, max), width: _.random(min, max) };
        south.x = _.random(x, width + x - 1);
        south.y = y + height + 1;
        south.doorx = _.random(south.x, Math.min(south.x + south.width, x + width) - 1);
        south.doory = y + height;
        roomValues.push(south);

        var west = { height: _.random(min, max), width: _.random(min, max) };
        west.x = x - west.width - 1;
        west.y = _.random(y, height + y - 1);
        west.doorx = x - 1;
        west.doory = _.random(west.y, Math.min(west.y + west.height, y + height) - 1);
        roomValues.push(west);

        var placedRooms = [];
        roomValues.forEach(function (room) {
            if (isValidRoomPlacement(grid, room)) {
                // place room
                grid = placeCells(grid, room);
                // place door
                grid = placeCells(grid, { x: room.doorx, y: room.doory }, 'door');
                // need placed room values for the next seeds
                placedRooms.push(room);
            }
        });
        return { grid: grid, placedRooms: placedRooms };
    };

    // BUILD OUT THE MAP

    // 1. make a grid of 'empty' cells, with a random opacity value (for styling)
    var grid = [];
    for (var i = 0; i < c.GRID_HEIGHT; i++) {
        grid.push([]);
        for (var j = 0; j < c.GRID_WIDTH; j++) {
            grid[i].push({ type: 0, opacity: _.random(0.3, 0.8) });
        }
    }

    // 2. random values for the first room
    var _c$ROOM_SIZE_RANGE = c.ROOM_SIZE_RANGE;
    var min = _c$ROOM_SIZE_RANGE[0];
    var max = _c$ROOM_SIZE_RANGE[1];

    var firstRoom = {
        x: _.random(1, c.GRID_WIDTH - max - 15),
        y: _.random(1, c.GRID_HEIGHT - max - 15),
        height: _.random(min, max),
        width: _.random(min, max)
    };

    // 3. place the first room on to grid
    grid = placeCells(grid, firstRoom);

    // 4. using the first room as a seed, recursivley add rooms to the grid
    var growMap = function growMap(grid, seedRooms) {
        var counter = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
        var maxRooms = arguments.length <= 3 || arguments[3] === undefined ? c.MAX_ROOMS : arguments[3];

        if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
            return grid;
        }

        grid = createRoomsFromSeed(grid, seedRooms.pop());
        seedRooms.push.apply(seedRooms, grid.placedRooms);
        counter += grid.placedRooms.length;
        return growMap(grid.grid, seedRooms, counter);
    };
    return growMap(grid, [firstRoom]);
};
