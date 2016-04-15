/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />


namespace state {
    
    const PLAYER_SPEED = 20;

    export class PlayState extends AbstractState {

        IsKeyDown: boolean[];
        
        Purgatory: game.Purgatory;
        FightMode: game.FightMode;
        
        ScreenCenter: core.Vector;
        
        CameraTweens: core.TweenManager;
        
        /**
		 * Called once before first update
		 */
        Start() 
        {
            // simple key handing mechanism, this is not part of this framework
            // its quick fix for this demo.
            this.IsKeyDown = [];
            this.CameraTweens = new core.TweenManager();
            // set game size befor Start, this is important since is sets
            // native game resolution. OnResize doesn't change game resolution, it
            // only scales the game.
            // Note to self: This could be done better?
            this.DefaultSize.Set(64, 64);
            // this.DefaultSize.Set(128, 128);
            // this.DefaultSize.Set(256, 256);
            this.ScreenCenter = new core.Vector(this.DefaultSize.x/2 - 24/2, this.DefaultSize.y/2 - 24/2);
            
            super.Start();
            
            game.context.PlayState = this;
            
            

            // setup controlls
            // this thing is unused here in this demo, since I think
            // is still need some work, I will not comment on this.
            this.InputController = new core.GenericInputController();
            // this is important, it registers handler for keyboard input.
            // should be handled by inputcontroller, but as i said before
            // it need some more work.
            this.ListenForKeyboard();

            // setup fps metter
            // this.ShowFps();
            this.FPSText.Position.Set(0, 0);
            
            // fit window
            this.OnResize();
            
            // start game.
            this.RestartPurgatory();
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
            this.CameraTweens.Update(timeDelta);
            
            if (this.FightMode)
            {
                if (this.IsKeyDown[core.key.UP]) {
                    this.FightMode.Flap();
                }
                else {
                    this.FightMode.Flip();
                }
                    
                    
                this.FightMode.Update(timeDelta);
            }
            
            if (this.Purgatory) 
            {
                if (this.IsKeyDown[core.key.LEFT])
                    this.Purgatory.MovePlayer(game.MoveDirection.LEFT);
                else if (this.IsKeyDown[core.key.UP])
                    this.Purgatory.MovePlayer(game.MoveDirection.UP);
                else if (this.IsKeyDown[core.key.RIGHT])
                    this.Purgatory.MovePlayer(game.MoveDirection.RIGHT);
                    
                this.Purgatory.Update(timeDelta);
                
                if (!this.CameraTweens.TweenPlaying()) {
                    this.CenterCamera();
                }
            }
        }
        
        OnResize(): void
        {
            super.OnResize();
            audio.manager.Volume = 0;
        }
        
        BeginFigthMode(demonName: string): void
        {
            let gen = new game.TeethGenertor(game.theeth.demon1.upper, game.theeth.demon1.lower, game.theeth.demon1.gap);
            this.FightMode = new game.FightMode(0, 0, gen, demonName);
            this.Stage.AddChild(this.FightMode);
            
            if (this.Purgatory) {
                this.Purgatory.RemoveFromParent();
                this.Purgatory = null;
            }
        }
        
        RestartPurgatory(): void
        {
            if (this.Purgatory) this.Purgatory.RemoveFromParent();
            
            this.Stage.Alpha = 1;
            this.DimScreen(true);
            this.Purgatory = new game.Purgatory(0.5, 0.5);
            this.Stage.AddChild(this.Purgatory);
        }
        
        ShakeScreen(time: number, amplitude: number = 5): core.Tween
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
        
        BlinkScreen(time: number = 1, rate: number = 0.1): void
        {
            let rect = new gfx.Rectangle(0, 0, this.Stage.Size.x, this.Stage.Size.y, {
                fillStyle: 'white', compositeOperation: 'difference'
            });
            this.Stage.AddChild(rect);
            
            const callLimit = (time/rate) | 0;
            
            this.Timers.Repeat(rate, (count) => {
                
                if (count == callLimit) 
                    rect.RemoveFromParent();
                else 
                    rect.Visible = !rect.Visible;
                    
            }, undefined, callLimit);            
        }
        
        DimScreen(reverse = false, time = 2): core.Tween
        {
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({Alpha: reverse ? 1 : 0}, time)
                .Start();
        }
        
        MoveCameraTo(target: core.Vector, duration = 1): core.Tween
        {
            target = target.Clone();
            core.vector.Subtract(this.ScreenCenter, target, target);
            
            return this.CameraTweens.New(this.Purgatory.Position)
                .To({x: target.x, y: target.y}, duration, core.easing.SinusoidalInOut)
                .Start();
        }
        
        CenterCamera(): void
        {
            // center camera on target
            core.vector.Subtract(this.ScreenCenter, this.Purgatory.Player.Position, this.Purgatory.Position);
            
            // pan camera to map boundary
            //
            // TURNED OFF - can be removed after solving problem of seeing two paths (demon and item).
            //
            // core.vector.Min(new core.Vector(0, 0), this.Purgatory.Position, this.Purgatory.Position);
            // let max = new core.Vector();
            // core.vector.Subtract(this.DefaultSize, this.Purgatory.Size, max);
            // core.vector.Max(max, this.Purgatory.Position, this.Purgatory.Position);
        }

    }

}
