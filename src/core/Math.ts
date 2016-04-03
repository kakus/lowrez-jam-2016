namespace core.math {
	
	let vec = core.vector;
	
	export function Clamp(value: number, min: number, max: number): number
	{
		return Math.max(Math.min(value, max), min);
	}
	
	export function DistanceP2L(point: IVector, a: IVector, b: IVector): number
	{
		let dir = vec.New(), a2p = vec.New();
		vec.Subtract(b, a, dir);
		vec.Subtract(point, a, a2p);
		
		let p = vec.Dot(a2p, dir) / vec.LengthSqr(dir);
		vec.Scale(dir, p);
		vec.Add(dir, a, dir);
		
		vec.Subtract(point, dir, dir);
		return vec.Length(dir);
	}
	
}
