/// <reference path="../declare/es6-promise.d.ts" />

namespace core {
	
	export var ImageLoader = {
		
		load(url: string): Promise<HTMLImageElement>
		{
			return new Promise<HTMLImageElement>((resolve, reject) => {
				let img = new Image();
				
				img.onload = () => resolve(img);
				img.onerror = (e) => reject(e);
				img.src = url;
			});
		}
		
	}
	
}
