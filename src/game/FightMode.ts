/// <reference path="../core/DisplayObject.ts" />
/// <reference path="actors/ATooth.ts" />
/// <reference path="../core/Color.ts" />
/// <reference path="../core/ObservableProperty.ts" />
/// <reference path="TeethGenerator.ts" />



namespace game {
    
    const FLIP_POWER = 30;
    
    export class FightMode extends core.DisplayObject
    {
        Mouth = new core.Layer(5, 15, 54, 45);
        Face = new core.Layer(0, 0, 64, 64);
        Area = new gfx.Rectangle(5, 15, 54, 45, {strokeStyle: 'red', lineWidth: 0.5});
        
        Teeth = new core.Layer<ATooth>();
        TeethVelocity = new core.Vector(-10, 0);
        ToothRestartX: number;
        
        Player = new ATooth(5, 0, tooth.player);
        PlayerVelocity = new core.Vector(0, 0);
        PlayerHealthBar = new HealthBar(6, 1, 20, 5, "H", new core.RgbColor(255, 0, 0, 0.5));
        CanFlap = true;
        Gravity = new core.Vector(0, 60);
        
        DemonHealthBar = new HealthBar(38, 1, 20, 5, "D", new core.RgbColor(0, 0, 255, 0.5), true);
        
        Marker = new gfx.Rectangle(0, 0, 4, 4, {fillStyle: "rgba(255, 0, 0, 0.5)"});
        
        Timers = new core.TimersManager();
        BloodTween = new core.TweenManager();
        BloodParticles = new core.Layer<gfx.Rectangle>();
        
        
        constructor(x: number, y: number, generator: TeethGenertor)
        {
            super(x, y, 64, 64);
            
            // this.Player.EnableSubpixelMovement = true;
            generator
                .SpawnAll(new core.Vector(this.Size.x/2, 0), new core.Vector(this.Size.x/2, 45))
                .forEach(tooth => {
                    console.log("new tooth at " + tooth.Position)
                    tooth.Visible = tooth.Position.x < this.Mouth.Size.x + 10;
                    this.Teeth.AddChild(tooth);
                });
                
            this.ToothRestartX = generator.LastX;
            
            this.Mouth.AddChild(this.Teeth, this.Player, this.Marker, this.BloodParticles);
            this.Face.AddChild(this.PlayerHealthBar, this.DemonHealthBar);
            // this.SetupBloodParticles(20);
            
            this.DemonHealthBar.Progress.OnChange.Add(value => {
                if (value <= 0) {
                    console.log("you killed demon");
                }
            })
        }
        
        Update(timeDelta: number): void
        {
            // Debug code
            this.Player.Position.Clone(this.Marker.Position);
            this.Marker.Visible = false;
            
            this.Timers.Update(timeDelta);
            this.BloodTween.Update(timeDelta);
            
            let thereWasCollision = this.CheckCollision();
            this.IntegrateVelocity(timeDelta);
            
            if (!thereWasCollision) 
            {
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
        
        private DemonTakeDamage(upperLip: boolean): void
        {
            console.log('demon take damaage');
            
            this.DemonHealthBar.Progress.Increment(-0.1);
            this.PlayerVelocity.y = FLIP_POWER * (upperLip ? 0.25 : -1);
            
            // let blood = new core.Vector();
            // if (upperLip) {
            //     blood = this.Player.Position;
            // }
            // else {
            //     vec.Add(this.Player.Position, this.Player.Size, blood);
            // }
            
            // this.EmitBloodParicles(blood, upperLip);    
        }
        
        private PlayerTakeDamage(): void
        {
            console.log('player take damage');
            this.PlayerHealthBar.Progress.Increment(-0.1);
            
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
                        this.PlayerTakeDamage();
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
                    // Restarth tooth
                    tooth.FloatPosition.x = this.ToothRestartX;
                    tooth.IsActive = true;
                    tooth.Visible = false;
                }
                else if (tooth.Position.x >= this.Mouth.Size.x && tooth.Position.x < this.Mouth.Size.x + 10) {
                    // Show tooth
                    tooth.Visible = true;
                }
            }
            // TODO blinking tooths can sometimes be rendered out of screen :/
            // console.log("visible tooths: " + this.Teeth.Children.map(t => t.Visible ? 1 : 0).reduce((p, c) => p + c, 0));
            
            // gravity update
            vec.Scale(this.Gravity, timeDelta, delta);
            vec.Add(this.PlayerVelocity, delta, this.PlayerVelocity);
            // velocity update
            vec.Scale(this.PlayerVelocity, timeDelta, delta);
            vec.Add(this.Player.FloatPosition, delta, this.Player.FloatPosition);
        }
        
        private SetupBloodParticles(max: number): void
        {
            for(let i = 0; i < max; ++i)
            {
                this.BloodParticles.AddChild(new gfx.Rectangle(0, 0, 1, 1, {fillStyle: 'rgba(255, 0, 0, 0.5)'}));
            }
        }
        
        private EmitBloodParicles(start: core.Vector, fromTop: boolean): void
        {
            this.BloodTween.StopAll(false);
            
            const FALL_TIME = 1;
            for (let particle of this.BloodParticles.Children)
            {
                particle.Position.Set(0, 0);
                particle.Alpha = 1;
                const y = core.Random(5, 10);
                const fall = FALL_TIME * (y / 10);
                
                this.BloodTween.New(particle.Position)
                    .To({y: fromTop ? y : -y, x: core.Random(-5, 5)}, fall/2, core.easing.CubicOut)
                    .Then()
                    .To({y: 0}, fall/2, core.easing.CubicIn)
                    .Start();
            }
            
            let d = FALL_TIME * this.TeethVelocity.x * 1.5;
            this.BloodParticles.Position.Set(start.x, start.y);
            this.BloodTween.New(this.BloodParticles.Position)
                .To({x: start.x + d}, FALL_TIME)
                .Start();
        }
        
    }
    
    class HealthBar extends core.DisplayObject
    {
        Background: gfx.Rectangle;
        Fill: gfx.Rectangle;
        Label: gfx.AAText;
        Progress = new core.ObservableNumber(1);
        
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
            
            this.Progress.OnChange.Add(value => {
                value = core.math.Clamp(value, 0, 1);
                this.Fill.Size.x = value * width;
            })
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Label.Draw(ctx);
            this.Background.Draw(ctx);
            this.Fill.Draw(ctx);
        }
    }
    
}