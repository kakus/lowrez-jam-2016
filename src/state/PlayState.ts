/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />


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
            super.Start();
            
            // setup title
            this.Score = new gfx.AAText(32, 1, "SCORE 0");
            this.Score.Anchor.Set(0.5, 0);
            // Set height of character in pixels
            this.Score.SetSize(5);
            this.Stage.AddChild(this.Score);
            
            gfx.Sprite.Load(
                ['tiles', 'assets/images/tiles.png']
            ).then(() => {
                
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
                
            if (this.Purgatory) this.Purgatory.Update(timeDelta);
        }
        
        OnResize(): void
        {
            super.OnResize();
            this.Game.Context['imageSmoothingEnabled'] = false;
        }

    }

}
