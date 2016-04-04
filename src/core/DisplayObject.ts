/// <reference path="Vector2.ts" />

namespace core {
	
	export abstract class DisplayObject
	{
		Position: Vector;
		Anchor: Vector;
		Size: Vector;
		Scale: Vector;
		Rotation: number;
		Alpha: number;
		Parent: Layer<DisplayObject>;
		Visible: boolean;
		CachedObject: HTMLCanvasElement;
		
		static GlobalCache: {[key:string]: HTMLCanvasElement} = {};
		
		constructor(x: number, y: number, width: number, height: number)
		{
			this.Position = vector.New(x, y);
			this.Size = vector.New(width, height);
			this.Anchor = vector.New(0, 0);
			this.Scale = vector.New(1, 1);
			this.Rotation = 0;
			this.Alpha = 1;
			this.Visible = true;
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			if (!this.Visible) return;

			ctx.save();
			ctx.globalAlpha *= this.Alpha;

			ctx.translate(this.Position.x, this.Position.y);
			ctx.scale(this.Scale.x, this.Scale.y);
			ctx.rotate(this.Rotation);

			if (!vector.IsZero(this.Anchor))
			{
				ctx.translate(-this.Anchor.x * this.Size.x, - this.Anchor.y * this.Size.y);
			}

			this.CachedObject ? this.DrawCache(ctx) : this.DrawSelf(ctx);

			ctx.restore();
		}
		
		protected abstract DrawSelf(ctx: CanvasRenderingContext2D): void;
		
		private DrawCache(ctx: CanvasRenderingContext2D): void
		{
			ctx.drawImage(this.CachedObject, 0, 0, this.Size.x, this.Size.y);
		}
		
		ToLocal(point: IVector): Vector;
		ToLocal(point: IVector, out: IVector): void;
		ToLocal(point: IVector, out?: IVector)
		{
			let local: IVector, tmp = vector.Tmp;
			
			if (out) {
				vector.Clone(point, out);
				local = out;
			}
			else {
				local = vector.Clone(point);
			}
			
			if (this.Parent) {
				this.Parent.ToLocal(point, local);
			}
			
			// Translation
			vector.Subtract(local, this.Position, local);
			// Scale
			vector.Clone(this.Scale, tmp);
			vector.Invert(tmp, tmp);
			vector.Multiply(local, tmp, local);
			// Rotation
			vector.Rotate(local, -this.Rotation, local);
			// Anchor Translation
			vector.Clone(this.Anchor, tmp);
			vector.Multiply(tmp, this.Size, tmp);
			vector.Add(local, tmp, local);
			
			if (!out) return <Vector>local;
		}
		
		ToGlobal(point: IVector): Vector;
		ToGlobal(point: IVector, out: IVector): void;
		ToGlobal(point: IVector, out?: IVector)
		{
			let global = out ? out : vector.New(), tmp = vector.Tmp;
			
			// Anchor
			vector.Clone(this.Anchor, tmp);
			vector.Multiply(tmp, this.Size, tmp)
			vector.Subtract(point, tmp, global);
			// Rotation
			vector.Rotate(global, this.Rotation);
			// Scale
			vector.Multiply(global, this.Scale, global);
			// Translate
			vector.Add(global, this.Position, global);
			
			if (this.Parent) {
				this.Parent.ToGlobal(global, global);
			}
			
			if (!out) return <Vector>global;
		}
		
		IsPointInside(point: IVector, globalPoint = true, extents = core.vector.Zero): boolean
		{
			let p = globalPoint ? this.ToLocal(point) : core.vector.Clone(point);
			
			let xAxis = p.x > -extents.x && p.x < this.Size.x + extents.x;
			let yAxis = p.y > -extents.y && p.y < this.Size.y + extents.y;
			return xAxis && yAxis;
		}
		
		/**
		 * Check if this object is visible and also his parent and so on ...
		 */
		IsVisible(): boolean
		{
			if (this.Parent)
			{
				return this.Visible && this.Parent.IsVisible();
			}
			return this.Visible;
		}
		
		RemoveFromParent(): void
		{
			this.Parent.RemoveChild(this);
		}
		
		/**
		 * @param setup callback used to setup canvas context before drawing this object
		 * @param scale if you want to cache sprite in higher resolution increase the scale
		 * @param key if you want to store this object in global cache please provide a key,
		 * 		  if key exist in global cache this sprite will be using stored cache instead
		 * 		  of creating new one.
		 */
		Cache(scale: number = 1, key?: string, setup?: (ctx: CanvasRenderingContext2D) => void): void
		{
			let cache: HTMLCanvasElement;
			
			if (key && (cache = DisplayObject.GlobalCache[key]))
			{
				this.CachedObject = cache;
				return;
			}
			
			cache = this.CachedObject = document.createElement('canvas');
			cache.width = this.Size.x * scale;
			cache.height = this.Size.y * scale;
			if (key) DisplayObject.GlobalCache[key] = cache;
			
			let ctx = cache.getContext('2d');
			ctx.scale(scale, scale);
			
			if (setup) setup(ctx);
			
			this.DrawSelf(ctx);
		}
	}
	
	export class Layer<T extends DisplayObject> extends DisplayObject
	{
		Children: T[] = [];
		
		constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
		{
			super(x, y, width, height);
		}
		
		AddChild(...childs: T[]): void
		{
			for (let child of childs)
			{
				if (child.Parent)
				{
					throw Error("Child has parent");
				}
				else
				{
					child.Parent = this;
					this.Children.push(child);
				}
			}
		}
		
		RemoveChild(child: T): void
		{
			let index = this.Children.indexOf(child);
			if (index >= 0)
			{
				child.Parent = undefined;
				this.Children.splice(index, 1);
			}
			else
			{
				throw Error("Child doesn't exist in this layer");
			}
		}
		
		DrawSelf(ctx: CanvasRenderingContext2D): void
		{
			for (let child of this.Children)
			{
				child.Draw(ctx);
			}
		}	
	}
	
	
}
