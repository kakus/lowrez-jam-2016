/// <reference path="../Actor.ts" />

namespace game {
    export class ACombatant extends Actor
    {
        Sprite: gfx.Sprite;

        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, 24, 24);
            this.Sprite = sheet.GetSprite(assets.HERO_FACE_LEFT);
            this.Sprite.Scale.x *= -1;
            this.Sprite.Anchor.Set(0.5, 0.5);
        }

        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }

        Start(): void
        {
            console.log("hello from flappy hero.")
        }
    }
}
