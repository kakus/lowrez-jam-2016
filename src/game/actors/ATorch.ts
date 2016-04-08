/// <reference path="../Actor.ts" />

namespace game {
    
    export class ATorch extends AnimatedActor
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, sheet.CellSize.x, sheet.CellSize.y);
            let a = this.Animator.AddAnimation('idle', [41, 42, 1, 1, 1], sheet);
            a.Loop = true;
            // a.Duration = 2;
            this.Animator.Play('idle');
        }
        
        Start(): void
        {
        }
    }
}