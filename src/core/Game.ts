/// <reference path="IState.ts" />

namespace core {
	
	export class Game {
		
		States: { [name:string]: IState } = { };
		Context: CanvasRenderingContext2D;
		Canvas: HTMLCanvasElement;
		/** Whether paga has focus */
		HasFocus: boolean = true;
		/** Seconds since last frame. */
		TimeDelta: number = 0;
		
		private ActiveState: IState;
		private RequestAnimationFrame: Function;
		private LastFrameTime: number = 0;
		private StateDOMListeners: Array<{element: HTMLElement | Window, type: string, listener: EventListener}> = [];
		
		constructor(public canvasId: string)
		{
			this.Canvas = <HTMLCanvasElement>document.getElementById(canvasId);
			this.Context = this.Canvas.getContext('2d');
			
			this.RequestAnimationFrame = window.requestAnimationFrame.bind(
				window, this.OnUpdate.bind(this)
			);
			
			window.onfocus = () => this.HasFocus = true;
			window.onblur = () => this.HasFocus = false;
		}
		
		AddState(name: string, state: IState): void
		{
			this.States[name] = state;
		}
		
		Play(stateName: string): void
		{
			if (this.ActiveState)
			{
				this.CleanAfterState();
			}
			
			if (this.ActiveState = this.States[stateName]) {
				this.ActiveState.Game = this;
				this.ActiveState.Start();
			}
			else {
				throw new Error();
			}	
		}
		
		Start(): void
		{
			this.RequestAnimationFrame();
		}
		
		AddDOMEventListener(element: HTMLElement | Window , type: string, listener: EventListener): void
		{
			this.StateDOMListeners.push({element, type, listener});
			element.addEventListener(type, listener);
			// console.log('Adding listener', element, type);
		}
		
		RemoveDOMEventListener(element: HTMLElement | Window, type: string, listener: EventListener): void
		{
			for (let l of this.StateDOMListeners)
			{
				if (l.element === element && l.type === type && l.listener === listener)
				{
					RemoveElement(this.StateDOMListeners, l);
					element.removeEventListener(type, listener);
					// console.log('Removing listener', element, type);
					return;
				}
			}
			throw Error("Couldn't find event listener.")
		}
		
		private CleanAfterState(): void
		{
			for (let i = this.StateDOMListeners.length - 1; i >= 0; --i)
			{
				let l = this.StateDOMListeners[i];
				this.RemoveDOMEventListener(l.element, l.type, l.listener);
			}
			
			this.StateDOMListeners = [];

			if (this.ActiveState.Dispose)
			{
				this.ActiveState.Dispose();
			}
		}
		
		private OnUpdate(now): void
		{
			let timeDelta = now - this.LastFrameTime;
			
			if (!this.HasFocus && timeDelta < 50)
			{
				return this.RequestAnimationFrame();
			}
			
			if (timeDelta > 50) timeDelta = 50;
			
			
			this.TimeDelta = timeDelta / 1000;
			
			this.ActiveState.Update(this.TimeDelta);
			this.ActiveState.Draw(this.Context);
			
			this.LastFrameTime = now;
			this.RequestAnimationFrame();
		}
		
	}
	
}
