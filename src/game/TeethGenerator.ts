/// <reference path="actors/ATooth.ts" />

namespace game {
    
    export class TeethGenertor
    {
        public LastX: number;
        
        constructor(
            private Upper: number[][][], 
            private Lower: number[][][],
            public Gap: number)
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
                    teeth.push(new ATooth(upperOffset.x + i * this.Gap, upperOffset.y, tooth));
                }
            })
            this.Lower.forEach((tooth, i) => {
                if (tooth) {
                    let t = new ATooth(lowerOffset.x + i * this.Gap, lowerOffset.y, tooth);
                    t.FloatPosition.y -= t.Size.y;
                    teeth.push(t);
                }
            })
            
            return teeth;
        }
    }
    
    const _ = undefined;
    const a = tooth.gen(15, 25);
    const A = tooth.gen(15, 35);
    const b = tooth.gen(19, 25);
    const B = tooth.gen(19, 35);
    
    const n = tooth.gen(19, 16);
    
    export const theeth = {
        demon1: {
            upper: [a, _, b, _, n, _],
            lower: [_, B, _, A, n, A],
            gap: 30
        }
    }
    
}