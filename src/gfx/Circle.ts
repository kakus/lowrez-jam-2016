/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />

namespace gfx {
	
	export class Circle extends core.DisplayObject
	{
	
		Angle = {
			Start: 0,
			Stop: Math.PI * 2
		};
		
		constructor(
			x: number, y: number,
			
			radious: number,
			public Style: IStyle = {fillStyle: 'red'}
		) {
			super(x, y, radious * 2, radious * 2);
			if (radious <= 0) throw Error();	
		}
		
		protected DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			let radious = this.Size.x/2;
			
			ctx.beginPath();
			ctx.arc(radious, radious, radious - 1, this.Angle.Start, this.Angle.Stop);
			
			if (this.Style.compositeOperation)
			{
				ctx.globalCompositeOperation = this.Style.compositeOperation;
			}
			if (this.Style.lineWidth)
			{
				ctx.lineWidth = this.Style.lineWidth;
			}
			if (this.Style.fillStyle)
			{
				ctx.fillStyle = this.Style.fillStyle;
				ctx.fill();
			}
			if (this.Style.strokeStyle)
			{
				ctx.strokeStyle = this.Style.strokeStyle;
				ctx.stroke();
			}
			
		}
		
	}
}
