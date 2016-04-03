namespace gfx {
	
	export interface IStyle 
	{
		fillStyle?: string | CanvasGradient | CanvasPattern;
		strokeStyle?: string;
		compositeOperation?: string;
		lineWidth?: number;
		lineDash?: number[];
	}
	
}
