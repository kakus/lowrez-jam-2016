namespace core {
	
	export function RemoveElement<T>(array: Array<T>, element: T): T[]
	{
		let i = array.indexOf(element);
		if (i >= 0)
		{
			return array.splice(i, 1);
		}
		else throw new Error();
	}
	
	/**
	 * If element doesn't exist in collection, nothing happens.
	 */
	export function TryRemoveElement<T>(array: Array<T>, element: T): T[]
	{
		let i = array.indexOf(element);
		if (i >= 0)
		{
			return array.splice(i, 1);
		}
	}
	
	export function Last<T>(array: Array<T>): T
	{
		return array[array.length - 1];
	}
    
    export function Clone<T>(array: Array<T>): Array<T>
    {
        return array.slice(0);
    }
    
    /**
     * @return new array, with elements shuffled.
     */
    export function ShuffleArray<T>(array: Array<T>): Array<T> 
    {
        array = Clone(array);
        
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
	
	// export function Brightness(base: string, brightess: number): string
	// {
	// 	let rgb = base.substr(1).match(/.{2}/g).map((v) => parseInt(v, 16));
	// 	rgb = rgb.map((v) => Math.min(v * brightess, 255)|0);
	// 	let hex = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
	// 	return '#' + (hex + 0x1000000).toString(16).substr(1);
	// }
	
	export function IsPointInside(point: core.IVector, obj: {Position: core.IVector, Size: core.IVector, Anchor: core.IVector}): boolean
	{
		let pos = vector.Tmp;
		
		vector.Clone(obj.Anchor, pos);
		vector.Multiply(pos, obj.Size, pos);
		vector.Subtract(obj.Position, pos, pos);
		
		return point.x > pos.x &&
			point.x < pos.x + obj.Size.x &&
			point.y > pos.y &&
			point.y < obj.Size.y + pos.y;
	}
	
	export class FPSMeter
	{
		Probes: number[];
		ProbeIdx: number = 0;
		
		constructor(public ProbeNum: number = 60)
		{
			this.Probes = new Array(ProbeNum);
			for (let i = 0; i < ProbeNum; ++i) this.Probes[i] = 0;	
		}
		
		Update(timeDelta: number): void
		{
			this.Probes[(this.ProbeIdx++)%this.ProbeNum] = timeDelta;
		}
		
		GetFPS(): number
		{
			return 1 / this.GetAvgFrameTime();
		}
		
		GetAvgFrameTime(): number
		{
			let avg = 0;
			for (let i = 0; i < this.ProbeNum; ++i) avg += this.Probes[i];
			return avg / this.ProbeNum;
		}
	}
	
	export class CallbackSet<T extends Function>
	{
		Callbacks: Array<[T, any, boolean]> = [];
		
		Add(callback: T, ctx?): CallbackSet<T>
		{
			this.Callbacks.push([callback, ctx, false]);
			return this;
		}
		
		AddOnce(callback: T, ctx?): CallbackSet<T>
		{
			this.Callbacks.push([callback, ctx, true]);
			return this;
		}
		
		CallAll(...args: any[]): void
		{
			for(let i = this.Callbacks.length - 1; i >= 0; --i)
			{
				let [callback, ctx, remove] = this.Callbacks[i];
				
				callback.apply(ctx, args);
				
				if (remove)
				{
					this.Callbacks.splice(i, 1);
				}
			}
		}
		
	}
	
}
