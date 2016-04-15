namespace game.data {

    export namespace layer {
        
        const _ = 1; // ground tile
        const t = 2; // torch
        const h = 3; // hero
        
        const r = 4; // red demon or item, blue demon or item
        const g = 5; // green demon or item, purple demon or item 
        const f = 6; // final demon
        const l = 7; // life
        
        const x = 11; // tiles that are unlocked when you kill all demons
        const o = 12; // hidden tiles
        
        export const ground: number[][] = [
            [0, 0, 0, 0, x, 0, 0, 0, 0],
            [0, 0, 0, 0, x, 0, 0, 0, 0],
            [0, 0, 0, 0, x, 0, 0, 0, 0],
            [_, 0, _, 0, x, 0, _, 0, _],
            [_, 0, _, 0, x, 0, _, 0, _],
            [_, _, _, _, _, _, _, _, _],
            [0, 0, 0, 0, _, 0, 0, 0, 0],
            [_, 0, _, 0, _, 0, _, 0, _],
            [_, 0, _, 0, _, 0, _, 0, _],
            [_, _, _, _, _, _, _, _, _],
            [0, 0, 0, _, 0, 0, o, o, _],
            [0, 0, 0, _, _, 0, o, 0, 0],
            [0, 0, 0, 0, _, o, o, 0, 0],
            [0, 0, 0, 0, _, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        
        // export const static: number[][] = [
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0]
        // ];
        
        export const actors: number[][] = [
            [0, 0, 0, t, f, t, 0, 0, 0],
            [0, 0, 0, t, 0, t, 0, 0, 0],
            [0, 0, 0, t, 0, t, 0, 0, 0],
            [g, 0, g, t, 0, t, g, 0, g],
            [0, 0, 0, t, 0, t, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [r, 0, r, 0, 0, 0, r, 0, r],
            [0, t, 0, 0, 0, 0, 0, t, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, t, 0, 0, 0, l],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, h, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        
        // export const collision: number[][] = ground.map(row => row.map(t => t === 0 ? 1 : 0));
    }
}