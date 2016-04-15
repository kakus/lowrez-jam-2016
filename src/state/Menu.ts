/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class Menu extends AbstractState 
    {

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
            /**
			 * rycerz spi przy ognisku !!!!
			 */
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
        }
        
        OnKeyDown(key: core.key): void
        {
            this.Game.Play('play');
        }

    }

}
