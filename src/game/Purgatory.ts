/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/TileLayer.ts" />
/// <reference path="Assets.ts" />
/// <reference path="PurgatoryData.ts" />
/// <reference path="actors/AHero.ts" />
/// <reference path="actors/AFloatingTile.ts" />
/// <reference path="actors/ATorch.ts" />
/// <reference path="actors/AText.ts" />
/// <reference path="actors/ADemon.ts" />
/// <reference path="actors/AItem.ts" />
/// <reference path="Context.ts" />



namespace game {
    
    export enum MoveDirection {
        LEFT, RIGHT, UP
    }
    
    const LEVEL_1_DEMONS = ['Red', 'Blue'];
    const LEVEL_2_DEMONS = ['Green', 'Purple'];
    const LEVEL_1_ITEMS = ['Attack', 'Life'];
    const LEVEL_2_ITEMS = ['Punch', 'Light'];
    const LEVEL_BOSS = ['Dark'];
    
    /**
     * Purgatory layout, should be generated once per page load/game load.
     */
    const PURGATORY_LAYOUT = (() => {
        let $ = core.ShuffleArray;
        let lvl2demons = $(LEVEL_2_DEMONS),
            lvl2items = $(LEVEL_2_ITEMS),
            lvl1demons = $(LEVEL_1_DEMONS),
            lvl1items = $(LEVEL_1_ITEMS);

        
        // top boss -> index 0            
        return LEVEL_BOSS.concat(
            // level 2 items and bosses
            $([lvl2demons[0], lvl2items[0]]).concat($([lvl2demons[1], lvl2items[1]])).concat(
                // level 1 items and bosses
                $([lvl1demons[0], lvl1items[0]]).concat($([lvl1demons[1], lvl1items[1]]))
            )
        );
    })();
    
    export class Purgatory extends core.Layer<core.DisplayObject>
    {
        Player: AHero;
        SpriteSheet: gfx.SpriteSheet;
        
        // first layer to be rendered.
        GroundLayer = new core.Layer<AFloatingTile>();
        // 2d array of references to ground tiles.
        // first acces is row and the cols, so actor = GroundLookup[y][x]
        GroundLookup: AFloatingTile[][] = [];
        // living object rendered on top of other layers.
        ActorLayer = new core.Layer<Actor>();
        Demons: ADemon[] = [];
        
        Spawner: ContextSpawner;
                
        constructor(x: number, y: number)
        {
            super(x, y);
            game.context.Purgatory = this;
            this.SpriteSheet = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            this.Spawner = new ContextSpawner(this.SpriteSheet);
            
            this.BuildTileLayers();
            this.Size.Set(data.layer.ground[0].length, data.layer.ground.length);
            core.vector.Scale(this.Size, 24, this.Size);
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
                                
                this.Player
                    .PlayJump(futurePos)
                    .WhenDone(() => this.PlayerDied());
            }
        }
        
        GridPosToLayerPos(grid: core.Vector, out = new core.Vector()): core.Vector
        {
            core.vector.Multiply(grid, this.SpriteSheet.CellSize, out);
            return out;
        }
        
        private PlayerDied(): void
        {
            this.Player.PlayDead();
                        
            let center = new core.Vector(GAME.Canvas.width/2, GAME.Canvas.height/2);
            center = this.ToLocal(center);
            
            let text = new AText(0, center.y, "YOU DIED");
            text.Label.SetColor('red');
            text.Anchor.Set(0.5, 0.5);
            text.Position.x = center.x + text.Size.x * 2;
            
            text.Tween.New(text.Position)
                .To({x: center.x}, 1, core.easing.SinusoidalInOut)
                .Then()
                .Delay(2)
                .Then()
                .To({x: -text.Size.x * 2}, 1, core.easing.SinusoidalInOut)
                .Start()
                .WhenDone(() => {
                    text.RemoveFromParent();
                    context.PlayState.RestartPurgatory();
                });
                
            this.ActorLayer.AddChild(text);
        }
        
        private SpecialAction(gridPos: core.Vector): boolean
        {
            for (let demon of this.Demons)
            {
                if (demon.GridPosition.x == gridPos.x && demon.GridPosition.y == gridPos.y)
                {
                    this.Player.IsActive = false;
                    context.KilledDemons.push(demon.Name);
                    
                    context.PlayState.Timers.Delay(0.7, () => {
                        
                        context.PlayState.BlinkScreen(1);
                        context.PlayState.ShakeScreen(1).WhenDone(() => {
                            context.PlayState.RestartPurgatory();
                        });
                        
                    });
                    // this.PlayerDied();
                }
             }
            return false;
        }
        
        private CanMoveTo(gridPos: core.Vector): boolean
        {
            if (gridPos.y < 0 || gridPos.y > this.GroundLookup.length - 1)
            {
                return false;
            }
            
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
                      case 1: tile = new AFloatingTile(0, 0, this.SpriteSheet.ImageId); break;
                      default: throw new Error('tile not mapped.')
                  }
                  
                  tile.GridPosition.Set(x, y);
                  core.vector.Multiply(tile.GridPosition, this.SpriteSheet.CellSize, tile.Position);
                  
                  this.GroundLookup[y][x] = tile;
                  this.GroundLayer.AddChild(tile);
                });
            });
            
            /**
             * Actor slots counted from the top of the map, so 0 should have the boss,
             * 1 should have the top left item/boss, and so on ...
             */
            let actorSlot = 0;
            
            data.layer.actors.forEach((row, y) => {
                row.forEach((tileId, x) => {
                  let actor: Actor;
                  
                  switch (tileId) {
                      case 0: return;
                      case 2: actor = new ATorch(0, 0, this.SpriteSheet); break;
                      case 3: actor = this.Player = new AHero(0, 0, this.SpriteSheet); break;
                      
                      case 4: 
                      case 5: 
                      case 6: 
                        actor = this.Spawner.SpawnActor(actorSlot++); 
                        if (actor) {
                            this.Demons.push(actor as ADemon);
                        } else {
                            return;
                        } 
                        break;
                      default: console.error(`actor not mapped. (${tileId})`); return;
                  }
                  
                  actor.GridPosition.Set(x, y);
                  core.vector.Multiply(actor.GridPosition, this.SpriteSheet.CellSize, actor.Position);
                  
                  this.ActorLayer.AddChild(actor);
                });
            });
            
            this.AddChild(this.GroundLayer);
            this.AddChild(this.ActorLayer);
        }
        
        private CheckLayers(): void
        {
            var layers = [game.data.layer.collision,
                game.data.layer.ground];
                // game.data.layer.static];
                
            core.Assert(layers.every(layer => {
                return layer.length === game.data.layer.collision.length &&
                       layer.every(row => row.length === game.data.layer.collision[0].length);
            }), "Each layer has to have the same size.");
        }
    }
    
    
    /**
     * Spawn items and boses acorring to context;
     */
    class ContextSpawner
    {
        AliveDemons: string[];
        LeftItems: string[];
        
        DemonNames = LEVEL_1_DEMONS.concat(LEVEL_2_DEMONS).concat(LEVEL_BOSS);
        ItemNames = LEVEL_1_ITEMS.concat(LEVEL_2_ITEMS);
        
        constructor(private Sheet: gfx.SpriteSheet)
        {
           this.AliveDemons = this.DemonNames.filter(name => context.KilledDemons.indexOf(name) === -1);
           this.LeftItems = this.ItemNames.filter(name => context.AquiredItems.indexOf(name) === -1);
           
           console.log(`Context Spawner:`);
           console.log(`    Alive demons: ${this.AliveDemons}`);
           console.log(`    Left items: ${this.LeftItems}`);
        }
        
        SpawnActor(slot: number): ADemon
        {
            let actorName = PURGATORY_LAYOUT[slot]
            
            if (this.ActorExist(actorName))
            {
                switch (actorName) {
                    case 'Red':  return new ARedDemon(0, 0, this.Sheet);
                    case 'Blue': return new ABlueDemon(0, 0, this.Sheet);
                    case 'Green': return new AGreenDemon(0, 0, this.Sheet);
                    case 'Purple': return new APurpleDemon(0, 0, this.Sheet);
                    case 'Dark': return new ADarkDemon(0, 0, this.Sheet);
                }
            }
            
            return undefined;
        }
        
        private ActorExist(name: string): boolean
        {
            return this.AliveDemons.indexOf(name) !== -1 || this.LeftItems.indexOf(name) !== -1;
        }
        
    }

}