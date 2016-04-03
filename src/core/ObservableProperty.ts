/// <reference path="Utils.ts" />

namespace core {
	
	export class ObservableProperty<T>
	{
		OnChange = new CallbackSet<(newValue: T, oldValue: T) => void>();
		
		constructor(
			protected Value: T
		) { }
		
		Get(): T
		{
			return this.Value;
		}
		
		Set(newValue: T): void
		{
			let oldValue = this.Value;
			this.Value = newValue;
			this.OnChange.CallAll(newValue, oldValue);
		}
		
		toString(): string
		{
			return this.Value.toString();
		}
	}
	
	export class ObservableNumber extends ObservableProperty<number>
	{
		Increment(value = 1): void
		{
			this.Set(this.Value + value);
		}
	}
}
