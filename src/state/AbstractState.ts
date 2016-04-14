/// <reference path="../core/IState.ts" />
/// <reference path="../core/Game.ts" />
/// <reference path="../core/InputController.ts" />
/// <reference path="../core/Tween.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/Math.ts" />
/// <reference path="../core/Keyboard.ts" />

namespace state {
	
	export class AbstractState implements core.IState
	{
		Game: core.Game;
		Stage: core.Layer<core.DisplayObject>;
		DefaultSize = new core.Vector(320, 400);
		InputController: core.IInputController;
		Tweens: core.TweenManager;
		Timers: core.TimersManager;
		FPSMeter: core.FPSMeter;
		FPSText: gfx.AAText;
		
		Start(): void
		{
			this.Stage = new core.Layer(0, 0, this.DefaultSize.x, this.DefaultSize.y);
			this.Tweens = new core.TweenManager();
			this.Timers = new core.TimersManager();
			this.FPSMeter = new core.FPSMeter(60);
			this.FPSText = new gfx.AAText(10, 10, 'FPS');
			this.FPSText.SetSize(10);
            this.FPSText.Visible = false;
			
			this.Game.AddDOMEventListener(window, 'resize', (e) => this.OnResize());
		}
		
		Update(timeDelta: number): void
		{
			this.Timers.Update(timeDelta);
			this.Tweens.Update(timeDelta);
			
			if (this.FPSText.Visible)
			{
				this.FPSMeter.Update(timeDelta);
				this.FPSText.SetText(this.FPSMeter.GetFPS().toFixed(1));
			}
		}
		
		Draw(ctx: CanvasRenderingContext2D): void
		{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			this.Stage.Draw(ctx);
            this.FPSText.Draw(ctx);
		}
		
		OnPointerDown(point: core.Vector): void
		{
			this.InputController.OnPointerDown(point);
		}
		
		OnPointerMove(point: core.Vector): void
		{
			this.InputController.OnPointerMove(point);
		}
		
		OnPointerUp(point: core.Vector): void
		{
			this.InputController.OnPointerUp(point);
		}
		
		OnKeyDown(key: core.key)
		{
			console.log('keydown ', key);
		}
        
		OnKeyUp(key: core.key)
		{
			console.log('keyup ', key);
		}
		
		OnResize(): void
		{
			let width = window.innerWidth, height = window.innerHeight;
			
			// this.DefaultSize.x = core.math.Clamp(width, 320, 480);
			
			let scale = Math.min(width / this.DefaultSize.x, height / this.DefaultSize.y);
			this.Stage.Scale.Set(scale, scale);
			this.Stage.Size.Set(this.DefaultSize.x, this.DefaultSize.y);
			
			// let scale = 1;
			// this.Stage.Size.Set(this.DefaultSize.x, this.DefaultSize.y);
			
			let canvasWidth = Math.floor(this.Stage.Size.x * scale);
			if (this.Game.Canvas.width !== canvasWidth)
			{
				this.Game.Canvas.width = canvasWidth;
			}
			
			let canvasHeight = Math.floor(this.Stage.Size.y * scale);
			if (this.Game.Canvas.height !== canvasHeight)
			{
				this.Game.Canvas.height = canvasHeight;
			}
			
			this.Game.Context['imageSmoothingEnabled'] = false;
            this.Game.Context['mozImageSmoothingEnabled'] = false;
            this.Game.Context['webkitImageSmoothingEnabled'] = false;
            this.Game.Context['msImageSmoothingEnabled'] = false;
		}
		
		ShowFps(): void
		{
            this.FPSText.Visible = true;
		}
		
		protected ListenForMouseInput(): void
		{
			if (!this.InputController) throw Error();
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousemove', core.MakeMouseEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mousedown', core.MakeMouseEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'mouseup', core.MakeMouseEventTranslator(this.OnPointerUp, this));
		}
		
		protected ListenForTouchInput(): void
		{
			if (!this.InputController) throw Error();
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchmove', core.MakeTouchEventTranslator(this.OnPointerMove, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchstart', core.MakeTouchEventTranslator(this.OnPointerDown, this));
			this.Game.AddDOMEventListener(this.Game.Canvas, 'touchend', core.MakeTouchEventTranslator(this.OnPointerUp, this));
		}
		
		protected ListenForKeyboard(): void
		{
			if (!this.InputController) throw Error();
			this.Game.AddDOMEventListener(window, 'keydown', (e: KeyboardEvent) => {
                this.OnKeyDown(e.keyCode);
                e.preventDefault();
            });
			this.Game.AddDOMEventListener(window, 'keyup', (e: KeyboardEvent) => {
                this.OnKeyUp(e.keyCode);
                e.preventDefault();
            });
		}

	}

}
