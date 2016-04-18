/// <reference path="../Actor.ts" />

namespace game {
    
    export class ATooth extends Actor
    {
        /**
         * Since Position can only be integer we have to use separate,
         * property to store floating values.
         */
        FloatPosition = new core.Vector();
        
        constructor(x: number, y: number, 
            public Pixels: number[][],
            public Color = 'white')
        {
            super(x, y, Pixels[0].length, Pixels.length);
            core.Assert(Pixels.length > 0, "Pixels can't be null.");
            
            this.Position.Clone(this.FloatPosition);
            this.Size.Set(Pixels[0].length, Pixels.length);
            
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
        
        GetBottomRight(out = new core.Vector()): core.Vector
        {
            vec.Add(this.Position, this.Size, out);
            return out;
        }
        
        Blink(time = 1, rate = 0.05): void
        {
            const ticks = (time / rate) | 0;
            
            this.Timer.Repeat(rate, (n) => {
                if (n == ticks) {
                    this.Visible = true;
                }
                else {
                    this.Visible = ! this.Visible;
                }
            }, undefined, ticks)
        }
    }
    
    export namespace tooth {
        
        const TMP1 = new core.Vector();
        const TMP2 = new core.Vector();
        
        export function PixelPerfectCollision(a: ATooth, b: ATooth): boolean
        {
            // So the a is always the samller object.
            if (a.Size.x * a.Size.y > b.Size.x * b.Size.y)
            {
                let t = a;
                a = b;
                b = t;
            }
            
            let delta = TMP1;
            vec.Subtract(a.Position, b.Position, delta);
            
            for (let y = 0; y < a.Size.y; ++y)
            {
                if (b.Pixels[y + delta.y]) 
                {
                    for (let x = 0; x < a.Size.x; ++x)
                    {
                        let bPixel = b.Pixels[y + delta.y][x + delta.x];
                        
                        if (bPixel != undefined && a.Pixels[y][x] != 0 && bPixel != 0) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }
        
        export function Collide(a: ATooth, b: ATooth): boolean
        {
            let a_br = a.GetBottomRight(TMP1),
                a_tl = a.Position;
            
            let b_br = b.GetBottomRight(TMP2),
                b_tl = b.Position;
                
                
            if (a_tl.x > b_br.x || a_br.x < b_tl.x ||
                a_tl.y > b_br.y || a_br.y < b_tl.y) {
                return false;
            }
            else {
                return PixelPerfectCollision(a, b);
            }
        }
        
        export const player = [
            [0, 0, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 0],
            [1, 0, 1, 0]
        ];
        
        export function SpikeLike(width: number, height = Math.floor(width/2) + 1): number[][]
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
        
        export function CircleLike(width: number, height: number): number[][] 
        {
            core.Assert(width % 2 === 1, "only odd width");
            core.Assert(height > 0);
            
            let radious = width/2;//Math.floor(width/2);
            
            let tooth = [];
            for (let y = 0; y < height; ++y)
            {
                let row = [];
                for (let x = 0; x < width; ++x)
                {
                    let rx = x - radious, ry = y - radious;
                    row[x] = (Math.sqrt(rx*rx + ry*ry) < radious) ? 1 : 0;
                }
                
                tooth.push(row);
            }
            
            return tooth;
        }
        
        
        export function SlashLike(width: number, height: number, steep = 1, leftSide = true): number[][]
        {
            core.Assert(height > 0);
            
            let tooth = [];
            
            for (let y = 0; y < height; ++y)
            {
                let row = [];
                for (let x = 0; x < width; ++x)
                {
                    let ry = y * steep;
                    row[x] = (x < ry) ? 1 : 0;
                }
                
                if (!leftSide) {
                    row.reverse();
                }
                tooth.push(row);
            }
            
            return tooth;
        }
    }
    
    
}