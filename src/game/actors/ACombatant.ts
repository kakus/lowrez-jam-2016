/// <reference path="../Actor.ts" />

namespace game {
    
    const FLAP_FORCE = 0.5;
    
    export class ACombatant extends Actor
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, sheet.GetSprite(assets.HERO_FACE_LEFT));
            this.Sprite = sheet.GetSprite(assets.HERO_FACE_LEFT);
            this.Sprite.Scale.x *= -1;
            this.Sprite.Anchor.Set(0.5, 0.5);
        }

        Start(): void
        {
            console.log("hello from flappy hero.")
        }
    }
}
