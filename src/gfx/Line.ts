/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />

namespace gfx {
	
	export class Line extends core.DisplayObject
	{
		From = new core.Vector();
		To = new core.Vector();
		
		constructor(sx: number, sy: number, ex: number, ey: number, public Style?: IStyle)
		{
			super(0, 0, Math.abs(ex - sx), Math.abs(ey - sy));
			
			this.From.Set(sx, sy);
			this.To.Set(ex, ey);
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.beginPath();
			ctx.moveTo(this.From.x, this.From.y);
			ctx.lineTo(this.To.x, this.To.y);
			
			ctx.strokeStyle = 'red' || this.Style.strokeStyle;
			if (this.Style.lineDash) ctx.setLineDash(this.Style.lineDash);
			if (this.Style.lineWidth) ctx.lineWidth = this.Style.lineWidth;
			ctx.stroke();
		}	
	}
	
}
