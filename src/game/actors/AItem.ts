/// <reference path="../Actor.ts" />

namespace game {
    
    export abstract class AItem extends AnimatedActor
    {
        Shadow: gfx.Sprite;
        
        constructor(x: number, y: number, frames: number[], sheet: gfx.SpriteSheet,
            public Name: string
        ) {
            super(x, y, 24, 24); 
            this.Animator.AddAnimation('idle', frames, sheet).Loop = true;
            this.Animator.Play('idle');
            
            this.Shadow = sheet.GetSprite(assets.SMALL_SHADOW);
            
            this.Tween.New(this.Sprite.Position)
                .To({y: -4}, 1, core.easing.SinusoidalInOut)
                .Then()
                .To({y: 0.5}, 1, core.easing.SinusoidalInOut)
                .Loop()
                .Start();
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Shadow.Draw(ctx);
            this.Sprite.Draw(ctx);
        }
        
        ShowInGlory(): core.Tween
        {
            this.Tween.StopAll(false);
            return this.Tween.New(this.Sprite.Position)
                .To({y: -18}, 1, core.easing.CubicOut)
                .Start();
        }
        
        abstract Execute(): void;
        
        /**
         * Return description of item, top line and bottom line.
         */
        abstract GetDescription(): [string, string];
    }
    
    export class ALifeBonus extends AItem
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.HEART, sheet, 'Life');
        }
        
        Execute(): void
        {
            if (context.LifesLeft < 4) {
                context.LifesLeft += 1;
            }
        }
        
        GetDescription(): [string, string]
        {
            return ["one more", "chance"];
        }
    }
    
    export class AAttackBonus extends AItem
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.SWORD, sheet, 'Sword');
        }
        
        Execute(): void
        {
            // the real power is just inside you!
        }
        
        GetDescription(): [string, string]
        {
            return ["attack", "increased"];
        }
    }
    
    export class ALightBonus extends AItem
    {
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, assets.PLAYER_TORCH, sheet, 'Light');
        }
        
        Execute(): void
        {
            // hello darkness my old friend.
        }
        
        GetDescription(): [string, string]
        {
            return ["coisy", "fire"];
        }
    }
}