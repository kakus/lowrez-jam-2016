/// <reference path="../core/DisplayObject.ts" />

namespace gfx {
	
	export class SymetricPolygon extends core.DisplayObject
	{
		protected Vertices: Float32Array;
		
		Style = {
			fill: 'red',
			stroke: 'white'
		}
		
		constructor(x: number, y: number)
		{
			super(x, y, 0, 0);
		}
		
		SetVertices(vertices: number[], scale = 1)
		{
			if ((vertices.length & 1) || (vertices.length < 4)) throw Error();
			
			this.Vertices = new Float32Array(vertices.length);
			
			for (var i = 0; i < vertices.length; i++)
			{
				let vertex = vertices[i] * scale;
				
				if (vertex < 0) throw Error();
				
				if (i & 1) 
				{
					this.Size.y = Math.max(this.Size.y, vertex);
				}	
				else 
				{
					this.Size.x = Math.max(this.Size.x, vertex * 2);
				}	
				
				this.Vertices[i] = vertex;
			}
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			if (!this.Vertices) return;
			
			ctx.translate(this.Size.x/2, 0);
			
			ctx.beginPath();
			ctx.moveTo(this.Vertices[0], this.Vertices[1]);
			for(let i = 2; i < this.Vertices.length; i += 2)
			{
				ctx.lineTo(this.Vertices[i], this.Vertices[i + 1]);
			}
			
			for(let i = this.Vertices.length - 2; i >= 0; i -= 2)
			{
				if (this.Vertices[i] === 0) continue;
				ctx.lineTo(-this.Vertices[i], this.Vertices[i + 1]);
			}
			ctx.closePath();
			
			
			if (this.Style.stroke)
			{
				ctx.strokeStyle = this.Style.stroke;
				ctx.stroke();
			}
			if (this.Style.fill)
			{
				ctx.fillStyle = this.Style.fill;
				ctx.fill();
			}
		}
	}

}
