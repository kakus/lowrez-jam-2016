/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/Rectangle.ts" />
/// <reference path="../core/LinkedList.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/ObservableProperty.ts" />


namespace game 
{
    // Base class for all objects that will apear in this small demo.
    // Is worth to notice that we keep image of this actor as separate
    // component rather than for exmaple extends this class from gfx.Rectagle.
    abstract class Actor extends core.DisplayObject
    {
        // Reference to world object, which is responsible for managing life
        // cycle of actors.
        World: World;
        // Visuals as coponent, each overriding class can have different look
        Sprite: core.DisplayObject;
        // world will move this actor with this velocity.
        Velocity: core.Vector;
        
        constructor(x: number, y: number, world: World, sprite: core.DisplayObject)
        {
            // We set size of this actor exactly the same as sprite.
            super(x, y, sprite.Size.x, sprite.Size.y);
            this.World = world;
            this.Sprite = sprite;
            this.Velocity = new core.Vector();
            // This tell us, that position property will refer to the center of actor.
            // Default value is (0, 0), so it would refer to top left corner.
            this.Anchor.Set(0.5, 0.5);
        }
        
        DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Sprite.Draw(ctx);
        }
    }
    
    // Basic bullet that can be shooted by player or enemy.
    class Bullet extends Actor
    {
        constructor(x: number, y: number, world: World)
        {
            // white rectange at 0, 0 (local) position, 3 px width, 1 height.
            super(x, y, world, new gfx.Rectangle(0, 0, 3, 1, {fillStyle: 'white'}));
        }
    }
    
    class PlayerShip extends Actor
    {
        constructor(x: number, y: number, world: World)
        {
            super(x, y, world, new gfx.Rectangle(0, 0, 3, 5, {fillStyle: 'white'}));
        }
        
        Shoot(): void
        {
            let bullet = new Bullet(this.Position.x, this.Position.y, this.World);
            bullet.Velocity.Set(60, 0);
            this.World.AddBullet(bullet);    
        }
    }
    
    class Enemy extends Actor
    {
        constructor(x: number, y: number, world: World)
        {
            super(x, y, world, new gfx.Rectangle(0, 0, 2, 2, {fillStyle: 'red'}));
        }
    }
    
    // class which is reposible for managing all actors that can apear in this game.
    // We extend from core.Layer because we want add actors as child of this object,
    // so we have good controll whats is on the screen.
    export class World extends core.Layer<core.DisplayObject>
    {
        Bullets: Bullet[];
        Ships: Actor[];
        Player: PlayerShip;
        Score: core.ObservableNumber;
        // this is a factory and manager of timers. use it to execute function,
        // based on time criteria.
        // Like if would that something happen in x seconds, or should be
        // repeadly called like once per second.
        // @imporant you have to manually update timer manager.
        Timer: core.TimersManager;
        
        constructor(x: number, y: number, width: number, height: number)
        {
            super(x, y, width, height);
            this.Bullets = [];
            this.Ships = [];
            this.Timer = new core.TimersManager();
            this.Score = new core.ObservableNumber(0);
            
            this.Timer.Repeat(
                2, // each 2 second
                this.SpawnEnemy, // spawn enemy
                this, // ctx, for callback
                undefined, // no call limit
                1 // 1 seconds delay
            );
            
            this.SpawnPlayer();
        } 
        
        Update(timeDelta: number)
        {
            this.Timer.Update(timeDelta);
            
            this.UpdatePosition(this.Bullets, timeDelta);
            this.UpdatePosition(this.Ships, timeDelta);
            
            let destroyedShips = [];
            this.CheckCollisions(this.Ships, this.Bullets, (ship, bullet) => {
                if (ship != this.Player) {
                    destroyedShips.push(ship);
                    this.Score.Increment(1);
                }
            });
            destroyedShips.forEach(ship => {
                this.RemoveChild(ship);
                core.RemoveElement(this.Ships, ship);
            });
            
            this.LimitPlayerMovement();
            this.CheckBoundsAndDestroy(this.Bullets);
        }
        
        AddBullet(bullet: Bullet): void
        {
            // We add bullet to bullet reference array
            // this is just for our information.
            this.Bullets.push(bullet);
            // We add bullet to display list, so the bullet can be seen on the screen.
            this.AddChild(bullet);
        }
        
        private LimitPlayerMovement()
        {
            this.Player.Position.y = core.math.Clamp(this.Player.Position.y,
                // min              , max 
                this.Player.Size.y/2, this.Size.y - this.Player.Size.y/2);
        }
        
        private SpawnPlayer(): void
        {
            let player = new PlayerShip(5, this.Size.y/2, this);
            this.Player = player;
            this.AddChild(player);
            this.Ships.push(player);
        }
        
        private SpawnEnemy(): void
        {
            if (this.Ships.length < 6)
            {
                let enemy = new Enemy(this.Size.x - 10, core.Random(0, this.Size.y), this);
                this.Ships.push(enemy);
                this.AddChild(enemy);
            }
        }
        
        private CheckBoundsAndDestroy(actors: Actor[]): void
        {
            for(let i = actors.length - 1; i >= 0; --i)
            {
                // we check whether central point of actor is still inside  this world,
                // seconds parameter which is `false`, set whether given point is
                // in global (=true) coordinates or local (=false).
                if (!this.IsPointInside(actors[i].Position, false))
                {
                    console.log("removing bullet. active bullets:", this.Bullets.length, "active ships:", this.Ships.length);
                    this.RemoveChild(actors[i]); 
                    actors.splice(i, 1);
                }
            }
        }
        
        private UpdatePosition(actors: Actor[], timeDelta: number): void
        {
            // I used tmp vector for memory optimization.
            // there is aslo global one tmp vector `core.vector.Tmp`, but
            // it have to be used very carefully.
            let tmp = new core.Vector();
            
            for (let actor of actors)
            {
                // copy velocity vector to tmp vector;
                actor.Velocity.Clone(tmp);
                // scale by time
                core.vector.Scale(tmp, timeDelta);
                // update bullet posision
                // last argument is vector where to store the result of addition.
                core.vector.Add(actor.Position, tmp, actor.Position);
            }
        }
        
        private CheckCollisions(group_a: Actor[], group_b: Actor[], handler: (a: Actor, b: Actor) => void): void
        {
            let extents = new core.Vector();
            for (let actor_a of group_a)
            {
                core.vector.Clone(actor_a.Size, extents);
                core.vector.Scale(extents, 0.5);
                
                let a_globalPosition = this.ToGlobal(actor_a.Position);
                
                for (let actor_b of group_b)
                {
                    if (actor_b.IsPointInside(a_globalPosition, true, extents))
                    {
                        handler(actor_a, actor_b);
                    }
                }
            }
        }
    }
}