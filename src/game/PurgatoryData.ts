namespace game.data {

    export namespace layer {
        
        const _ = 1; // ground tile
        const t = 2; // torch

        export const ground: number[][] = [
            [0, 0, 0, _],
            [_, _, _, _],
            [_, 0, 0, 0],
            [_, _, _, 0],
            [0, 0, 0, 0]
        ];
        
        export const static: number[][] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        export const actors: number[][] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, t, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        export const collision: number[][] = [
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 1],
            [1, 1, 0, 1]
        ];


    }
}