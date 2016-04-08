/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/Assert.ts" />
/// <reference path="SpriteSheet.ts" />
/// <reference path="../core/Math.ts" />


namespace gfx {
    
    class Animation
    {
        Progress: number = 0;
        Name: string = 'unnamed';
        
        constructor(
            public Frames: core.DisplayObject[],
            /** List of tuple (time_point, frame_id) */
            public Timeline: [number, number][],
            public Duration: number,
            public Loop = false
        ) {
            core.Assert(this.Duration > 0, "Duration has to be greater than 0.");
            core.Assert(this.Frames.length > 0, "Frames can't be empty."); 
            core.Assert(this.Timeline.every(([point, _]) => point >= 0 && point <= 1), "Timeline point has to be in range [0, 1].")
            core.Assert(this.Timeline.every(([point, _], i, frames) => {
                if (i < frames.length - 1)
                    return point < frames[i + 1][0]
                else
                    return point < 1;
            }), "Point on timeline has to be in ascending order.")
        }
        
        Update(timeDelta: number): void
        {
            this.Progress += timeDelta / this.Duration;
            
            if (this.Loop && this.Progress > 1) 
            {
                this.Progress -= 1;
            }
            this.Progress = core.math.Clamp(this.Progress, 0, 1);
        }
        
        GetFrame(progress: number = this.Progress): core.DisplayObject
        {
            for (let i = this.Timeline.length - 1; i >= 0; --i)
            {
                let [point, frame] = this.Timeline[i];
                if (point <= progress) return this.Frames[frame];
            }
            return undefined;
        }
        
        IsDone(): boolean
        {
            return this.Progress === 1;
        }
        
        Reset(): void
        {
            this.Progress = 0;
        }
    }
    
    export class Animator
    {
        Animations: { [name: string]: Animation } = { }
        ActiveAnimation: Animation;
        
        AddAnimation(name: string, indices: number[], data: gfx.SpriteSheet): Animation
        AddAnimation(name: string, indices: number[], data: core.DisplayObject[]): Animation
        AddAnimation(name: string, indices: number[], data): Animation
        {
            core.Assert(this.Animations[name] === undefined, "Can't override animation " + name);
            
            if (data instanceof gfx.SpriteSheet)
            {
                return this.AddAnimation_S(name, indices, data);
            }
            else
            {
                return this.AddAnimation_D(name, indices, data);
            }
        }
        
        Play(name: string): void
        {
            core.Assert(this.Animations[name] !== undefined, "Animation doesn't exist");
            
            if (this.ActiveAnimation && this.ActiveAnimation.IsDone())
            {
                this.ActiveAnimation.Reset();
            }
            
            this.ActiveAnimation = this.Animations[name];
        }
        
        RestartAnimation(): void
        {
            if (this.ActiveAnimation)
            {
                this.ActiveAnimation.Reset();
            }
        }
        
        Update(timeDelta: number): void
        {
            if (this.ActiveAnimation)
            {
                this.ActiveAnimation.Update(timeDelta);
            }
        }
        
        GetFrame(): core.DisplayObject
        {
            if (this.ActiveAnimation)
            {
                return this.ActiveAnimation.GetFrame();
            }
            else
            {
                throw new Error("There is no active frame.");
            }
        }
        
        IsAnimationDone(name: string): boolean
        {
            return this.Animations[name].IsDone();
        }
        
        private AddAnimation_S(name: string, indices: number[], data: gfx.SpriteSheet): Animation
        {
            let frames = indices
                            .filter((item, pos) => indices.indexOf(item) == pos) // remove duplicates
                            .map(id => data.GetSprite(id));
                
            indices = indices.map(idx => indices.indexOf(idx));
            
            return this.AddAnimation_D(name, indices, frames);
        }
        
        private AddAnimation_D(name: string, indices: number[], frames: core.DisplayObject[]): Animation
        {
            
            let timeline = indices.map((idx, pos) => [pos/indices.length, idx]);
            let anim = this.Animations[name] = new Animation(frames, timeline as [number, number][], 1);
            anim.Name = name;
            return anim;
        }
    }
    
}