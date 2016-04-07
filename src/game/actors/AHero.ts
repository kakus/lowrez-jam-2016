/// <reference path="../Actor.ts" />

namespace game {
    
    const JUMP_DURATION = 0.5;
    enum EFace { LEFT, RIGHT, UP };
    
    export class AHero extends Actor
    {
        Face = EFace.LEFT;
        Frames: { [face: number]: gfx.Sprite }
        Shadow: gfx.Sprite;
        
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, sheet.GetSprite(assets.HERO_FACE_LEFT));
            
            this.Frames = {};
            this.Frames[EFace.LEFT] = sheet.GetSprite(assets.HERO_FACE_LEFT);
            this.Frames[EFace.RIGHT] = sheet.GetSprite(assets.HERO_FACE_LEFT);
            this.Frames[EFace.RIGHT].Scale.x *= -1;
            this.Frames[EFace.UP] = sheet.GetSprite(assets.HERO_FACE_UP);
            
            for (let key in this.Frames) {
                let frame = this.Frames[key];
                frame.Anchor.Set(0.5, 0.5);
                core.vector.Scale(frame.Size, 0.5, frame.Position);
            }
            
            this.Shadow = sheet.GetSprite(assets.SMALL_SHADOW);
            this.UpdateSprite();
        }
         
        Start(): void
        {
            console.log("hello from hero.")
        }
        
        protected DrawSelf(ctx: CanvasRenderingContext2D): void
        {
            this.Shadow.Draw(ctx);
            this.Sprite.Draw(ctx);
        }
        
        PlayJump(dest: core.Vector): core.Tween
        {
            this.UpdateFace(dest);
            
            return this.Tween.New(this.Position)
                .To({x: dest.x, y: dest.y}, JUMP_DURATION, core.easing.SinusoidalInOut)
                .Parallel(this.Sprite.Position, t => t 
                    .To({y: this.Sprite.Position.y - 10}, JUMP_DURATION/2, core.easing.OutCubic)
                    .Then()
                    .To({y: this.Sprite.Position.y}, JUMP_DURATION/2))
                .Start();
        }
        
        private UpdateFace(dest: core.Vector): void
        {
            if (dest.y - this.Position.y < 0) 
            {
                this.Face = EFace.UP;
            }
            else 
            {
                this.Face = dest.x - this.Position.x > 0 ? EFace.RIGHT : EFace.LEFT;    
            }
            
            this.UpdateSprite();
        }
        
        private UpdateSprite()
        {
            this.Sprite = this.Frames[this.Face];
        }
    }
}