/// <reference path="../Actor.ts" />

namespace game {
    
    export abstract class ADemon extends AnimatedActor 
    {
        constructor(x: number, y: number, frames: number[], sheet: gfx.SpriteSheet,
            public Name: string
        ) {
            super(x, y, 24, 24 * 2);
            sheet = new gfx.SpriteSheet(sheet.ImageId, new core.Vector(24, 48), new core.Vector(0, 24));
            
            this.Animator.AddAnimation('idle', frames, sheet).Loop = true;
            this.Animator.Play('idle');
            this.Sprite.Position.y -= 17;
            
            console.log("Spawning " + Name);
        }
    }
    
    export class ARedDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.RED_DEMON_FRAMES, sheet, "Red");
        }
    }
     
    export class ABlueDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.BLUE_DEMON_FRAMES, sheet, "Blue");
            this.Animator.Animations['idle'].Duration = 2;
        }
    }
    
    export class AGreenDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.GREEN_DEMON_FRAMES, sheet, "Green");
        }
    }
    
    export class APurpleDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.PURPLE_DEMON_FRAMES, sheet, "Purple");
        }
    }
    
    export class ADarkDemon extends ADemon
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.DARK_DEMON_FRAMES, sheet, "Dark");
        }
    }
}

