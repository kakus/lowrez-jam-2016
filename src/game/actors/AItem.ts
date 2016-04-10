/// <reference path="../Actor.ts" />

namespace game {
    
    export class AItem extends AnimatedActor
    {
        Shadow: gfx.Sprite;
        
        constructor(x: number, y: number, frames: number[], sheet: gfx.SpriteSheet,
            public Name: string
        ) {
            super(x, y, 24, 24); 
            this.Animator.AddAnimation('idle', frames, sheet);
            this.Animator.Play('idle');
            
            this.Shadow = sheet.GetSprite(assets.SMALL_SHADOW);
            
            this.Tween.New(this.Sprite.Position)
                .To({y: -5}, 1, core.easing.SinusoidalInOut)
                .Then()
                .To({y: 0}, 1, core.easing.SinusoidalInOut)
                .Then()
                .Loop()
                .Start();
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Shadow.Draw(ctx);
            this.Sprite.Draw(ctx);
        }
    }
    
    export class ALifeBonus extends AItem
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, [assets.HEART], sheet, 'Life');
        }
    }
    
    export class AAttackBonus extends AItem
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, [assets.ATTACK_BONUS], sheet, 'Attack');
        }
    }
}