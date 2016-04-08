/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/TileLayer.ts" />
/// <reference path="Assets.ts" />
/// <reference path="PurgatoryData.ts" />
/// <reference path="actors/AHero.ts" />
/// <reference path="actors/AFloatingTile.ts" />
/// <reference path="Context.ts" />



namespace game {
    
    export enum MoveDirection {
        LEFT, RIGHT, UP
    }
    
    export class Purgatory extends core.Layer<core.DisplayObject>
    {
        Player: AHero;
        TileSet: gfx.SpriteSheet;
        
        // first layer to be rendered.
        GroundLayer = new core.Layer<Actor>();
        // 2d array of references to ground tiles.
        // first acces is row and the cols, so actor = GroundLookup[y][x]
        GroundLookup: Actor[][] = [];
        // living object rendered on top of other layers.
        ActorLayer = new core.Layer<Actor>();
                
        constructor(x: number, y: number)
        {
            super(x, y);
            game.context.Purgatory = this;
            
            this.TileSet = new gfx.SpriteSheet('spritesheet', 24);
            
            this.BuildTileLayers();
            this.SpawnPlayer();
        }
        
        Update(timeDelta: number): void
        {
            for (let actor of this.GroundLayer.Children)
            {
                actor.Update(timeDelta);
            }
            for (let actor of this.ActorLayer.Children)
            {
                actor.Update(timeDelta);
            }
        }
        
        MovePlayer(dir: MoveDirection): void
        {
            if (this.Player.Tween.TweenPlaying()) return;
            
            console.log ("moving player to " + dir);
            
            let dest = this.Player.GridPosition.Clone();
            
            switch (dir) {
                case MoveDirection.LEFT: dest.x -= 1; break;
                case MoveDirection.UP: dest.y -= 1; break;
                case MoveDirection.RIGHT: dest.x += 1; break;
            }
            
            if (this.CanMoveTo(dest))
            {
                let {x, y} = this.Player.GridPosition;
                (this.GroundLookup[y][x] as AFloatingTile).Collapse();
                
                dest.Clone(this.Player.GridPosition);
                
                var pos = this.GridPosToLayerPos(this.Player.GridPosition);
                this.Player
                    .PlayJump(pos)
                    .WhenDone(() => this.SpecialAction(this.Player.GridPosition));
            }
            else
            {
                console.log("can't move to " + dest);
            }
            
        }
        
        GridPosToLayerPos(grid: core.Vector, out = new core.Vector()): core.Vector
        {
            core.vector.Scale(grid, this.TileSet.CellSize, out);
            return out;
        }
        
        private SpecialAction(gridPos: core.Vector): boolean
        {
            if (gridPos.x === 3 && gridPos.y === 0)
            {
                this.Player.GridPosition.Set(2, 3);
                this.GridPosToLayerPos(this.Player.GridPosition, this.Player.Position);
                this.GroundLayer.Children.forEach(g => (g as AFloatingTile).Restore());
            }            
            return false;
        }
        
        private CanMoveTo(gridPos: core.Vector): boolean
        {
            let tile = this.GroundLookup[gridPos.y][gridPos.x];
            if (tile && tile.IsActive === false)
            {
                return false;
            }
            
            const row = game.data.layer.collision[gridPos.y]
            
            if (row)
            {
                return row[gridPos.x] !== undefined && 
                       game.data.layer.collision[gridPos.y][gridPos.x] === 0;
            }
            
            return false; 
        }
        
        private BuildTileLayers(): void
        {
            this.CheckLayers();
            
            data.layer.ground.forEach((row, y) => {
                this.GroundLookup.push([]);
                
                row.forEach((tileId, x) => {
                  if (tileId === 0) return;
                  let tile = new AFloatingTile(0, 0, this.TileSet);
                  tile.GridPosition.Set(x, y);
                  core.vector.Scale(tile.GridPosition, this.TileSet.CellSize, tile.Position);
                  
                  this.GroundLookup[y][x] = tile;
                  this.GroundLayer.AddChild(tile);
                });
            });
            
            this.AddChild(this.GroundLayer);
            this.AddChild(this.ActorLayer);
        }
        
        private SpawnPlayer(): void
        {
            this.Player = new AHero(0, 0, this.TileSet);
            this.Player.GridPosition.Set(2, 3);
            this.GridPosToLayerPos(this.Player.GridPosition, this.Player.Position);
            this.ActorLayer.AddChild(this.Player);
        }
        
        private CheckLayers(): void
        {
            var layers = [game.data.layer.collision,
                game.data.layer.ground,
                game.data.layer.static];
                
            core.Assert(layers.every(layer => {
                return layer.length === game.data.layer.collision.length &&
                       layer.every(row => row.length === game.data.layer.collision[0].length);
            }), "Each layer has to have the same size.");
        }
    }
    
}