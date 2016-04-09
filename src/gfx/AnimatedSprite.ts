/// <reference path="Animator.ts" />

namespace gfx {
    
    export class AnimatedSprite extends core.DisplayObject
    {
        constructor(x: number, y: number, width: number, height: number,
            public Animator = new gfx.Animator()
        ) {
            super(x, y, width, height);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Animator.GetFrame().Draw(ctx);
        }
        
        Update(timeDelta: number): void
        {
            this.Animator.Update(timeDelta);
        }
    }
}