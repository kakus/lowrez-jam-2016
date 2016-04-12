/// <reference path="../core/DisplayObject.ts" />
/// <reference path="Assets.ts" />
/// <reference path="actors/ACombatant.ts" />
/// <reference path="actors/ATooth.ts" />
/// <reference path="Context.ts" />

namespace game {
    export class MonsterFight extends core.Layer<core.DisplayObject>
    {
        Player:    ACombatant;
        Teeth:     ATooth[] = [];
        ToothPool: ATooth[] = [];
        HitZone:   boolean[][] = [];

        TileSet: gfx.SpriteSheet;
        ActorLayer = new core.Layer<Actor>();

        gravity        = 0.05;
        playerVelocity = 0.0;
        velocityCap    = 3.0;
        realPosition   = 0.0; // initial position set here
        flapForce      = 1.0;
        teethSpeed     = 0.5;

        constructor(x: number, y: number)
        {
            super(x, y);
            game.context.MonsterFight = this;

            this.TileSet = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));

            this.AddChild(this.ActorLayer);
            this.SpawnPlayer();
            this.SpawnToothPair(70);
            this.SpawnToothPair(100);
            this.SpawnToothPair(130);
        }

        Flap(): void
        {
            this.playerVelocity = -this.flapForce;
        }

        Update(dt: number): void
        {
            this.playerVelocity    += this.gravity;

            if (this.playerVelocity > this.velocityCap)
                this.playerVelocity = this.velocityCap;
            if (this.playerVelocity < -this.velocityCap)
                this.playerVelocity = -this.velocityCap;

            this.realPosition      += this.playerVelocity * dt;
            this.Player.Position.y += this.playerVelocity;

            /* in the future, just lose the game/life here */
            if (this.Player.Position.y < 0)
                this.Player.Position.y = 0;

            if (Math.floor(this.Player.Position.y) + this.Player.Size.y > 64) {
                this.Player.Position.y = 64 - this.Player.Size.y;
            }

            this.UpdateTeeth(dt);

            var crashed = false;
            this.ResetHitZone();
            this.Player.FillHitZone(this.HitZone);
            for (let tooth of this.Teeth) {
                if (tooth.FillHitZone(this.HitZone)) {
                    crashed = true;
                    console.log("COLLISION");
                }
            }
        }

        UpdateTeeth(dt: number): void
        {
            var lastTooth = 0;
            var newTeeth = [];
            for (let tooth of this.Teeth) {
                tooth.Position.x -= this.teethSpeed;
                if (tooth.Position.x > lastTooth) {
                    lastTooth = tooth.Position.x;
                }
                if (tooth.Position.x + tooth.Size.x < 0) {
                    this.ToothPool.push(tooth);
                } else {
                    newTeeth.push(tooth);
                }
            }
            this.Teeth = newTeeth;
            // without this, teeth have a tendency to spawn closer and
            // closer together over time. This prevents spawning them
            // right after one another
            if (lastTooth < 50) {
                while (this.Teeth.length < 6) {
                    this.SpawnToothPair(null);
                }
            }
        }

        private SpawnPlayer(): void
        {
            this.Player = new ACombatant(0, this.realPosition, this.TileSet);
            this.ActorLayer.AddChild(this.Player);
        }

        private SpawnToothPair(x: number): void
        {
            if (x == null) {
                x = Math.floor(Math.random() * 5 + 70)
            }
            this.SpawnTooth(x, true);
            this.SpawnTooth(x, false);
        }

        private SpawnTooth(x: number, upper: boolean): void
        {
            let actualHeight  = 40;
            let desiredHeight = Math.floor(Math.random() * 10 + 10);
            // yoff determins the offset between the middle of the gap
            // and the middle of the screen. This is what we'll want
            // to adjust (read: increase) once monster's eyes are added
            let yoff = Math.floor(Math.random() * 10 - 5);
            let y = upper ?  desiredHeight - actualHeight
                          : 64 - desiredHeight;
            y += yoff;
            if (this.ToothPool.length > 0) {
                let tooth = this.ToothPool.shift();
                tooth.Position.x = x;
                tooth.Position.y = y
                this.Teeth.push(tooth);
            } else {
                console.log("Actually creating new tooth");
                let tooth = new ATooth(x, y, 8, actualHeight);
                this.Teeth.push(tooth);
                this.ActorLayer.AddChild(tooth);
            }
        }

        private ResetHitZone(): void
        {
            for (var i: number = 0; i < 64; i++) {
                this.HitZone[i] = [];
                for (var j: number = 0; j < 64; j++) {
                    this.HitZone[i][j] = false;
                }
            }
        }
    }
}
