/// <reference path="../Actor.ts" />

namespace game {
    
    export class ATorch extends AnimatedActor
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, sheet.CellSize.x, sheet.CellSize.y);
            let a = this.Animator.AddAnimation('idle', assets.TORCH_FRAMES, sheet);
            a.Loop = true;
            this.Animator.Play('idle');
        }

    }
}