/// <reference path="../core/DisplayObject.ts" />
/// <reference path="actors/ATooth.ts" />

namespace game {
    
    const FLIP_POWER = 30;
    
    export class FightMode extends core.DisplayObject
    {
        Mouth = new core.Layer(5, 15, 54, 45);
        Area = new gfx.Rectangle(5, 15, 54, 45, {strokeStyle: 'red', lineWidth: 0.5});
        
        Teeth = new core.Layer<ATooth>();
        TeethVelocity = new core.Vector(-10, 0);
        
        Player = new ATooth(5, 0, tooth.player);
        PlayerVelocity = new core.Vector(0, 0);
        Gravity = new core.Vector(0, 60);
        
        CanFlap = true;
        
        
        constructor(x: number, y: number)
        {
            super(x, y, 64, 64);
            let t2 = new ATooth(54, 0, tooth.gen(15, 30).reverse());
            let t1 = new ATooth(74, 45-30, tooth.gen(21, 30));
            let t3 = new ATooth(100, 0, tooth.gen(15, 25).reverse());
            this.Teeth.AddChild(t1, t2, t3);
            
            // this.Player.EnableSubpixelMovement = true;
            this.Mouth.AddChild(this.Teeth);
            this.Mouth.AddChild(this.Player);
            
        }
        
        Update(timeDelta: number): void
        {
            let delta = new core.Vector();
            vec.Scale(this.TeethVelocity, timeDelta, delta);
            
            for (let tooth of this.Teeth.Children)
            {
                vec.Add(tooth.FloatPosition, delta, tooth.FloatPosition);
                tooth.Update(timeDelta);
                
                if (tooth.Position.x < -20) {
                    tooth.FloatPosition.x = this.Area.Size.x;
                }
            }
            
            // gravity update
            vec.Scale(this.Gravity, timeDelta, delta);
            vec.Add(this.PlayerVelocity, delta, this.PlayerVelocity);
            // velocity update
            vec.Scale(this.PlayerVelocity, timeDelta, delta);
            vec.Add(this.Player.FloatPosition, delta, this.Player.FloatPosition);
            
            this.Player.FloatPosition.y = core.math.Clamp(this.Player.FloatPosition.y, 0, this.Mouth.Size.y - this.Player.Size.y);
            this.Player.Update(timeDelta);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Area.Draw(ctx);
            this.Mouth.Draw(ctx);
        }
        
        Flap(): void
        {
            if (this.CanFlap)
            {
                this.PlayerVelocity.y = -FLIP_POWER;
                this.CanFlap = false;
            }
        }
        
        /**
         * Opposite for flap.
         */
        Flip(): void
        {
            this.CanFlap = true;
        }
        
        private SpawnTooth(): void
        {
            
        }
    }
    
}