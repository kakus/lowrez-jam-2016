/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class EpilogState extends AbstractState 
    {

        Start() 
        {
            this.DefaultSize.Set(64, 64);
            super.Start();
            
            let ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            
            let part1: core.Tween;
            ["THEY", "ALL", "GONE", "NOW"].forEach((msg, i) => {
                
                let txt = new gfx.AAText(32, 32, msg);
                txt.Anchor.Set(.5, .5);
                txt.SetSize(5);
                txt.Alpha = 0;
                
                this.Stage.AddChild(txt);
                part1 = this.Tweens.New(txt)
                    .Delay(1 + i * 2)
                    .Then()
                    .To({Alpha: 1})
                    .Then()
                    .To({Alpha: 0})
                    .WhenDone(() => txt.RemoveFromParent())
                    .Start();
            });
            
            part1.WhenDone(() => {
                
                let txt = new gfx.AAText(32, 32, "WAKE UP!");
                txt.Anchor.Set(.5, .5);
                txt.SetSize(5);
                txt.Alpha = 0;
                
                this.Stage.AddChild(txt);
                this.Tweens.New(txt)
                    .Then()
                    .To({Alpha: 1})
                    .WhenDone(() => this.ShakeScreen(0.5))
                    .Then()
                    .Delay(1)
                    .WhenDone(() => {
                        txt.Scale.Set(2, 2);
                        this.ShakeScreen(0.5);
                    })
                    .Then()
                    .Delay(1)
                    .WhenDone(() => txt.RemoveFromParent())
                    .Start();
                
            })
            
            
            let fin = new core.Layer(0, 74);
            [
                "THANK YOU",
                "FOR PLAYING",
                "",
                "FOR MORE NEWS",
                "FOLLOW ME ON",
                "TWITTER",
                "KAKUS_DEV"
            ].forEach((line, i, arr) => {
                let t = new gfx.AAText(32, i * 7, line);
                t.SetSize(5);
                t.Anchor.Set(.5, .5);
                if (i == arr.length - 1) {
                    t.SetColor('#55acee');
                }
                fin.AddChild(t);
            })
            
            this.Timers.Delay(15, () => {
                this.Stage.AddChild(fin);
                this.Tweens.New(fin.Position)
                    .To({y: 12}, 5)
                    .Start();
            });
            
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            
            
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        }
        
        OnKeyDown(key: core.key): void
        {
            this.Game.Play('menu');
        }
       

    }

}
