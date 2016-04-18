/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />



namespace state {
    
    export class SplashScreen extends AbstractState 
    {
		
		BgScene: gfx.AnimatedSprite;

        /**
		 * Called once before first update
		 */
        Start() 
        {
            super.Start();
            
            const LINE_TIME = 5;
            let lastTween: core.Tween;
            
            [
				["GAME BY", "KAKUS"],
				["MADE WITH", "♥" ,"FOR", "LOWREZJAM", "2016"]
			].forEach((screen, i) => {
				
				let layer = new core.Layer(32, 32, 64, 0);
				layer.Anchor.Set(0, .5);
                layer.Alpha = 0;
				
				screen.forEach((line, j) => {
					let t = new gfx.AAText(0, 8 * j, line);
					t.SetSize(5);
					t.Anchor.Set(.5, .5);
                    if (line[0] === '♥') {
                        t.SetColor('red');
                    }
					layer.Size.y += t.Size.y + 3;
                    layer.AddChild(t);
				});
                
                this.Stage.AddChild(layer);
                
                lastTween = this.Tweens.New(layer)
                    .Delay(1 + i * LINE_TIME)
                    .Then()
                    .To({Alpha: 1}, 1)
                    .Then()
                    .Delay(LINE_TIME - 2)
                    .Then()
                    .To({Alpha: 0}, 1)
                    .Start();
			});
            
            lastTween.WhenDone(() => this.OnKeyDown(0));	               
            
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
            this.Game.Play('menu');
        }

    }

}
