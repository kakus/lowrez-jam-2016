/// <reference path="../Actor.ts" />
/// <reference path="../Tooth.ts" />

namespace game {
    export class ATooth extends Actor
    {
        ToothImage: core.DisplayObject

        constructor(x: number, y: number, width: number, height: number)
        {
            super(x, y, width, height);
            this.ToothImage = new Tooth(0, 0, width, height);
        }

        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.ToothImage.Draw(ctx);
        }

        Start(): void
        {
            console.log("hello from a tooth actor.")
        }

        FillHitZone(hitZone: boolean[][]): boolean
        {
            var x = Math.floor(this.Position.x);
            var y = Math.floor(this.Position.y);
            var ret = false;

            for (var i: number = x; i < x + this.Size.x; i++) {
                if (i < 0 || i >= hitZone.length) continue;
                for (var j: number = y; j < y + this.Size.y; j++) {
                    if (j < 0 || j >= hitZone[i].length) continue;
                    if (hitZone[i][j]) {
                        ret = true;
                    }
                    hitZone[i][j] = true;
                }
            }
            return ret;
        }
    }
}
