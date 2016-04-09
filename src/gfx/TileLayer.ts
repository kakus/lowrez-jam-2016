/// <reference path="../core/DisplayObject.ts" />
/// <reference path="SpriteSheet.ts" />

namespace gfx {
    
    export class TileLayer extends core.Layer<gfx.Sprite>
    {
        public GridSize = new core.Vector();
        
        constructor(
            x: number, y: number,
            public TileSet: SpriteSheet,
            public Data: number[][],
            public CellSize = TileSet.CellSize
        ) { 
            super(x, y);
            this.BuildLayer();
        }
        
        private BuildLayer(): void
        {
            core.Assert(this.Data.length > 0, "Layer data can't be null.");
            core.Assert(this.Data.every(row => row.length === this.Data[0].length), "Each row has to have the same length.");
            
            this.Data.forEach((row, y) => {
                row.forEach((id, x) => {
                    if (id == 0) return;
                    
                    let tile = this.TileSet.GetSprite(id);
                    tile.Position.Set(x * this.CellSize.x, y * this.CellSize.y);
                    this.AddChild(tile);    
                });
            });
            
            this.GridSize.Set(this.Data[0].length, this.Data.length);
            core.vector.Multiply(this.GridSize, this.CellSize, this.Size);
        }
    }
}