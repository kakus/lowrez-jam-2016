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
        public IsActive: boolean = true;
        
        public GridPosition = new core.Vector();
        
        public Timer = new core.TimersManager();
        public Tween = new core.TweenManager();
        
        
        constructor(x: number, y: number, width: number, height: number)
        {
            super(x, y, width, height);
        }
        
        Update(timeDelta: number): void
        {
            this.Timer.Update(timeDelta);
            this.Tween.Update(timeDelta);
            // Forbids subpixel movements
            this.Position.Set(this.Position.x | 0, this.Position.y | 0);
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
            this.Sprite.Position.Set(this.Sprite.Position.x | 0, this.Sprite.Position.y | 0);
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }
    }
    
}