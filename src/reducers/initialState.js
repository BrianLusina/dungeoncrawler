/**
 * Created by lusinabrian on 06/03/17.
 */
// REDUX Initial State
export default initialState = {
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
