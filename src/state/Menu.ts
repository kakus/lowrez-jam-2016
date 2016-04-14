/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class Menu extends AbstractState 
    {

        IsKeyDown: boolean[];
        
        /**
		 * Called once before first update
		 */
        Start() 
        {
            this.IsKeyDown = [];
            this.DefaultSize.Set(64, 64);
            super.Start();
			/**
			 * RESET CONTEXT
			 */
			game.context.Reset();
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            
            let t1 = new gfx.AAText(17, 45, "PRESS UP");
            let t2 = new gfx.AAText(17, 51, "TO START");
            t1.SetSize(5);               
            t2.SetSize(5);               
            
            this.Stage.AddChild(t1, t2);
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        }


        OnKeyUp(key: core.key): void
        {
            this.IsKeyDown[key] = false;
        }
        
        OnKeyDown(key: core.key): void
        {
            this.Game.Play('play');
        }
        
        DimScreen(reverse = false, time = 2): core.Tween
        {
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({Alpha: reverse ? 1 : 0}, time)
                .Start();
        }

    }

}
