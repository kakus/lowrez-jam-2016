/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../gfx/Sprite.ts" />

namespace state {
	
	export class LoadingState extends AbstractState
	{
		
		Start(): void
		{
			this.DefaultSize.Set(64, 64);
			super.Start();
		
			let txt = new gfx.AAText(15, 30, "LOADING")
			txt.SetSize(5);
			
			let dots = "";			
			this.Timers.Repeat(0.5, () => {
				if (dots.length === 3) {
					dots = "";
				}
				else {
					dots += ".";
				}
				txt.SetText("LOADING " + dots);	
			});
			
			this.Stage.AddChild(txt);
			
			gfx.Sprite.Load(
                ['spritesheet', 'assets/images/spritesheet.png']
            ).then(() => {
                this.Game.Play('menu');
            });
			
			this.OnResize();
		}
	}
	
}
