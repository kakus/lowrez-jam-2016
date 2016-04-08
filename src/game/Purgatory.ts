/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/TileLayer.ts" />
/// <reference path="Assets.ts" />
/// <reference path="PurgatoryData.ts" />
/// <reference path="actors/AHero.ts" />
/// <reference path="actors/AFloatingTile.ts" />
/// <reference path="actors/ATorch.ts" />
/// <reference path="actors/AText.ts" />
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
        GroundLayer = new core.Layer<AFloatingTile>();
        // 2d array of references to ground tiles.
        // first acces is row and the cols, so actor = GroundLookup[y][x]
        GroundLookup: AFloatingTile[][] = [];
        // living object rendered on top of other layers.
        ActorLayer = new core.Layer<Actor>();
                
        constructor(x: number, y: number)
        {
            super(x, y);
            game.context.Purgatory = this;
            
            this.TileSet = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            
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
            if (!this.Player.IsActive || this.Player.Tween.TweenPlaying()) return;
            
            console.log ("moving player to " + dir);
            
            let dest = this.Player.GridPosition.Clone();
            
            switch (dir) {
                case MoveDirection.LEFT: dest.x -= 1; break;
                case MoveDirection.UP: dest.y -= 1; break;
                case MoveDirection.RIGHT: dest.x += 1; break;
            }
            
            let futurePos = this.GridPosToLayerPos(dest);
            
            if (this.CanMoveTo(dest))
            {
                let {x, y} = this.Player.GridPosition;
                this.GroundLookup[y][x].Collapse();
                dest.Clone(this.Player.GridPosition);
                
                this.Player
                    .PlayJump(futurePos)
                    .WhenDone(() => this.SpecialAction(this.Player.GridPosition));
            }
            else
            {
                this.Player.IsActive = false;
                let {x, y} = futurePos;
                
                this.Player
                    .PlayJump(futurePos)
                    .WhenDone(() => {
                        this.Player.PlayDead();
                        
                        let text = new AText(x + 64, y + 12, "YOU DIED");
                        text.Label.SetColor('red');
                        text.Anchor.Set(0.5, 0.5);
                        text.Tween.New(text.Position)
                            .To({x: x + 12}, 1, core.easing.SinusoidalInOut)
                            .Then()
                            .Delay(2)
                            .Then()
                            .To({x: -text.Size.x * 2}, 1, core.easing.SinusoidalInOut)
                            .Start()
                            .WhenDone(() => this.SpecialAction(new core.Vector(3, 0)))
                            .WhenDone(() => text.RemoveFromParent());
                            
                        this.ActorLayer.AddChild(text);
                    });
                    
            }
            
        }
        
        GridPosToLayerPos(grid: core.Vector, out = new core.Vector()): core.Vector
        {
            core.vector.Multiply(grid, this.TileSet.CellSize, out);
            return out;
        }
        
        private SpecialAction(gridPos: core.Vector): boolean
        {
            if (gridPos.x === 3 && gridPos.y === 0)
            {
                game.context.PlayState.RestartPurgatory();
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
                  let tile: AFloatingTile;
                  
                  switch (tileId) {
                      case 0: return;
                      case 1: tile = new AFloatingTile(0, 0, this.TileSet.ImageId); break;
                      default: throw new Error('tile not mapped.')
                  }
                  
                  tile.GridPosition.Set(x, y);
                  core.vector.Multiply(tile.GridPosition, this.TileSet.CellSize, tile.Position);
                  
                  this.GroundLookup[y][x] = tile;
                  this.GroundLayer.AddChild(tile);
                });
            });
            
            data.layer.actors.forEach((row, y) => {
                row.forEach((tileId, x) => {
                  let actor: Actor;
                  
                  switch (tileId) {
                      case 0: return;
                      case 2: actor = new ATorch(0, 0, this.TileSet); break;
                      default: throw new Error('actor not mapped.')
                  }
                  
                  actor.GridPosition.Set(x, y);
                  core.vector.Multiply(actor.GridPosition, this.TileSet.CellSize, actor.Position);
                  
                  this.ActorLayer.AddChild(actor);
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