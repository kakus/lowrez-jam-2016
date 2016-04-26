/// <reference path="../core/DisplayObject.ts" />
/// <reference path="actors/ATooth.ts" />
/// <reference path="actors/ADemonFace.ts" />
/// <reference path="../core/Color.ts" />
/// <reference path="../core/ObservableProperty.ts" />
/// <reference path="TeethGenerator.ts" />
/// <reference path="../gfx/Circle.ts" />



namespace game {
    
    const FLIP_POWER = 40;
    const QUANTIZE_POS = (pos: core.Vector) => pos.Set(Math.floor(pos.x), Math.floor(pos.y));
    
    export class FightMode extends core.DisplayObject
    {
        Mouth = new core.Layer(5, 15, 54, 45);
        Face = new core.Layer(0, 0, 64, 64);
        // Area = new gfx.Rectangle(5, 15, 54, 45, {strokeStyle: 'red', lineWidth: 0.5});
        
        Teeth = new core.Layer<ATooth>();
        TeethVelocity = new core.Vector(-10, 0);
        ToothRestartX: number;
        LightCone: LightCone;
        
        Player = new ATooth(5, 20, tooth.player);
        PlayerVelocity = new core.Vector(0, 0);
        // PlayerHealthBar = new HealthBar(6, 1, 20, 5, "H", new core.RgbColor(255, 0, 0, 0.5));
        CanFlap = true;
        LockFlap = false;
        Gravity = new core.Vector(0, 80);
        
        DemonFace: ADemonFace;
        DemonHealthBarBg: gfx.Sprite;
        DemonHealthBar = new HealthBar(5, 2, 54, 2, new core.RgbColor(174, 50, 50, 1));
        
        // Marker = new gfx.Rectangle(0, 0, 4, 4, {fillStyle: "rgba(255, 0, 0, 0.5)"});
        
        TimeScale = 1;
        Timers = new core.TimersManager();
        Tween = new core.TweenManager();
        BloodTween = new core.TweenManager();
        BloodParticles = new core.Layer<gfx.Rectangle>();
        
        
        
        constructor(
            x: number, y: number, generator: TeethGenertor,
            public DemonName: string
        ) {
            super(x, y, 64, 64);
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            this.DemonFace = new ADemonFace(0, 0, assets.FIGHT_DEMON_MOUTH[DemonName.toUpperCase()], ss);
            this.DemonHealthBarBg = ss.GetSprite(assets.FIGHT_DEMON_HEALTHBAR);
            this.DemonHealthBarBg.SourceRect.Size.Set(64, 7);
            this.DemonHealthBarBg.Size.Set(64, 7);
            
            // this.Player.EnableSubpixelMovement = true;
            generator
                .SpawnAll(new core.Vector(this.Size.x/2, 0), new core.Vector(this.Size.x/2, 45))
                .forEach(tooth => {
                    tooth.Visible = tooth.Position.x < this.Mouth.Size.x + 10;
                    this.Teeth.AddChild(tooth);
                });
                
            this.ToothRestartX = generator.LastX;
            
            this.Mouth.AddChild(this.Teeth, this.Player, this.BloodParticles);
            // this.Mouth.AddChild(this.Marker);
            this.Face.AddChild(this.DemonFace);
            
            if (context.DemonNeedsLight(this.DemonName)) 
            {
                if (!context.PlayerHas('Light')) 
                {
                    this.ActiveLightCone(ss);
                }
            }
            
            this.SetupBloodParticles(20);
            this.BloodParticles.Visible = false;
            
            this.DemonHealthBar.Progress.OnChange.Add(value => {
                if (value <= 0) {
                    this.DemonSlayed();
                }
            });
            
            this.TimeScale = 0;
            this.Timers.Delay(0, () => audio.manager.Play('fight-scene', 0.7, true));
            
            context.PlayState.DimScreen(true, 2)
                .WhenDone(() => this.TimeScale = 1);
        }
        
        Update(timeDelta: number): void
        {
            timeDelta *= this.TimeScale;
            // Debug code
            // this.Player.Position.Clone(this.Marker.Position);
            // this.Marker.Visible = false;
            
            this.Timers.Update(timeDelta);
            this.BloodTween.Update(timeDelta);
            this.Tween.Update(timeDelta);
            this.DemonFace.Update(timeDelta);
            
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
            this.Mouth.Draw(ctx);
            this.Face.Draw(ctx);
            this.DemonHealthBarBg.Draw(ctx);
            this.DemonHealthBar.Draw(ctx);
        }
        
        Flap(): void
        {
            if (this.LockFlap) return;
            
            if (this.CanFlap && this.Player.IsActive)
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
            if (!this.Player.IsActive) return;
            
            this.DemonFace.Hurt();
            audio.manager.Play('demon-hit');
            
            this.PlayerVelocity.y = FLIP_POWER * (upperLip ? 0.45 : -1);
            context.PlayState.ShakeScreen(0.3, 3);
            
            this.LockFlap = true
            this.Timers.Delay(0.25, () => this.LockFlap = false);
            
            let bloodPos = new core.Vector();
            if (upperLip) {
                this.Player.Position.Clone(bloodPos);
            }
            else {
                vec.Add(this.Player.Position, this.Player.Size, bloodPos);
            }
            this.EmitBloodParicles(bloodPos, upperLip);
            
            if (context.PlayerHas('Sword')) {
                this.DemonHealthBar.Progress.Increment(-0.101);
            }
            else {
                this.DemonHealthBar.Progress.Increment(-0.05);
            }
        }
        
        protected PlayerTakeDamage(): void
        {
            // this could happen if we fall onto another tooth while falling.
            if (!this.Player.IsActive) return;
            
            audio.manager.FadeOutAll();
            
            this.Player.IsActive = false;
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            this.PlayerVelocity.Set(0, 0);
            
            const delay = 2;
            const fade = 2;
            
            this.Tween.New(this.Mouth)
                .Delay(delay)
                .Then()
                .To({Alpha: 0}, fade * 0.75)
                .Start();
                
            this.Tween.New(this.Face)
                .Delay(delay)
                .Then()
                .To({Alpha: 0}, fade)
                .Start()
                .WhenDone(() => {
                    game.context.LifesLeft -= 1;
                    GAME.Play('you-died');
                });
        }
        
        private DemonSlayed(): void
        {
            if (!this.Player.IsActive) return;
            
            context.KilledDemons.push(this.DemonName);
            audio.manager.FadeOutAll();
            
            this.Player.IsActive = false;
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            this.PlayerVelocity.Set(0, 0);
            
            const delay = 2;
            const fade = 2;
            
            this.Tween.New(this.Mouth)
                .Delay(delay)
                .Then()
                .To({Alpha: 0}, fade * 0.75)
                .Parallel(this.Mouth.Position, t => t
                    .To({y: this.Mouth.Position.y + 50}, fade, core.easing.CubicIn)
                    .OnUpdate(QUANTIZE_POS))
                .Start();
                
            this.Tween.New(this.Face)
                .Delay(delay)
                .WhenDone(() => context.PlayState.ShakeScreen(fade, 4))
                .Then()
                .To({Alpha: 0}, fade)
                .Parallel(this.Face.Position, t => t
                    .To({y: this.Face.Position.y + 50}, fade, core.easing.CubicIn)
                    .OnUpdate(QUANTIZE_POS))
                .Start()
                .WhenDone(() => {
                    GAME.Play('demon-slayed');
                });
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
                    
                    // this.Marker.Visible = true;
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
            this.BloodParticles.Visible = true;
            
            const FALL_TIME = 1;
            for (let particle of this.BloodParticles.Children)
            {
                particle.Position.Set(0, 0);
                particle.Alpha = 1;
                const y = core.Random(5, 10);
                const fall = FALL_TIME * (y / 10);
                
                this.BloodTween.New(particle.Position)
                    .To({y: fromTop ? y : -y, x: core.Random(-5, 5)}, fall/2, core.easing.CubicOut)
                    .OnUpdate(QUANTIZE_POS)
                    .Then()
                    .OnUpdate(QUANTIZE_POS)
                    .To({y: 0}, fall/2, core.easing.CubicIn)
                    .Start();
            }
            
            let d = FALL_TIME * this.TeethVelocity.x * 1.5;
            this.BloodParticles.Position.Set(start.x, start.y);
            this.BloodTween.New(this.BloodParticles.Position)
                .OnUpdate(QUANTIZE_POS)
                .To({x: start.x + d}, FALL_TIME)
                .Start()
                .WhenDone(() => this.BloodParticles.Visible = false);
        }
        
        private ActiveLightCone(ss: gfx.SpriteSheet): void
        {
            
            let shape = ss.GetSprite(assets.FIGHT_LIGHT_CONE);
            shape.Size.Set(40, 40);
            shape.SourceRect.Size.Set(40, 40);
            
            this.LightCone = new LightCone(0, 0, shape);
            this.LightCone.Position.x = this.Player.Position.x - this.LightCone.Size.x/2 + 2;
            this.Timers.Repeat(0, () => {
                this.LightCone.Position.y = this.Player.Position.y - this.LightCone.Size.x/2 + 2;
            })
            
            this.Mouth.AddChild(this.LightCone);
        }
        
    }
    
    class HealthBar extends core.DisplayObject
    {
        // Background: gfx.Rectangle;
        Fill: gfx.Rectangle;
        Progress = new core.ObservableNumber(1);
        
        constructor(x: number, y: number, width: number, height: number, color: core.RgbColor)
        {
            super(x, y, width, height);
            
            this.Fill = new gfx.Rectangle(0, 0, width, height, {fillStyle: color.toString()});
            // color.a /= 2;
            // this.Background = new gfx.Rectangle(0, 0, width, height, {fillStyle: color.toString()});
            
            this.Progress.OnChange.Add(value => {
                value = core.math.Clamp(value, 0, 1);
                this.Fill.Size.x = (value * width) | 0;
            })
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            // this.Background.Draw(ctx);
            this.Fill.Draw(ctx);
        }
    }
    
    class LightCone extends core.DisplayObject
    {
        constructor(
            x: number, y: number,
            public Shape: core.DisplayObject
        ) {
            super(x, y, Shape.Size.x, Shape.Size.y);            
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            ctx.globalCompositeOperation = 'destination-in';
            this.Shape.Draw(ctx);
        }
    }
    
}