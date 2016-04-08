/// <reference path="Vector2.ts" />

namespace core {
    
    /**
     * Class represents 2 dimensional rectangle.
     */
    export class Rect
    {
        /** Position of top left corner. */
        Position: core.Vector;
        /** Width and height of the rectangle. */
        Size: core.Vector;
        
        constructor(
            x: number, y: number, width: number, height: number
        ) {
            this.Position = new core.Vector(x, y);
            this.Size = new core.Vector(width, height);    
        }
        
        Clone(out?: Rect): Rect
        {
            out = out || new Rect(0, 0, 0, 0);
            
            this.Position.Clone(out.Position);
            this.Size.Clone(out.Size);
            return out;
        }
        
        Expanded(amount: core.Vector): core.Rect
        {
            return new Rect(this.Position.x, this.Position.y, this.Size.x + amount.x, this.Size.y + amount.y);
        }
    }
}