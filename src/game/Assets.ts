/// <reference path="../gfx/SpriteSheet.ts" />

namespace game {
    
    export var assets = 
    {
        HERO_FACE_UP : 1,
        HERO_FACE_LEFT : 2,
        HERO_FACE_RIGHT : 3,
        
        // these have difference index since, this index is counted from
        // grid [24, 48] with offset [0,24]
        FLOATING_TILE_FRAMES: [1, 2, 3, 4, 5],
        
        SMALL_SHADOW : 31,
        TORCH_FRAMES: [41, 42, 43, 44]
    }
    
}