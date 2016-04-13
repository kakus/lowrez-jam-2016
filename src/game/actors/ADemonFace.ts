/// <reference path="../Actor.ts" />

namespace game {
    
    export class ADemonFace extends AnimatedActor
    {
        constructor(x: number, y: number, frames: number[], sheet: gfx.SpriteSheet)
        {
            super(x, y, 64, 64);
            core.Assert(frames.length == 2);
            
            let sprites = frames.map(frame => sheet.GetSprite(frame));
            sprites.forEach(sprite => {
                sprite.SourceRect.Size.Set(64, 64);
                sprite.Size.Set(64, 64);
            });
            
            this.Animator.AddAnimation('idle', [0], sprites);
            this.Animator.AddAnimation('hurt', [1], sprites);
            
            this.Animator.Play('idle');
        }
        
        Hurt(): void
        {
            this.Animator.Play('hurt');
            this.Timer.Delay(0.3, () => this.Animator.Play('idle'));
            // this.Timer.Repeat(0.1, () => this.Visible = !this.Visible, undefined, 2)
        }
    }
}