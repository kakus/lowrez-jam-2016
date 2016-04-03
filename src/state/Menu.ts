/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../core/Tween.ts" />
/// <reference path="../core/Random.ts" />
/// <reference path="../audio/AudioManager.ts" />

namespace state {
	
	export class Menu extends AbstractState
	{
		Title: core.Layer<core.DisplayObject>;
		
		Start(): void
		{
			super.Start();
			this.Game.Canvas.style.background = 'black';
		
			this.Title = new core.Layer();
				
			let line1 = new gfx.AAText(0, 0, "SUPER");
			line1.Anchor.Set(0.5, 0.5);
			
			let line2 = new gfx.AAText(0, 25, "SPACE");
			line2.Anchor.Set(0.5, 0.5);
			
			let line3 = new gfx.AAText(0, 50, "SHOOTER");
			line3.Anchor.Set(0.5, 0.5);
			
			let line4 = new gfx.AAText(0, 75, "64");
			line4.Anchor.Set(0.5, 0.5);
			
			let playBtn = new gfx.AAText(0, 150, "PLAY");
			playBtn.Anchor.Set(0.5, 0.5);
			
			[line1, line2, line3, line4, playBtn].forEach((l, i) => {
				
				l.Scale.Set(5, 5);
				l.Alpha = 0
				this.Tweens.New(l.Scale)
					.Delay(i * 0.5)
					.Then()
					.To({x: 1, y: 1}, 0.5, core.easing.OutCubic)
					.Parallel(l, (t) => t.To({Alpha: 1}))
					.Start();
				
				this.Timers.Delay(i * 0.5 + 0.45, () => this.CameraShake(0.2))
			});
			
			this.Title.AddChild(line1, line2, line3, line4, playBtn);
			this.Stage.AddChild(this.Title);
			
			this.InputController = new core.GenericInputController()
				.WhenPointerClick(playBtn, () => this.Game.Play('play'));
				
			this.ListenForMouseInput();
			this.ListenForTouchInput();
				
			this.OnResize();
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Title.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/3);
		}
		
		CameraShake(duration = 0.3, strength = 5): void
		{
			this.Tweens.New(this.Stage)
				.Delay(duration)
				.OnUpdate((_, p) => {
					p = 1 - p;
					this.Stage.Position.x = core.Random(-strength * p, strength * p);
					this.Stage.Position.y = core.Random(-strength * p, strength * p);
				})
				.WhenDone(() => this.Stage.Position.Set(0, 0))
				.Start();
		}
	}
}
