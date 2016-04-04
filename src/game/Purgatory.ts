/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/TileLayer.ts" />
/// <reference path="Assets.ts" />
/// <reference path="PurgatoryData.ts" />
/// <reference path="Hero.ts" />


namespace game {
    
    export enum MoveDirection {
        LEFT, RIGHT, UP
    }
    
    export class Purgatory extends core.Layer<core.DisplayObject>
    {
        Player: Hero;
        TileSet: gfx.SpriteSheet;
        
        // first layer to be rendered.
        GroundLayer: gfx.TileLayer;
        // layer rendered on top of ground, nothing can move.
        StaticLayer: gfx.TileLayer;
        // living object rendered on top of other layers.
        ActorLayer = new core.Layer<Actor>();
                
        constructor(x: number, y: number)
        {
            super(x, y);
            
            this.TileSet = new gfx.SpriteSheet('tiles', 16);
            
            this.BuildTileLayers();
            this.SpawnPlayer();
        }
        
        Update(timeDelta: number): void
        {
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
                dest.Clone(this.Player.GridPosition);
                
                var pos = this.GridPosToLayerPos(this.Player.GridPosition);
                
                this.Player.Tween.New(this.Player.Position)
                    .To({x: pos.x, y: pos.y}, 0.3, core.easing.SinusoidalInOut)
                    .Start()
                    .WhenDone(() => {
                        this.SpecialAction(this.Player.GridPosition);
                    });
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
            }            
            return false;
        }
        
        private CanMoveTo(gridPos: core.Vector): boolean
        {
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
            
            this.GroundLayer = new gfx.TileLayer(0, 0, this.TileSet, game.data.layer.ground);
            this.StaticLayer = new gfx.TileLayer(0, 0, this.TileSet, game.data.layer.static);
            
            this.AddChild(this.GroundLayer);
            this.AddChild(this.StaticLayer);
            this.AddChild(this.ActorLayer);
        }
        
        private SpawnPlayer(): void
        {
            this.Player = new Hero(0, 0, this.TileSet.GetSprite(game.assets.HERO));
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