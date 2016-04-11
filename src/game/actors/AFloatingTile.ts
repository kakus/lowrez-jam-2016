/// <reference path="../Actor.ts" />
/// <reference path="../Assets.ts" />
/// <reference path="../Context.ts" />
/// <reference path="../../gfx/Rectangle.ts" />
/// <reference path="../../audio/AudioManager.ts" />
/// <reference path="../../core/Random.ts" />



namespace game {
    
    const COLLAPSE_TIME = 1.0;
    const DUST_TIME = 4.0;
    
    // audio.manager.AddSound('collapse', [3,,0.301,0.503,0.4639,0.0611,,-0.2594,,,,,,,,0.3472,0.0106,-0.0356,1,,,,,0.5]); 			
    audio.manager.AddSound('collapse', [3,,0.301,0.59,0.63,0.12,,-0.2594,,,,,,,,0.3472,0.0106,-0.0356,1,,,,,0.5], 5); 			
    
    export class AFloatingTile extends AnimatedActor
    {
        DustPartices: core.Layer<gfx.Rectangle>;
        
        constructor(x: number, y: number, sheetId: string)
        {
            super(x, y,24, 48);
            let sheet = new gfx.SpriteSheet(sheetId, new core.Vector(24, 48), new core.Vector(0, 24));
             
             
            this.Animator.AddAnimation('collapse', assets.FLOATING_TILE_FRAMES, sheet);
            this.Animator.AddAnimation('idle', [assets.FLOATING_TILE_FRAMES[0]], sheet);
            this.Animator.Play('idle');
            
            this.SetupDustParticles();
        }
        
        Collapse(): void
        {
            let pos = this.Sprite.Position;
            this.IsActive = false;
            
            audio.manager.Play('collapse', 0.5);
            this.Animator.Play('collapse');
            
            this.Tween.New(pos)
                .To({y: pos.y + 15}, COLLAPSE_TIME)
                .OnUpdate(() => pos.Set(pos.x | 0, pos.y | 0))
                .Parallel(this.Sprite, t => t
                    .To({Alpha: 0}, COLLAPSE_TIME))
                .Parallel(null, t => t
                    .Delay(0.25)
                    .WhenDone(() => {
                        game.context.PlayState.ShakeScreen(0.5);
                    }))
                .Then()
                .To({y: pos.y}, 0.01)
                .Start();
                
            this.EmitParticles();
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
            this.DustPartices.Draw(ctx);
        }
        
        private EmitParticles(): void
        {
            this.DustPartices.Visible = true;
            this.DustPartices.Children.forEach(dust => {
                
                dust.Position.Set(24/2 + core.Random(-6, 6), 20 + core.Random(-2, 2));
                dust.Size.Set(1, 1);
                
                let dest = new core.Vector(0, 1);
                core.vector.Rotate(dest, core.Random(-Math.PI, Math.PI));
                core.vector.Scale(dest, 8);
                core.vector.Add(dust.Position, dest, dest);
                
                dust.Alpha = 0;
                this.Tween.New(dust.Position)
                    .Delay(COLLAPSE_TIME/2)
                    .Then()
                    .To({x: dest.x, y: dest.y - 15}, DUST_TIME)
                    .OnUpdate(() => {
                        dust.Position.Set(dust.Position.x | 0, dust.Position.y | 0);
                    })
                    
                    // .Parallel(dust.Size, t => t
                    //     .To({x: 1, y: 1}, DUST_TIME))
                        
                    .Parallel(dust, t => t
                        .To({Alpha: 1}, 1)
                        .Then()
                        .To({Alpha: 0}, DUST_TIME - 1))
                    .Start();
            });
        }
        
        private SetupDustParticles(): void
        {
            this.DustPartices = new core.Layer<gfx.Rectangle>();
            this.DustPartices.Alpha = 0.2;
            this.DustPartices.Visible = false;
            
            for (let i = 0; i < 40; ++i)
            {
                // let s = sheet.GetSprite(i % 2 ? assets.DUST_CLOUD_1: assets.DUST_CLOUD_2);
                let s = new gfx.Rectangle(0, 0, 2, 2, {fillStyle: '#c0c0c0'});
                this.DustPartices.AddChild(s);
            };
        }
    }
    
}