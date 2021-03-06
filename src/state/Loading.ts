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
			let timer = this.Timers.Repeat(0.5, () => {
				if (dots.length === 3) {
					dots = "";
				}
				else {
					dots += ".";
				}
				txt.SetText("LOADING " + dots);	
			});
			
			this.Stage.AddChild(txt);
			
			let sprites = gfx.Sprite.Load(
                ['spritesheet', 'assets/images/spritesheet.png']
            )
			
			let sounds = audio.manager.LoadAll([
				['fight-scene', ['assets/audio/fight-scene-music.mp3']],
				['fireplace', ['assets/audio/fireplace.mp3']],
				['monster-fight', ['assets/audio/monster-fight.wav']],
				['demon-slayed', ['assets/audio/demon-slayed.wav']],
				['demon-hit', ['assets/audio/demon-hit.wav']],
				['floor-collapsing', ['assets/audio/floor-collapsing.wav']],
				['item-aquired', ['assets/audio/item-aquired.wav']],
				['you-died', ['assets/audio/you-died.wav']],
				['temple', ['assets/audio/temple-music.mp3']]
			])
			
			Promise.all([sprites, sounds] as any[]).then(() => {
                this.Game.Play('splash');
			}, (e) => {
				timer.Stop();
				txt.SetText("ERROR");
				txt.SetColor('red');
				console.error(e);
			})
			
			this.OnResize();
		}
	}
	
}
