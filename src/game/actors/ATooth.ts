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
            console.log("Tooth drawing self");
            this.ToothImage.Draw(ctx);
        }

        Start(): void
        {
            console.log("hello from a tooth actor.")
        }
    }
}
