/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class YouDiedState extends AbstractState 
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
            
            let txt = new gfx.AAText(32, 32, "YOU DIED");
            txt.SetSize(5);
            txt.Anchor.Set(0.5, 0.5);
            
            this.Stage.AddChild(txt);
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 3);
            
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
        
        OnResize(): void
        {
            super.OnResize();
            this.Game.Context['imageSmoothingEnabled'] = false;
            this.Game.Context['mozImageSmoothingEnabled'] = false;
            this.Game.Context['webkitImageSmoothingEnabled'] = false;
            this.Game.Context['msImageSmoothingEnabled'] = false;
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
