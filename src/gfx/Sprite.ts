/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/ImageLoader.ts" />
/// <reference path="../core/Rect.ts" />

namespace gfx {
	
	export class Sprite extends core.DisplayObject
	{
		static ImageCache: {[key:string]: HTMLImageElement} = {};
		
		Image: HTMLImageElement;
        SourceRect: core.Rect;
		
		constructor(x: number, y: number, key: string, sourceRect?: core.Rect)
		{
			super(x, y, 0, 0);
			
			if (this.Image = Sprite.ImageCache[key])
			{
                this.SourceRect = sourceRect ? sourceRect.Clone() 
                    : new core.Rect(0, 0, this.Image.width, this.Image.height);
                    
                this.SourceRect.Size.Clone(this.Size);
			}
			else throw Error(`Couldn't find ${key} in cache`);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			if (this.Image)
			{
				ctx.drawImage(
                    this.Image, 
                    this.SourceRect.Position.x, this.SourceRect.Position.y,
                    this.SourceRect.Size.x, this.SourceRect.Size.y,
                    0, 0, this.Size.x, this.Size.y);
			}
			else
			{
				ctx.fillStyle = 'black';
				ctx.strokeStyle = 'red';
				
				ctx.rect(0, 0, this.Size.x, this.Size.y);
				
				ctx.fill();
				ctx.stroke();
			}
		}
		
		/**
		 * @param urls [key, url]
		 */
		static Load(...urls: [string, string][]): Promise<HTMLImageElement[]>
		{
			return Promise.all(urls.map(([key, url]) => {
				
				return core.ImageLoader.load(url).then((img) => Sprite.ImageCache[key] = img)
				
			}));
		}	
	}
	
}
