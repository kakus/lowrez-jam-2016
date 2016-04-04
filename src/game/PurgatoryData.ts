namespace game.data {

    export namespace layer {

        export const ground: number[][] = [
            [0, 0, 0, 3],
            [3, 3, 3, 3],
            [3, 0, 0, 0],
            [3, 3, 3, 0]
        ];
        export const static: number[][] = [
            [0, 0, 0, 136],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        export const actors: number[][] = [];
        
        export const collision: number[][] = [
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 1]
        ];


    }
}