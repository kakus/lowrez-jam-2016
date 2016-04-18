/// <reference path="../Actor.ts" />
/// <reference path="../../audio/AudioManager.ts" />

namespace game {
    
    const JUMP_DURATION = 0.5;
    const VANISH_TIME = 2;
        
    // audio.manager.AddSound('landing', [0,,0.0785,,0.2923,0.7043,,-0.5667,0.0112,,,0.0145,,0.2016,,0.0033,,-0.0354,0.9802,,,0.0297,,0.5]);
    
    export class AHero extends AnimatedActor
    {
        Face : 'left' | 'right' | 'up' = 'left';
        Shadow: gfx.Sprite;
        DustParticles: core.Layer<gfx.Rectangle>;
        
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, 24, 24);
            
            this.Animator.AddAnimation('left', [assets.HERO_FACE_LEFT], sheet);
            this.Animator.AddAnimation('right', [assets.HERO_FACE_RIGHT], sheet);
            this.Animator.AddAnimation('up', [assets.HERO_FACE_UP], sheet);
            this.Animator.AddAnimation('falling', [assets.HERO_FALLING], sheet);
            this.Animator.AddAnimation('landing', assets.HERO_LANDING, sheet).Duration = 0.7;
            
            this.Shadow = sheet.GetSprite(assets.SMALL_SHADOW);
            this.Animator.Play('left');
            
            this.SetupDustParticles();
            this.Alpha = 0;
            this.IsActive = false;
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Shadow.Draw(ctx);
            this.DustParticles.Draw(ctx);
            this.Sprite.Draw(ctx);
        }
        
        PlayJump(dest: core.Vector): core.Tween
        {
            this.UpdateFace(dest);
            
            return this.Tween.New(this.Position)
                .To({x: dest.x, y: dest.y}, JUMP_DURATION, core.easing.SinusoidalInOut)
                .Parallel(this.Sprite.Position, t => t 
                    .To({y: this.Sprite.Position.y - 10}, JUMP_DURATION/2, core.easing.CubicOut)
                    .Then()
                    .To({y: this.Sprite.Position.y}, JUMP_DURATION/2))
                // .WhenDone(() => audio.manager.Play('landing'))
                .Start();
        }
        
        PlayDead(fallDistance: number = 10): core.Tween
        {
            return this.Tween.New(this)
                .To({Alpha: 0}, VANISH_TIME)
                .Parallel(this.Position, t => t
                    .To({y: this.Position.y + fallDistance}, VANISH_TIME, core.easing.CubicOut))
                .Start();
        }
        
        FallFromHeaven(): core.Tween
        {
            let top = this.ToLocal(new core.Vector(GAME.Canvas.width/2, 0));
            this.Sprite.Position.Set(top.x - 12, top.y - 24);
            console.log("hero pos " + this.Sprite.Position);
            
            this.Animator.Play('falling');
            this.Alpha = 1;
            
            return this.Tween.New(this.Sprite.Position)
                .To({x: 0, y: 0}, 1, core.easing.CubicIn)
                .WhenDone(() => {
                    context.PlayState.ShakeScreen(0.5);
                    this.EmitParticles();
                    audio.manager.Play('demon-hit');
                })
                .Then()
                .Delay(1.5)
                .WhenDone(() => {
                    this.Animator.Play('landing');
                    this.IsActive = true;
                })
                .Then()
                .Delay(1)
                .WhenDone(() => this.Animator.Play('left'))
                .Start();
        }
        
        private UpdateFace(dest: core.Vector): void
        {
            if (dest.y - this.Position.y < 0) 
            {
                this.Face = 'up';
            }
            else 
            {
                this.Face = dest.x - this.Position.x > 0 ?'right' : 'left';    
            }
            
            this.Animator.Play(this.Face);
        }
        
         private EmitParticles(): void
        {
            this.DustParticles.Visible = true;
            this.DustParticles.Children.forEach(dust => {
                
                dust.Position.Set(12, 15);
                dust.Size.Set(1, 1);
                
                let dest = new core.Vector(0, 1);
                core.vector.Rotate(dest, core.Random(-Math.PI, Math.PI));
                core.vector.Scale(dest, 8);
                core.vector.Add(dust.Position, dest, dest);
                
                const DUST_TIME = 1;
                
                dust.Alpha = 0;
                this.Tween.New(dust.Position)
                    .To({x: dest.x, y: dest.y - 3}, DUST_TIME)
                    .OnUpdate(() => {
                        dust.Position.Set(dust.Position.x | 0, dust.Position.y | 0);
                    })
                    .Parallel(dust, t => t
                        .To({Alpha: 1}, DUST_TIME/2)
                        .Then()
                        .To({Alpha: 0}, DUST_TIME/2))
                    .Start();
            });
        }
        
        private SetupDustParticles(): void
        {
            this.DustParticles = new core.Layer<gfx.Rectangle>();
            this.DustParticles.Alpha = 0.2;
            this.DustParticles.Visible = false;
            
            for (let i = 0; i < 40; ++i)
            {
                // let s = sheet.GetSprite(i % 2 ? assets.DUST_CLOUD_1: assets.DUST_CLOUD_2);
                let s = new gfx.Rectangle(0, 0, 2, 2, {fillStyle: '#c0c0c0'});
                this.DustParticles.AddChild(s);
            };
        }
        
    }
}