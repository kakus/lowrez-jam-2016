/// <reference path="../Actor.ts" />

namespace game {
    
    export abstract class ADemon extends AnimatedActor 
    {

    }
    
    export class ARedDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, sheet.CellSize.x, sheet.CellSize.y * 2);
            sheet = new gfx.SpriteSheet(sheet.ImageId, new core.Vector(24, 48), new core.Vector(0, 24));
            this.Animator.AddAnimation('idle', assets.RED_DEMON_FRAMES, sheet).Loop = true;
            this.Animator.Play('idle');
            this.Sprite.Position.y -= 17;
        }
    } 
    
}

