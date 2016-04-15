/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class DemonSlayedState extends AbstractState 
    {

        Start() 
        {
            this.DefaultSize.Set(64, 64);
            super.Start();
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            
            let txt = new gfx.AAText(9, 27, "DEMON SLAYED");
            txt.SetSize(5);
            
            for (let i = 0; i < 4; ++i) {
                let frame = ss.GetSprite(game.assets.HEART_FRAME);
                let fill = ss.GetSprite(game.assets.HEART_FILL);
                
                frame.Position.Set(14 + i * 10, 35);
                fill.Position.Set(14 + i * 10, 35);
                
                this.Stage.AddChild(frame);
                if (i < game.context.LifesLeft) {
                    this.Stage.AddChild(fill);
                }
                // if (i == game.context.LifesLeft) {
                //     this.Timers.Repeat(0.3, () => fill.Visible = !fill.Visible, undefined, 11);
                // }
            }                
            
            this.Stage.AddChild(txt);
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            this.Timers.Delay(4, () => this.OnKeyDown(core.key.UP));
            
            
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        }
        
        OnKeyDown(key: core.key): void
        {
            if (game.context.AllDemonsKilled()) {
                this.Game.Play('epilog');
            }
            else {
                this.Game.Play('play');
            }
        }

    }

}
