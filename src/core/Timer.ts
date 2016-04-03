/// <reference path="Utils.ts" />

namespace core {
	
	interface ITimerCallback
	{
		(callCount: number, ...args: any[]);
	}
	
	export class Timer
	{
		ElapsedTime: number = 0;
		CallCount: number = 0;
		Manager: TimersManager;
		
		constructor(
			public Callback: ITimerCallback,
			public Ctx: any,
			public Delay: number,
			public Interval: number = 0,
			/** How many times this callback can be called, 0 means -> infinite */
			public CallLimit: number = 1,
			public Args: any[]
		) { }
		
		/**
		 * @return whether this timer is done.
		 */
		Update(timeDelta): boolean
		{
			this.ElapsedTime += timeDelta;
			
			if (this.ElapsedTime > this.Delay)
			{
				if (this.CallLimit > 0 && this.CallCount > this.CallLimit - 1)
				{
					return true;
				}
				
				if (this.ElapsedTime - this.Delay > this.Interval * this.CallCount)
				{
					this.CallCount += 1;
					this.Callback.apply(this.Ctx, [this.CallCount].concat(this.Args))
				}
			}
			
			return false;
		}
		
		Stop(): void
		{
			if (this.Manager)
			{
				this.Manager.Remove(this);
			}
			else throw Error("This timer doesn't have manager.");
		}
	}
	
	export class TimersManager
	{
		private Timers: Timer[] = [];
		private ThrottledCallback: Function[] = [];
		
		Delay(delay: number, callback: ITimerCallback, ctx?: any, ...args): Timer
		{
			let timer = new Timer(callback, ctx, delay, undefined, 1, args);
			timer.Manager = this;
			this.Timers.push(timer);
			return timer;
		}
		
		Repeat(interval: number, callback: ITimerCallback, ctx?: any, callLimit = 0, delay: number = 0, ...args): Timer
		{
			let timer = new Timer(callback, ctx, delay, interval, callLimit, args);
			timer.Manager = this;
			this.Timers.push(timer);
			return timer;
		}
		
		Throttle(min: number, callback: Function, ctx?: any, ...args: any[]): void
		{
			let i = this.ThrottledCallback.indexOf(callback);
			
			if (i < 0)
			{
				callback.apply(ctx, args);
				this.ThrottledCallback.push(callback);
				this.Delay(min, () => RemoveElement(this.ThrottledCallback, callback));		
			}
		}
		
		Update(timeDelta: number): void
		{
			for(let i = this.Timers.length - 1; i >= 0; --i) 
			{
				let isDone = this.Timers[i].Update(timeDelta);
				
				if (isDone)
				{
					this.Timers.splice(i, 1);
				}
			}
		}
		
		Count(): number
		{
			return this.Timers.length;
		}
		
		/**
		 * TODO: Protect if this method is called from timer. Could remove collection while iterating
		 * over it.
		 */
		RemoveAll(): void
		{
			for(let timer of this.Timers) timer.Manager = undefined;
			this.Timers = [];
		}
		
		Remove(timer: Timer): void
		{
			RemoveElement(this.Timers, timer);
			timer.Manager = undefined;
		}
	}
}
