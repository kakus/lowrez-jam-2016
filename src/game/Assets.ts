/// <reference path="../gfx/SpriteSheet.ts" />

namespace game {
    
    // Index in spritesheet with cell size 24x24 and image width 240
    export var assets = 
    {
        HERO_FACE_UP : 1,
        HERO_FACE_LEFT : 2,
        HERO_FACE_RIGHT : 3,
        
        // these have difference index since, this index is counted from
        // grid [24, 48] with offset [0,24]
        FLOATING_TILE_FRAMES: [1, 2, 3, 4, 5],
        
        SMALL_SHADOW : 31,
        HEART: 33,
        ATTACK_BONUS: 34,
        TORCH_FRAMES: [41, 42, 43, 44],
        
        // same grid as floating tile frames
        RED_DEMON_FRAMES: [21, 22],
        BLUE_DEMON_FRAMES: [23, 24],
        GREEN_DEMON_FRAMES: [25, 26],
        PURPLE_DEMON_FRAMES: [27, 28],
        DARK_DEMON_FRAMES: [29, 30],
    }
    
}