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
    const a = tooth.spikeLike(15, 25);
    const A = tooth.spikeLike(15, 35);
    const b = tooth.spikeLike(19, 25);
    const B = tooth.spikeLike(19, 35);
    
    const N = tooth.spikeLike(19, 16);
    const n = tooth.spikeLike(25, 13);
    
    const o = tooth.circleLike(15, 16);
    const O = tooth.circleLike(15, 38);
    
    export const theeth = {
        
        // red demon
        Red: {
            upper: [a, _, b, _, N, _],
            lower: [_, B, _, A, N, A],
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
        }
        
    }
    
}