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
    
    export const enum MoveDirection {
        LEFT, RIGHT, UP
    }
    
    const LEVEL_1_DEMONS = ['Red', 'Blue'];
    const LEVEL_2_DEMONS = ['Green', 'Purple'];
    const LEVEL_1_ITEMS = ['Attack', 'Life'];
    const LEVEL_2_ITEMS = ['Punch', 'Light'];
    const LEVEL_BOSS = ['Dark'];
    
    const TMP_VEC = new core.Vector();
    const CULL_OFFSET = 24 * 4;
    
    
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
        // first layer to be rendered.
        GroundLayer = new core.Layer<AFloatingTile>();
        // 2d array of references to ground tiles.
        // first acces is row and the cols, so actor = GroundLookup[y][x]
        GroundLookup: AFloatingTile[][] = [];
        // living object rendered on top of other layers.
        ActorLayer = new core.Layer<Actor>();
        
        Demons: ADemon[] = [];
        Items: AItem[] = [];
        Player: AHero;
        SpriteSheet: gfx.SpriteSheet;
        Spawner: ContextSpawner;
        
        Timer = new core.TimersManager();
                
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
            // actor screen position 
            let screen = TMP_VEC;
            
            for (let actor of this.GroundLayer.Children)
            {
                actor.Update(timeDelta);
                
                this.ToGlobal(actor.Position, screen);
                actor.Visible = screen.x > -CULL_OFFSET && screen.x < GAME.Canvas.width && screen.y > -CULL_OFFSET && screen.y < GAME.Canvas.height;
            }
            for (let actor of this.ActorLayer.Children)
            {
                actor.Update(timeDelta);
                
                this.ToGlobal(actor.Position, screen);
                actor.Visible = screen.x > -CULL_OFFSET && screen.x < GAME.Canvas.width && screen.y > -CULL_OFFSET && screen.y < GAME.Canvas.height;
            }
            // console.log("clipped tiles",this.GroundLayer.Children.map(t => t.Visible ? 0 : 1).reduce((p,c) => p + c, 0), this.GroundLayer.Children.length,
            //     "clipped actors",this.ActorLayer.Children.map(t => t.Visible ? 0 : 1).reduce((p,c) => p + c, 0), this.ActorLayer.Children.length);
            this.Timer.Update(timeDelta);
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
                    .WhenDone(() => this.TileAction(this.Player.GridPosition));
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
            this.Timer.Delay(1, () => context.PlayState.DimScreen(false, 1));
            this.Player.PlayDead()
                .WhenDone(() => {
                    game.context.LifesLeft -= 1;
                    GAME.Play('you-died');
                });                        
        }
        
        private TileAction(gridPos: core.Vector): boolean
        {
            for (let demon of this.Demons) 
            {
                if (demon.GridPosition.x == gridPos.x && demon.GridPosition.y == gridPos.y) 
                {
                    this.Player.IsActive = false;
                    // context.KilledDemons.push(demon.Name);

                    context.PlayState.Timers.Delay(0.7, () => {

                        context.PlayState.BlinkScreen(1);
                        context.PlayState.ShakeScreen(1).WhenDone(() => {
                            context.PlayState.BeginFigthMode(demon.Name);
                        });

                    });
                }
            }
            
            for (let item of this.Items)
            {
                if (item.GridPosition.x == gridPos.x && item.GridPosition.y == gridPos.y) 
                {
                    this.Player.IsActive = false;
                    context.AquiredItems.push(item.Name);
                    
                    item.Execute();
                    item.ShowInGlory();
                    
                    this.ShowText(item.GetDescription()[0], 'white', 15)
                    this.ShowText(item.GetDescription()[1], 'white', 21)
                        .WhenDone(() => {
                            let {x, y} = this.Player.GridPosition;
                            this.GroundLookup[y][x].Collapse();
                            item.Visible = false;
                            
                            context.PlayState.DimScreen();
                                
                            this.Player.PlayDead(30)
                                .WhenDone(() => {
                                    context.PlayState.RestartPurgatory();
                                });
                        })
                }
            }
             
             
            return false;
        }
        
        private ShowText(msg: string, color = 'white', offsetY = 0): core.Tween
        {
            let center = new core.Vector(GAME.Canvas.width/2, GAME.Canvas.height/2);
            center = this.ToLocal(center);
            
            let text = new AText(0, center.y + offsetY, msg.toUpperCase());
            text.Label.SetColor(color);
            text.Anchor.Set(0.5, 0.5);
            text.Position.x = this.ToLocal(new core.Vector(GAME.Canvas.width, 0)).x + 20;
            
            // let bg = new gfx.Rectangle(center.x, center.y, this.Parent.Size.x, text.Size.y + 5, {fillStyle: "rgba(0, 0, 0, 0.5)"});
            // bg.Anchor.Set(0.5, 0.5);
            
            this.ActorLayer.AddChild(text);
                        
            return text.Tween.New(text.Position)
                .To({x: center.x}, 1, core.easing.SinusoidalInOut)
                .Then()
                .Delay(2)
                .Then()
                .To({x: this.ToLocal(core.vector.Zero).x - 20}, 1, core.easing.SinusoidalInOut)
                .Start()
                .WhenDone(() => {
                    text.RemoveFromParent();
                });
                
        }
        
        private CanMoveTo(gridPos: core.Vector): boolean
        {
            if (gridPos.y < 0 || gridPos.y > this.GroundLookup.length - 1) {
                return false;
            }
            
            let tile = this.GroundLookup[gridPos.y][gridPos.x];
            
            if (tile) {
                return tile.IsActive;
            }
            return false; 
        }
        
        private BuildTileLayers(): void
        {
            data.layer.ground.forEach((row, y) => {
                this.GroundLookup.push([]);
                
                row.forEach((tileId, x) => {
                    let tile: AFloatingTile;
                  
                    switch (tileId) {
                        case 0: return;
                        case 1: tile = new AFloatingTile(0, 0, this.SpriteSheet.ImageId); break;
                        // tiles unlocked when all bosess are killed 
                        case 11:
                            if (context.IsOnlyBossAlive()) {
                                tile = new AFloatingTile(0, 0, this.SpriteSheet.ImageId);
                                tile.RaiseWhenVisible();                                
                            }
                            else {
                                return;
                            }
                            break;
                        
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
                      case 3: 
                        actor = this.Player = new AHero(0, 0, this.SpriteSheet);
                        this.Timer.Delay(0.8, () => {
                            let fall = this.Player.FallFromHeaven();
                            if (context.IsOnlyBossAlive()) {
                                fall.WhenDone(() => {
                                    this.CameraShowPathToFinalBoss();
                                })
                            }
                        });
                        break;
                      
                      case 4: 
                      case 5: 
                      case 6: 
                        actor = this.Spawner.SpawnActor(actorSlot++); 
                        if (actor instanceof ADemon) {
                            this.Demons.push(actor as ADemon);
                        } 
                        else if (actor instanceof AItem) {
                            this.Items.push(actor);
                        } 
                        else {
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
        
        private CameraShowPathToFinalBoss(): void
        {
            let boss = this.Demons.filter(d => d.Name === 'Dark')[0];
            this.Player.IsActive = false;
            context.PlayState.MoveCameraTo(boss.Position, 10)
                .WhenDone(() => {
                    context.PlayState.DimScreen(false, 1);
                })
                .Then()
                .Delay(1)
                .WhenDone(() => {
                    context.PlayState.DimScreen(true, 1);
                    this.Player.IsActive = true;
                });
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
                    
                    case 'Life': return new ALifeBonus(0, 0, this.Sheet);
                    case 'Attack': return new AAttackBonus(0, 0, this.Sheet);
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