/// <reference path="../core/Features.ts" />
/// <reference path="../declare/Howler.d.ts" />


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
                audio.volume = volume * this.Volume;
			    audio.play();
            }
		}
	}
	
	class HowlerAudioManager
	{
		Sounds: {[id: string]: Howl} = {};
		
		PlayingSounds: Howl[] = [];
		
		GetVolume(): number
		{
			return Howler.volume();
		}
		
		SetVolume(value: number): void
		{
			Howler.volume(value);
		}
		
		Play(name: string, volume = 1, loop = false)
		{
			let sound = this.Sounds[name];
			if (sound) {
				sound.loop(loop);
				sound.volume(volume);
				sound.play();
				if (this.PlayingSounds.indexOf(sound) === -1) {
					this.PlayingSounds.push(sound);
					sound.onend = () => {
						core.TryRemoveElement(this.PlayingSounds, sound);
					}
				}
			}
			else {
				throw new Error(`Sound with name ${name} doesn't exist in this manager.`);
			}
		}
		
		StopAll(): void
		{
			this.PlayingSounds.forEach(sound => sound.stop());
			this.PlayingSounds.length = 0;
		}
		
		FadeOutAll(duration = 2): void
		{
			this.PlayingSounds.forEach(sound => sound.fade(1, 0, duration));
		}
		
		LoadSound(name: string, urls: string[]): Promise<Howl>
		{
			return new Promise<Howl>((resolve, reject) => {
				let howl = new Howl({
					'urls': urls,
					'onload': () => resolve(howl),
					'onloaderror': (e) => reject(e)
				})
			}).then(howl => this.Sounds[name] = howl);
		}
		
		
		LoadAll(sounds: [string, string[]][]): Promise<Howl[]>
		{
			return Promise.all(sounds.map(([name, url]) => this.LoadSound(name, url)));
		}	
	}
	
	// export var manager = new AudioManager();
	export var manager = new HowlerAudioManager();
}
