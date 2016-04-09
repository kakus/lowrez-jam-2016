/// <reference path="../core/DisplayObject.ts" />

namespace game {
    export class Tooth extends core.DisplayObject
    {
		constructor(x: number, y: number, width: number, height: number)
        {
            super(x, y, width, height);
        }

        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            ctx.fillStyle = 'white';
            for (let x = 0; x < this.Size.x; ++x) {
                for (let y = 0; y < this.Size.y; ++y) {
                    ctx.fillRect(x, y, 1.1, 1.1);
                }
            }
        }
    }
}
