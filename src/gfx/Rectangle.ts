/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />

namespace gfx {
	
	export class Rectangle extends core.DisplayObject
	{
	
		constructor(
			x: number, y: number, width: number, height: number,
			
			public Style: IStyle = {fillStyle: 'red'}
		) {
			super(x, y, width, height);
		}
		
		protected DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			if (this.Style.compositeOperation)
			{
				ctx.globalCompositeOperation = this.Style.compositeOperation;
			}
			if (this.Style.fillStyle)
			{
				ctx.fillStyle = this.Style.fillStyle;
				ctx.fillRect(0, 0, this.Size.x, this.Size.y);
			}
			if (this.Style.strokeStyle)
			{
				ctx.lineWidth = this.Style.lineWidth || 1;
				ctx.strokeStyle = this.Style.strokeStyle;
				ctx.strokeRect(0, 0, this.Size.x, this.Size.y);
			}
		}
		
	}
	
}
