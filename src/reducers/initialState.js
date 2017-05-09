/**
 * Initial state of application
 * */
export default {
    ui:{
        fogMode: true,
        messages:[]
    },
    player:{
        health: 100,
        xp: 100,
        weapon:{
            name: "sword",
            damage: 15
        },
    },
    grid:{
        entities:[[]],
        dungeonLevel:0,
        playerPosition:[],
    }
};
