/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />

namespace gfx {
	
	export class Polygon extends core.DisplayObject
	{
		Vertices: Array<core.Vector>;
		
		Style: IStyle = {
			strokeStyle: 'red'
		}
		
		SetVertices(vertices: number[], scale = 1): void
		{
			if (!vertices || vertices.length < 6 || vertices.length & 1) throw Error();
			
			this.Vertices = new Array<core.Vector>(vertices.length/2);
			
			let minX = 0, maxX = 0, minY = 0, maxY = 0;
			for (var i = 0; i < vertices.length; i += 2)
			{
				let vertex = new core.Vector(vertices[i] * scale, vertices[i + 1] * scale);
				this.Vertices[i/2] = vertex;
				
				minX = Math.min(minX, vertex.x);	
				maxX = Math.max(maxX, vertex.x);
					
				minY = Math.min(minY, vertex.y);	
				maxY = Math.max(maxY, vertex.y);	
			}
			
			this.Size.Set(maxX - minX, maxY - minY);	
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			ctx.beginPath();
			ctx.moveTo(this.Vertices[0].x, this.Vertices[0].y);
			for (var i = 1; i < this.Vertices.length; ++i)
			{
				ctx.lineTo(this.Vertices[i].x, this.Vertices[i].y);
			}
			ctx.closePath();
			
			if (this.Style.strokeStyle)
			{
				ctx.strokeStyle = this.Style.strokeStyle;
				ctx.stroke();
			}
			if (this.Style.fillStyle)
			{
				ctx.fillStyle = this.Style.fillStyle;
				ctx.fill();
			}
		}
		
		IsPointInside(point: core.IVector, globalPoint = true): boolean
		{
			let local = globalPoint ? this.ToLocal(point) : point;
			return IsPointInPolyogn(local, this.Vertices.concat(this.Vertices[0]));
		}
	}
	
		
	/**
	 * It's a Equilateral triangle.
	 */
	export class Triangle extends Polygon
	{
		constructor(x: number, y: number, base: number)
		{
			super(x, y, 0, 0);
			
			this.SetVertices([
				1/2, 0,
				1, Math.SQRT2/2,
				0, Math.SQRT2/2
			], base);
		}
	}
	
	// Copyright 2000 softSurfer, 2012 Dan Sunday
	// This code may be freely used, distributed and modified for any purpose
	// providing that this copyright notice is included with it.
	// SoftSurfer makes no warranty for this code, and cannot be held
	// liable for any real or imagined damage resulting from its use.
	// Users of this code must verify correctness for their application.
	
	// Tests if a point is Left|On|Right of an infinite line.
	//    Input:  three points P0, P1, and P2
	//    Return: >0 for P2 left of the line through P0 and P1
	//            =0 for P2  on the line
	//            <0 for P2  right of the line
	//    See: Algorithm 1 "Area of Triangles and Polygons"
	function IsLeft(P0: core.IVector, P1: core.IVector, P2: core.IVector): number
	{
		return ((P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y));
	}
	
	// wn_PnPoly(): winding number test for a point in a polygon
	//      Input:   P = a point,
	//               V[] = vertex points of a polygon V[n+1] with V[n]=V[0]
	//      Return:  wn = the winding number (=0 only when P is outside)
	function IsPointInPolyogn(P: core.IVector, V: core.IVector[], n = V.length - 1): boolean
	{
		let wn = 0;    // the  winding number counter
	
		// loop through all edges of the polygon
		for (let i = 0; i < n; i++) {		// edge from V[i] to  V[i+1]
			if (V[i].y <= P.y) {			// start y <= P.y
				if (V[i + 1].y > P.y)		// an upward crossing
					if (IsLeft(V[i], V[i + 1], P) > 0)  // P left of  edge
						++wn;				// have  a valid up intersect
			}
			else {							// start y > P.y (no test needed)
				if (V[i + 1].y <= P.y)		// a downward crossing
					if (IsLeft(V[i], V[i + 1], P) < 0)  // P right of  edge
						--wn;				// have  a valid down intersect
			}
		}
		return wn != 0;
	}
}
