/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../gfx/Sprite.ts" />

namespace state {
	
	export class LoadingState extends AbstractState
	{
		Center = new core.Layer();
		
		Start(): void
		{
			super.Start();
			this.Game.Canvas.style.background = 'black';
			this.OnResize();
		
			let txt = new gfx.AAText(0, 0, "LOADING ...")
			txt.Anchor.Set(0.5, 0.5);
			this.Center.AddChild(txt);
			
			this.Stage.AddChild(this.Center);
			
			gfx.Sprite.Load(
				['taco', 'http://icons.iconarchive.com/icons/iconfactory/copland-2/32/taco-icon.png']
			)
			.then(() => {
				
				let taco = new gfx.Sprite(0, 0, 'taco');
				taco.Anchor.Set(0.5, 0.5);
				
				this.Tweens.New(taco.Size)
					.To({x: taco.Size.x * 2, y: taco.Size.y * 2})
					.Start();
					
				this.Center.AddChild(taco);
				txt.Visible = false;
				
				this.Timers.Delay(4, () => this.Game.Play('play'));
			})
		}
		
		OnResize(): void
		{
			super.OnResize();
			this.Center.Position.Set(this.Stage.Size.x/2, this.Stage.Size.y/3);
		}
	}
	
}
