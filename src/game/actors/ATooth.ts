/// <reference path="../Actor.ts" />

namespace game {
    
    export class ATooth extends Actor
    {
        
        Color = 'white';
        
        /**
         * Since Position can only be integer we have to use separate,
         * property to store floating values.
         */
        FloatPosition = new core.Vector();
        
        constructor(x: number, y: number, 
            public Pixels: number[][])
        {
            super(x, y, Pixels[0].length, Pixels.length);
            core.Assert(Pixels.length > 0, "Pixels can't be null.");
            
            this.Position.Clone(this.FloatPosition);
            
            this.Timer.Repeat(0, () => this.FloatPosition.Clone(this.Position));
            // this.Anchor.Set(0.5, 0.5);
            this.Cache();
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            ctx.fillStyle = this.Color;
                
            for (let y = 0; y < this.Pixels.length; ++y)
            {
                let row = this.Pixels[y];
                for (let x = 0; x < row.length; ++x)
                {
                    if (row[x] !== 0) {
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
    }
    
    
    export namespace tooth {
        
        export const player = [
            [0, 0, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 0],
            [1, 0, 1, 0]
        ];
        
        export function gen(width: number, height = Math.floor(width/2) + 1): number[][]
        {
            core.Assert(width % 2 === 1, "only odd width");
            core.Assert(height > 0);
            core.Assert((height * 2 - 1) >= width);
    
            let normalizedHeight = Math.floor(width/2) + 1;           
            let tooth = [];
            
            for (let y = 0; y < normalizedHeight; ++y) {
                let row = [];
                for (let x = 0; x < width / 2 - 1; ++x) {
                    row[x] = ((width / 2 - 1) - x) < y ? 1 : 0;
                }

                row[Math.floor(width/2)] = 1;
                
                for (let x = Math.floor(width / 2) + 1, i = 0; x < width; ++x, ++i) {
                    row[x] = row[Math.floor(width / 2) - 1 - i];
                }
                
                tooth.push(row);
            }
            
            let finalTooth = [tooth[0]];
            
            for (let offset = 1;; ++offset)
            {
                for (let y = 1; y < tooth.length; ++y) 
                {
                    finalTooth.splice(y * offset, 0, tooth[y].slice(0));

                    if (finalTooth.length === height) {
                        return finalTooth;
                    }
                }
            }
        }
        
        export function gentop(width: number, height = Math.floor(width/2) + 1): number[][]
        {
            return gen(width, height);
        }
    }
    
    
}