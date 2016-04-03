/// <reference path="Utils.ts" />

namespace core {
	
	export interface ILinkedListNode<T>
	{
		Next: T & ILinkedListNode<T>;	
		Prev: T & ILinkedListNode<T>;	
	}
	
	export class LinkedList<T extends ILinkedListNode<any>>
	{
		Head: T;
		Tail: T;
		Count: number = 0;
		
		Add(node: T): void
		{
			node.Prev = undefined;
			node.Next = undefined;
			
			if (this.Tail)
			{
				this.Tail.Next = node;
				node.Prev = this.Tail;
				this.Tail = node;
			}
			else
			{
				this.Head = this.Tail = node;
			}
			
			this.Count += 1;
		}
		
		/**
		 * @return Whether node was removed from list. It could happen that you trying to remove node, which
		 * doesn't belong to this list, then this method will return false.
		 */
		Remove(node: T): boolean
		{
			if (node.Next) 
			{
				// Check if this node actually exist in this list
				if (node.Next.Prev !== node) return false;
				
				if (node.Prev)
				{
					node.Prev.Next = node.Next;
					node.Next.Prev = node.Prev
				}
				else
				{
					node.Next.Prev = null;
					this.Head = node.Next;	
				}
			}
			else {
			
				if (node.Prev)
				{
					// Check if this node actually exist in this list
					if (node.Prev.Next !== node) return false;
					
					node.Prev.Next = null;
					this.Tail = node.Prev;	
				}
				else
				{
					if (node !== this.Head || node !== this.Tail) return;
					
					this.Head = this.Tail = null;
				}
			}
			
			this.Count -= 1;
			return true;
		}
	}
	
	export class ObservableLinkedList<T extends ILinkedListNode<any>> extends LinkedList<T>
	{
		OnAdd = new CallbackSet<(item: T) => void>();
		OnRemove = new CallbackSet<(item: T) => void>();
		
		Add(node: T): void
		{
			super.Add(node);
			this.OnAdd.CallAll(node);
		}
		
		Remove(node: T): boolean
		{
			if (super.Remove(node))
			{
				this.OnRemove.CallAll(node);
				return true;
			}
			return false;
		}
	}
}
