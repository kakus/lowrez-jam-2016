/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />


namespace state {
    
    const PLAYER_SPEED = 20;

    export class PlayState extends AbstractState {

        //
        // Important note!
        // Never init properties inline in State class, since state
        // is usually created just once per game.
        // Init properties in Start method. 
        //
        
        Score: gfx.AAText;
        
        IsKeyDown: boolean[];
        Purgatory: game.Purgatory;
        
        ScreenCenter: core.Vector;
        
        /**
		 * Called once before first update
		 */
        Start() 
        {
            // simple key handing mechanism, this is not part of this framework
            // its quick fix for this demo.
            this.IsKeyDown = [];
            // set game size befor Start, this is important since is sets
            // native game resolution. OnResize doesn't change game resolution, it
            // only scales the game.
            // Note to self: This could be done better?
            this.DefaultSize.Set(64, 64);
            // this.DefaultSize.Set(128, 128);
            this.ScreenCenter = new core.Vector(this.DefaultSize.x/2 - 24/2, this.DefaultSize.y/2 - 24/2);
            
            super.Start();
            
            
            gfx.Sprite.Load(
                ['spritesheet', 'assets/images/spritesheet.png']
            ).then(() => {
                game.context.PlayState = this;
                this.Purgatory = new game.Purgatory(0.5, 0.5);
                this.Stage.AddChild(this.Purgatory);                
            });

            // setup controlls
            // this thing is unused here in this demo, since I think
            // is still need some work, I will not comment on this.
            this.InputController = new core.GenericInputController();
            // this is important, it registers handler for keyboard input.
            // should be handled by inputcontroller, but as i said before
            // it need some more work.
            this.ListenForKeyboard();

            // setup fps metter
            this.ShowFps();
            this.FPSText.Position.Set(1, 1);
            this.FPSText.SetSize(3);
            this.FPSText.Alpha = 0.5;
            
            // fit window
            this.OnResize();
        }


        OnKeyUp(key: core.key): void
        {
            this.IsKeyDown[key] = false;
        }
        
        OnKeyDown(key: core.key): void
        {
            this.IsKeyDown[key] = true;
        }

        /**
         * Called once per frame.
         * 
         * @param timeDelta time in SECONDS since last frame.
         */
        Update(timeDelta: number): void 
        {
            super.Update(timeDelta);
            
            if (this.IsKeyDown[core.key.LEFT])
                this.Purgatory.MovePlayer(game.MoveDirection.LEFT);
            else if (this.IsKeyDown[core.key.UP])
                this.Purgatory.MovePlayer(game.MoveDirection.UP);
            else if (this.IsKeyDown[core.key.RIGHT])
                this.Purgatory.MovePlayer(game.MoveDirection.RIGHT);
                
            if (this.Purgatory) {
                this.Purgatory.Update(timeDelta);
                
                // let pos = this.Purgatory.ToGlobal(this.Purgatory.Player.Position);
                // console.log(pos);
                // core.vector.Subtract(pos, new core.Vector(10, 10), this.Purgatory.Position);
                core.vector.Subtract(this.ScreenCenter, this.Purgatory.Player.Position, this.Purgatory.Position);
                // this.Purgatory.Position.Set(-this.Purgatory.Player.Position.x + 20, -this.Purgatory.Player.Position.y + 20);
            }
        }
        
        OnResize(): void
        {
            super.OnResize();
            this.Game.Context['imageSmoothingEnabled'] = false;
        }
        
        ShakeScreen(time: number, amplitude: number = 7): core.Tween
        {
            return this.Tweens.New(this.Stage.Position)
                .OnUpdate((position, progress) =>{
                    progress = progress > 0.5 ? 2 - progress * 2 : progress * 2;
                    position.Set(
                        (core.Random(-amplitude, amplitude) * progress)| 0,
                        (core.Random(-amplitude, amplitude) * progress)| 0
                    );
                })
                .Delay(time)
                .Then()
                // restore
                .To({x: 0, y: 0}, 0.01)
                .Start();
        }

    }

}
