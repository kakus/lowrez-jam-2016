/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/Tween.ts" />


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
        
        constructor(x: number, y: number, 
            public Sprite: core.DisplayObject
        ) {
            super(x, y, Sprite.Size.x, Sprite.Size.y);
            this.Timer.Delay(0, this.Start, this);
        }
        
        /**
         * Called once before first update.
         */
        abstract Start(): void;
        
        Update(timeDelta: number): void
        {
            this.Timer.Update(timeDelta);
            this.Tween.Update(timeDelta);
            // Forbids subpixel movements
            this.Position.Set(this.Position.x | 0, this.Position.y | 0);
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }
    }
    
}