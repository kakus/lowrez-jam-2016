/// <reference path="Sprite.ts" />
/// <reference path="../core/Assert.ts" />

namespace gfx {
    
    /**
     * A sprite factory, extracts sprites from image.
     */
    export class SpriteSheet
    {
        private ImageSize = new core.Vector();
        private GridSize = new core.Vector();
        
        constructor(
            public ImageId: string,
            public CellSize: number
        ) {
            let tileset = Sprite.ImageCache[ImageId]
             
            if (tileset)
            {
                this.ImageSize.Set(tileset.width, tileset.height);
                this.UpdateGridSize();
            }
            else 
            {
                throw new Error(`Tileset with given id ${ImageId} doesn't exsit.`);
            }
        }
        
        GetSprite(id: number): Sprite
        {
            core.Assert(id >= 1, "Sprites id have to be greater than 0.");
            return new gfx.Sprite(0, 0, this.ImageId, this.GetSourceRect(id));
        }
        
        GetSourceRect(id: number): core.Rect
        {
            if (id < 1) {
                return undefined;
            }
            id = id - 1;
            
            let x = id % this.GridSize.x;
            let y = Math.floor(id / this.GridSize.x);
            
            core.Assert(x < this.GridSize.x && y < this.GridSize.y, `Sprite id:${id} is out of bounds.`);
            
            return new core.Rect(x * this.CellSize, y * this.CellSize, this.CellSize, this.CellSize);
        }
        
        private UpdateGridSize(): void
        {
            let cols = this.ImageSize.x / this.CellSize;
            let rows = this.ImageSize.y / this.CellSize;
            
            core.Assert(cols % 1 === 0, "Width of image doesn't match grid size.");
            core.Assert(rows % 1 === 0, "Height of image doesn't match grid size.");
            
            this.GridSize.Set(cols, rows);
        }
    }
    
}