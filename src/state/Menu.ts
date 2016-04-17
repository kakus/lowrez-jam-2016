/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class Menu extends AbstractState 
    {
		
		BgScene: gfx.AnimatedSprite;

        /**
		 * Called once before first update
		 */
        Start() 
        {
            super.Start();
			/**
			 * RESET CONTEXT
			 */
			game.context.Reset();
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
			
			let frames = game.assets.MAIN_MENU_SCENE;
			this.BgScene = new gfx.AnimatedSprite(0, 0, 64, 64);
			let anim = this.BgScene.Animator.AddAnimation('idle', frames.map((_, i) => i), frames.map((id) => {
				let frame = ss.GetSprite(id);
				frame.SourceRect.Size.Set(64, 64);
				frame.Size.Set(64, 64);
				return frame;
			}));
			anim.Loop = true;
			anim.Duration = 2;
			this.BgScene.Animator.Play('idle');
			
            /**
			 * rycerz spi przy ognisku !!!!
			 */
            let t1 = new gfx.AAText(17, 45, "PRESS UP");
            let t2 = new gfx.AAText(17, 51, "TO START");
            t1.SetSize(5);               
            t2.SetSize(5);               
            
            this.Stage.AddChild(this.BgScene, t1, t2);
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        }
		
		Update(timeDelta: number): void
		{
			super.Update(timeDelta);
			this.BgScene.Update(timeDelta);	
		}


        OnKeyUp(key: core.key): void
        {
        }
        
        OnKeyDown(key: core.key): void
        {
            this.Game.Play('play');
        }

    }

}
