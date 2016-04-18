/// <reference path="actors/ATooth.ts" />

namespace game {
    
    export class TeethGenertor
    {
        public LastX: number;
        
        constructor(
            private Upper: number[][][], 
            private Lower: number[][][],
            public Gap: number,
            public Color = 'white')
        {
            core.Assert(Upper.length === Lower.length);
            this.Lower = Lower.map(tooth => tooth ? tooth.slice(0) : tooth);
            this.Upper = Upper.map(tooth => tooth ? tooth.slice(0) : tooth);
            
            this.LastX = this.Gap * (this.Lower.length - 1);
            
            this.Upper.forEach(tooth => {
                if (tooth) {
                    return tooth.reverse();
                }
            });
        }
        
        SpawnAll(upperOffset: core.Vector, lowerOffset: core.Vector): ATooth[]
        {
            let teeth = [];
            
            this.Upper.forEach((tooth, i) => {
                if (tooth) {
                    teeth.push(new ATooth(upperOffset.x + i * this.Gap, upperOffset.y, tooth, this.Color));
                }
            })
            this.Lower.forEach((tooth, i) => {
                if (tooth) {
                    let t = new ATooth(lowerOffset.x + i * this.Gap, lowerOffset.y, tooth, this.Color);
                    t.FloatPosition.y -= t.Size.y;
                    teeth.push(t);
                }
            })
            
            return teeth;
        }
    }
    
    const _ = undefined;
    const a = tooth.SpikeLike(15, 25);
    const A = tooth.SpikeLike(15, 35);
    const i = tooth.SpikeLike(19, 25);
    const I = tooth.SpikeLike(19, 32);
    
    const N = tooth.SpikeLike(19, 16);
    const n = tooth.SpikeLike(25, 13);
    
    const o = tooth.CircleLike(15, 16);
    const O = tooth.CircleLike(15, 38);
    
    const d = tooth.SlashLike(15, 29, 0.25,false);
    const b = tooth.SlashLike(15, 29, 0.25);
    
    export const theeth = {
        
        // red demon
        Red: {
            upper: [a, _, i, _, N, _],
            lower: [_, I, _, A, N, A],
            gap: 30
        },
        
        //blue demon
        Blue: {
            upper: [n, n, n, N, _, n, n, n, N, n],
            lower: [n, n, n, N, n, n, n, n, N, _],
            gap: 25
        }, 
        
        // green demon
        Green: {
            upper: [_, O, _, o, _, O],
            lower: [O, _, O, o, O, _],
            gap: 20,
            color: '#ac3232'
        },
        
        Purple: {
            upper: [d, _, d, _, b, _],
            lower: [b, _, b, _, d, _],
            gap: 13
        },
        
        Dark: {
            upper: [d, _, d, _, a, _, a, N, N],
            lower: [b, _, b, _, _, A, _, N, N],
            gap: 15
        }
    }
    
}