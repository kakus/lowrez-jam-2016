/// <reference path="../core/Features.ts" />

namespace audio {
	
	declare function jsfxr(data: number[]): any;
	
	class AudioManager
	{
		Sounds: {[key: string]: {index: number, pool: HTMLAudioElement[] }} = {};
        
        Volume: number = 1;
		
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
		
		Play(key: string, volume: number = 1)
		{
			let sound = this.Sounds[key],
				audio = sound.pool[(sound.index++)%sound.pool.length];
				
            if (audio)
            {
                console.log("playing " + key);
                audio.volume = volume * this.Volume;
			    audio.play();
            }
		}
	}
	
	export var manager = new AudioManager();
}
