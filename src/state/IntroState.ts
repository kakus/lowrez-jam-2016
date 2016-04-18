/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    const QUANTIZE_POS = (pos: core.Vector) => pos.Set(Math.floor(pos.x), Math.floor(pos.y));
    
    export class IntroState extends AbstractState 
    {
		
		Intro: gfx.AnimatedSprite;

        /**
		 * Called once before first update
		 */
        Start() 
        {
            super.Start();
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
			
			let frames = game.assets.INTRO_SCENE;
			this.Intro = new gfx.AnimatedSprite(0, 0, 64, 64);
			let anim = this.Intro.Animator.AddAnimation('idle', frames.map((_, i) => i), frames.map((id) => {
				let frame = ss.GetSprite(id);
				frame.SourceRect.Size.Set(64, 64);
                frame.SourceRect.Position.x += 4;
                frame.SourceRect.Position.y += 4;
				frame.Size.Set(64, 64);
				return frame;
			}));
			anim.Duration = 2;
            
            this.Intro.Animator.AddAnimation('freeze', [0], [frames[0]].map((id) => {
				let frame = ss.GetSprite(id);
				frame.SourceRect.Size.Set(64, 64);
                frame.SourceRect.Position.x += 4;
                frame.SourceRect.Position.y += 4;
				frame.Size.Set(64, 64);
				return frame;
			}));
            
            this.Intro.Animator.Play('freeze');
            
            this.Stage.AddChild(this.Intro);
            
            this.Intro.Position.Set(0, 64);
            this.Tweens.New(this.Intro.Position)
                .Delay(1)
                .Then()
                .To({y: 0}, 2, core.easing.CubicOut)
                .OnUpdate(QUANTIZE_POS)
                .Start()
                .WhenDone(() => {
			        this.Intro.Animator.Play('idle');
                    
                    this.Timers.Delay(2, () => {
                        this.DimScreen();
                        this.Timers.Delay(2, () => {
                            this.OnKeyDown(0);
                        });
                    })
                });
            
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        }
		
		Update(timeDelta: number): void
		{
			super.Update(timeDelta);
			this.Intro.Update(timeDelta);	
		}


        OnKeyUp(key: core.key): void
        {
        }
        
        OnKeyDown(key: core.key): void
        {
            this.Game.Play('you-died');
        }

    }

}
