namespace core {
	
	export class RgbColor
	{
		constructor(
			public r: number,
			public g: number,
			public b: number,
			public a: number = 1
		) {
			this.r = Math.round(r);
			this.g = Math.round(g);
			this.b = Math.round(b);
		}
		
		ToHSV(): HsvColor 
		{
			let {r, g, b} = this,
				max = Math.max(r, g, b), min = Math.min(r, g, b),
				d = max - min,
				h,
				s = (max === 0 ? 0 : d / max),
				v = max / 255;

			switch (max) {
				case min: h = 0; break;
				case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
				case g: h = (b - r) + d * 2; h /= 6 * d; break;
				case b: h = (r - g) + d * 4; h /= 6 * d; break;
			}
			
			return new HsvColor(h, s, v, this.a);
		}
		
		toString(): string
		{
			return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
		}
	}
	
	export class HsvColor
	{
		constructor(
			public h: number,
			public s: number,
			public v: number,
			public a: number = 1
		) { }
		
		ToRGB(): RgbColor
		{
			let {h, s, v} = this, i = Math.floor(h * 6),
				f = h * 6 - i,
				p = v * (1 - s),
				q = v * (1 - f * s),
				t = v * (1 - (1 - f) * s),
				r, g, b;
				
			switch (i % 6) {
				case 0: r = v, g = t, b = p; break;
				case 1: r = q, g = v, b = p; break;
				case 2: r = p, g = v, b = t; break;
				case 3: r = p, g = q, b = v; break;
				case 4: r = t, g = p, b = v; break;
				case 5: r = v, g = p, b = q; break;
			}
			
			return new RgbColor(r * 255, g * 255, b * 255, this.a);
		}
		
		toString(): string
		{
			return `hsva(${this.h}, ${this.s}, ${this.v}, ${this.a})`;
		}
	}
	
}
