/// <reference path="../Actor.ts" />
/// <reference path="../Assets.ts" />

namespace game {
    
    export class AFloatingTile extends Actor
    {
        Sprite: core.Layer<gfx.Sprite>;
        
        constructor(x: number, y: number, sheet: gfx.SpriteSheet)
        {
            super(x, y, new core.Layer(0, 0, sheet.CellSize, sheet.CellSize * 2));
            let top = sheet.GetSprite(assets.FLOATING_TILE_TOP);
            let bottom = sheet.GetSprite(assets.FLOATING_TILE_BOTTOM);
            bottom.Position.y += top.Size.y;
            
            this.Sprite.AddChild(bottom, top);
        }
        
        Start(): void
        {
            
        }
        
        Restore(): void
        {
            this.Alpha = 1;
            this.IsActive = true;
        }
        
        Collapse(): void
        {
            this.IsActive = false;
            
            this.Tween.New(this)
                .To({Alpha: 0}, 0.5)
                .Parallel(this.Position, t => t
                    .To({y: this.Position.y + 5}, 0.5)
                    .Then()
                    .To({y: this.Position.y}, 0.1))
                .Start()
        }
    }
    
}