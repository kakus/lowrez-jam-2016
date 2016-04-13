/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/Tween.ts" />
/// <reference path="../gfx/AnimatedSprite.ts" />


namespace game {
    
    /**
     * Anything that need take some actions in game and wants to be displayed./
     */
    export abstract class Actor extends core.DisplayObject
    {
        /** this is just marker */
        IsActive: boolean = true;
        
        GridPosition = new core.Vector();
        
        Timer = new core.TimersManager();
        Tween = new core.TweenManager();
        
        EnableSubpixelMovement = false;
        
        
        constructor(x: number, y: number, width: number, height: number)
        {
            super(x, y, width, height);
        }
        
        Update(timeDelta: number): void
        {
            this.Timer.Update(timeDelta);
            this.Tween.Update(timeDelta);
            // Forbids subpixel movements
            if (!this.EnableSubpixelMovement) {
                this.Position.Set(Math.floor(this.Position.x), Math.floor(this.Position.y));
            }
        }
    }
    
    export abstract class AnimatedActor extends Actor
    {
        public Animator = new gfx.Animator();
        public Sprite = new gfx.AnimatedSprite(0, 0, this.Size.x, this.Size.y, this.Animator);
        
        Update(timeDelta: number): void
        {
            super.Update(timeDelta);
            this.Sprite.Update(timeDelta);
            // forbid subpixel movement
            if (!this.EnableSubpixelMovement) {
               this.Sprite.Position.Set(Math.floor(this.Sprite.Position.x), Math.floor(this.Sprite.Position.y));
            }
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }
    }
    
}