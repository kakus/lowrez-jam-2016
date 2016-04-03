/// <reference path="../core/Features.ts" />

namespace audio {
	
	declare function jsfxr(data: number[]): any;
	
	class AudioManager
	{
		Sounds: {[key: string]: {index: number, pool: HTMLAudioElement[] }} = {};
		
		AddSound(key: string, data: number[], poolCount = 1): void
		{
			let pool = [];
			
			poolCount = core.features.IsMobileBrowser ? 0 : poolCount;
			
			
			for (let i = 0; i < poolCount; ++i)
			{
				let soundURL = jsfxr(data);
				let audio = new Audio();
				audio.src = soundURL;
				pool.push(audio);
			}
			
			this.Sounds[key] = {
				index: 0,
				pool: pool
			};
		}
		
		Play(key: string)
		{
			return;
			
			let sound = this.Sounds[key],
				audio = sound.pool[(sound.index++)%sound.pool.length];
				
			audio && audio.play();
		}
	}
	
	export var manager = new AudioManager();
}
