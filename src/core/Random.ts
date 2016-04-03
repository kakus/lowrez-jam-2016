namespace core {
	
	export function Random(min: number, max: number): number
	{
		if (max < min) throw Error();
		return min + Math.random() * (max - min);
	}
	
	export function TossCoin<T, U>(a: T, b: U): T | U
	{
		return Math.random() > 0.5 ? a : b;
	}
	
	export function RandomElement<T>(array: Array<T>): T
	{
		return array[(Math.random() * array.length) | 0];
	}
	
}
