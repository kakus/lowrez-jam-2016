namespace game.data {

    export namespace layer {
        
        const t = 1; // ground tile

        export const ground: number[][] = [
            [0, 0, 0, t],
            [t, t, t, t],
            [t, 0, 0, 0],
            [t, t, t, 0],
            [0, 0, 0, 0]
        ];
        
        export const static: number[][] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        export const actors: number[][] = [];
        
        export const collision: number[][] = [
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 1],
            [1, 1, 0, 1]
        ];


    }
}