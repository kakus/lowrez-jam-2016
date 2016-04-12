/// <reference path="../Actor.ts" />

namespace game {
    export class ACombatant extends Actor
    {
        Sprite: gfx.Sprite;

        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, 8, 9);
            this.Sprite = sheet.GetSprite(assets.HERO_FACE_LEFT);
            this.Sprite.Scale.x *= -1;
            this.Size.Set(8, 9);
            this.Sprite.Position.Set(14.5, -5.5);
        }

        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }

        FillHitZone(hitZone: boolean[][]): boolean
        {
            var x = Math.floor(this.Position.x);
            var y = Math.floor(this.Position.y);
            var ret = false;

            for (var i: number = x; i < x + this.Size.x; i++) {
                if (i < 0 || i >= hitZone.length) {
                    continue;
                }
                for (var j: number = y; j < y + this.Size.y; j++) {
                    if (j < 0 || j >= hitZone[i].length) {
                        continue;
                    }
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
