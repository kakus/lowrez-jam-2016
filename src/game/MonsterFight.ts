/// <reference path="../core/DisplayObject.ts" />
/// <reference path="Assets.ts" />
/// <reference path="actors/ACombatant.ts" />
/// <reference path="Context.ts" />

namespace game {
    export class MonsterFight extends core.Layer<core.DisplayObject>
    {
        Player: ACombatant;
        TileSet: gfx.SpriteSheet;
        ActorLayer = new core.Layer<Actor>();

        gravity        = 0.05;
        playerVelocity = 0.0;
        velocityCap    = 3.0;
        realPosition   = 0.0; // initial position set here
        flapForce      = 1.0;

        constructor(x: number, y: number)
        {
            super(x, y);
            game.context.MonsterFight = this;

            this.TileSet = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));

            this.AddChild(this.ActorLayer);
            this.SpawnPlayer();
        }

        Flap(): void
        {
            this.playerVelocity = -this.flapForce;
        }

        Update(timeDelta: number): void
        {
            this.playerVelocity    += this.gravity;

            if (this.playerVelocity > this.velocityCap)
                this.playerVelocity = this.velocityCap;
            if (this.playerVelocity < -this.velocityCap)
                this.playerVelocity = -this.velocityCap;

            /* in the future, just lose the game/life here */
            if (this.Player.Position.y < 0)
                this.Player.Position.y = 0;

            if (this.Player.Position.y > 64)
                this.Player.Position.y = 64;

            this.realPosition      += this.playerVelocity * timeDelta;
            this.Player.Position.y += this.playerVelocity;
        }

        private SpawnPlayer(): void
        {
            this.Player = new ACombatant(5, this.realPosition, this.TileSet);
            this.ActorLayer.AddChild(this.Player);
        }
    }
}
