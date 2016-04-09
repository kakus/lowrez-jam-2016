/// <reference path="../Actor.ts" />
/// <reference path="../../gfx/Text.ts" />

namespace game {
    
    export class AText extends Actor {
        
        Label: gfx.AAText;
        
        constructor(x: number, y: number, txt: string)
        {
            super(x, y, 0, 0);
            this.Label = new gfx.AAText(0, 0, txt);
            this.Label.SetSize(5);
            this.Label.Size.Clone(this.Size);    
        }
        
        Start() 
        {
            
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Label.Draw(ctx);
        }
            
    }
    
}