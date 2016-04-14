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
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            
            let txt = new gfx.AAText(17, 27, "YOU DIED");
            txt.SetSize(5);
            
            for (let i = 0; i < 4; ++i) {
                let frame = ss.GetSprite(game.assets.HEART_FRAME);
                let fill = ss.GetSprite(game.assets.HEART_FILL);
                
                frame.Position.Set(14 + i * 10, 35);
                fill.Position.Set(14 + i * 10, 35);
                
                this.Stage.AddChild(frame);
                if (i <= game.context.LifesLeft) {
                    this.Stage.AddChild(fill);
                }
                if (i == game.context.LifesLeft) {
                    this.Timers.Repeat(0.3, () => fill.Visible = !fill.Visible, undefined, 11);
                }
            }                
            
            this.Stage.AddChild(txt);
            
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
            if (game.context.LifesLeft > 0) {
                this.Game.Play('play');
            }
            else {
                this.Game.Play('menu');
            }
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
