/// <reference path="FightMode.ts" />

namespace game {
    
    const FLIP_POWER = 40;
    const QUANTIZE_POS = (pos: core.Vector) => pos.Set(Math.floor(pos.x), Math.floor(pos.y));
    
    export class FightTutorial extends FightMode
    {
        Tutorial = new core.Layer(0, 0, 64, 64);
        Line1: gfx.AAText;
        Line2: gfx.AAText;
         
        constructor(
            x: number, y: number, generator: TeethGenertor,
            public DemonName: string
        ) {
            super(x, y, generator, DemonName);
            this.ShowTutorial();
        }
        
        ShowTutorial(): void
        {
            // this.TimeScale = 2;
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            
            this.Face.Alpha = 0;
            this.Mouth.Alpha = 0;
            
            let msgs = new core.Layer(32, 32);
            
            let [l1, l2] = ["this is demon", "health"].map((txt, i) => {
                let line = new gfx.AAText(0, i * 6, txt.toUpperCase());
                line.Anchor.Set(.5, .5);
                line.SetSize(5);
                return line;
            })
            this.Line1 = l1;
            this.Line2 = l2;
            
            const MSG_TIME = 2;
            
            this.Tween.New(this.Tutorial)
                .Delay(MSG_TIME)
                .Then()
                .To({Alpha: 0}, 1)
                .Then(this.Face)
                .To({Alpha: 1})
                // 
                .WhenDone(() => {
                    l1.SetText("TO KILL");
                    l2.SetText("A DEMON");
                })
                .Then(this.Tutorial)
                .To({Alpha: 1}, 1)
                .Then()
                .Delay(MSG_TIME)
                .Then()
                .To({Alpha: 0})
                //
                .WhenDone(() => {
                    l1.SetText("HIT HIM");
                    l2.SetText("IN THE LIPS");
                })
                .Then()
                .To({Alpha: 1})
                .Then()
                .Delay(MSG_TIME)
                .Then()
                .To({Alpha: 0})
               
                //
                .Then(this.Mouth)
                .To({Alpha: 1})
                .WhenDone(() => {
                    this.TimeScale = 2;
                    this.Gravity.Set(0, 80);
                    this.TeethVelocity.Set(-10, 0);
                })
                .Start();
            
            
            msgs.AddChild(l1, l2);
            this.Tutorial.AddChild(msgs);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            super.DrawSelf(ctx);
            this.Tutorial.Draw(ctx);
        }
        
        Flap(): void
        {
            this.Timers.Throttle(0.05, this.FastForward, this);
        }
        
        FastForward(): void
        {
            this.Update(0.5);
        }
        
        protected PlayerTakeDamage(): void
        {
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            this.PlayerVelocity.Set(0, 0);
            this.TimeScale = 1;
            
            this.Line1.SetText("AVOID HIS");
            this.Line2.SetText("TEETH");
                    
            this.Tween.New(this.Mouth)
                .To({Alpha: 0})
                .Then(this.Tutorial)
                .To({Alpha: 1})
                .Then()
                .Delay(2)
                .Then()
                .To({Alpha: 0})
                //
                .WhenDone(() => {
                    this.Line1.SetText("NOW IS YOUR")
                    this.Line2.SetText("TURN")
                })
                .Then(this.Tutorial)
                .To({Alpha: 1})
                .Then()
                .Delay(2)
                .Then()
                .To({Alpha: 0})
                //
                .WhenDone(() => {
                    this.Line1.SetText("PRESS UP OR");
                    this.Line2.SetText("SPACE TO FLAP");
                })
                .Then()
                .To({Alpha: 1})
                .Then()
                .Delay(2)
                .Then()
                .To({Alpha: 0})
                
                .WhenDone(() => {
                    context.SetPlayerSawTutorial();
                    context.PlayState.BeginFigthMode(this.DemonName);   
                })
                .Start();
        }
    }
    
}