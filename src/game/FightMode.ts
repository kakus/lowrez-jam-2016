/// <reference path="../core/DisplayObject.ts" />
/// <reference path="actors/ATooth.ts" />
/// <reference path="../core/Color.ts" />

namespace game {
    
    const FLIP_POWER = 30;
    
    export class FightMode extends core.DisplayObject
    {
        Mouth = new core.Layer(5, 15, 54, 45);
        Face = new core.Layer(0, 0, 64, 64);
        Area = new gfx.Rectangle(5, 15, 54, 45, {strokeStyle: 'red', lineWidth: 0.5});
        
        Teeth = new core.Layer<ATooth>();
        TeethVelocity = new core.Vector(-10, 0);
        
        Player = new ATooth(5, 0, tooth.player);
        PlayerVelocity = new core.Vector(0, 0);
        PlayerHealthBar = new HealthBar(6, 1, 20, 5, "H", new core.RgbColor(255, 0, 0, 0.5));
        
        DemonHealthBar = new HealthBar(38, 1, 20, 5, "D", new core.RgbColor(0, 0, 255, 0.5), true);
        
        Gravity = new core.Vector(0, 60);
        Marker = new gfx.Rectangle(0, 0, 4, 4, {fillStyle: "rgba(255, 0, 0, 0.5)"});
        
        CanFlap = true;
        
        Timers = new core.TimersManager();
        
        
        constructor(x: number, y: number)
        {
            super(x, y, 64, 64);
            let t2 = new ATooth(54, 0, tooth.gen(15, 30).reverse());
            let t1 = new ATooth(74, 45-30, tooth.gen(21, 30));
            let t3 = new ATooth(100, 0, tooth.gen(15, 25).reverse());
            this.Teeth.AddChild(t1, t2, t3);
            
            // this.Player.EnableSubpixelMovement = true;
            this.Mouth.AddChild(this.Teeth);
            this.Mouth.AddChild(this.Player, this.Marker);
            
            this.Face.AddChild(this.PlayerHealthBar, this.DemonHealthBar);
            
        }
        
        Update(timeDelta: number): void
        {
            // Debug code
            this.Player.Position.Clone(this.Marker.Position);
            this.Marker.Visible = false;
            
            this.Timers.Update(timeDelta);
            
            let thereWasCollision = this.CheckCollision();
            this.IntegrateVelocity(timeDelta);
            
            if (thereWasCollision) {
                this.PlayerTakeDamage();
            }
            else {
                if (this.Player.FloatPosition.y < 0) {
                    this.DemonTakeDamage(true);
                }
                else if(this.Player.FloatPosition.y > this.Mouth.Size.y - this.Player.Size.y) {
                    this.DemonTakeDamage(false);
                }
            }
            // clamp Position
            this.Player.FloatPosition.y = core.math.Clamp(this.Player.FloatPosition.y, 0, this.Mouth.Size.y - this.Player.Size.y);
            this.Player.Update(timeDelta);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Area.Draw(ctx);
            this.Mouth.Draw(ctx);
            this.Face.Draw(ctx);
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
        
        private DemonTakeDamage(upperLip: boolean): void
        {
            console.log('demon take damaage');
            
            this.PlayerVelocity.y = FLIP_POWER * (upperLip ? 0.25 : -1);
        }
        
        private PlayerTakeDamage(): void
        {
            console.log('player take damage');
            
        }
        
        private CheckCollision(): boolean
        {
            for (let tooth of this.Teeth.Children)
            {
                if (game.tooth.Collide(this.Player, tooth)) 
                {
                    if (tooth.IsActive) {
                        tooth.IsActive = false;
                        tooth.Blink(2, 0.1);
                    }
                    
                    this.Marker.Visible = true;
                    return true;
                }
            }
            return false;
        }
        
        private IntegrateVelocity(timeDelta: number): void
        {
            
            let delta = new core.Vector();
            vec.Scale(this.TeethVelocity, timeDelta, delta);
            
            for (let tooth of this.Teeth.Children)
            {
                vec.Add(tooth.FloatPosition, delta, tooth.FloatPosition);
                tooth.Update(timeDelta);
                
                if (tooth.Position.x < -20) {
                    tooth.FloatPosition.x = this.Area.Size.x;
                    tooth.IsActive = true;
                    tooth.Visible = true;
                }
            }
            
            // gravity update
            vec.Scale(this.Gravity, timeDelta, delta);
            vec.Add(this.PlayerVelocity, delta, this.PlayerVelocity);
            // velocity update
            vec.Scale(this.PlayerVelocity, timeDelta, delta);
            vec.Add(this.Player.FloatPosition, delta, this.Player.FloatPosition);
        }
    }
    
    class HealthBar extends core.DisplayObject
    {
        Background: gfx.Rectangle;
        Fill: gfx.Rectangle;
        Label: gfx.AAText;
        
        constructor(x: number, y: number, width: number, height: number, label: string, color: core.RgbColor, labelRightSide = false)
        {
            super(x, y, width, height);
            
            this.Fill = new gfx.Rectangle(1, 1, width - 2, height - 2, {fillStyle: color.toString()});
            color.a /= 2;
            this.Background = new gfx.Rectangle(0, 0, width, height, {fillStyle: color.toString()});
            this.Label = new gfx.AAText(-5, 0, label);
            if (labelRightSide) {
                this.Label.Position.x = width + 2;
            }
            this.Label.SetSize(5);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Label.Draw(ctx);
            this.Background.Draw(ctx);
            this.Fill.Draw(ctx);
        }
    }
    
}