/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../core/Tween.ts" />

namespace state {
	
	export class SplashScreen extends AbstractState
	{
		Title: core.Layer<core.DisplayObject>;
		
		Start(): void
		{
			super.Start();
			this.Game.Canvas.style.background = 'black';
		
			this.Title = new core.Layer();
			this.Title.Scale.Set(0.5, 0.5);
				
			let line1 = new gfx.AAText(0, 0, "A GAME BY KAKUS");
			line1.Anchor.Set(0.5, 0.5);
			
			let line2 = new core.Layer(0 , line1.Size.y + 10);
			
			let made = new gfx.AAText(0, 0, "MADE WITH ");
			
			let heart = new gfx.AAText(made.Size.x, 0, "♥");
			heart.SetColor('red');
			
			let js13k = new gfx.AAText(heart.Position.x + heart.Size.x, 0, " FOR TADZIK");
			
			line2.Anchor.Set(0.5, 0.5);
			line2.Size.Set(js13k.Position.x + js13k.Size.x, js13k.Size.y);
			line2.AddChild(made, heart, js13k);
			
			let year = new gfx.AAText(0, line2.Position.y + 300, "2016");
			year.Anchor.Set(0.5, 0.5);
			
			this.Title.AddChild(line1)
			this.Title.AddChild(line2)
			this.Title.AddChild(year)
			
			this.Stage.Alpha = 0;
			this.Tweens.New(this.Stage)
				.To({Alpha: 1})
				.Then()
				.Delay(1)
				.Then()
				.To({Alpha: 0})
				.WhenDone(() => this.Game.Play('menu'))
				.Start();
			
			this.Stage.AddChild(this.Title);
			this.OnResize();
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/3);
		}
	}
	
}
