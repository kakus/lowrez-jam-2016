/// <reference path="../gfx/SpriteSheet.ts" />

namespace game {
    
    // Index in spritesheet with cell size 24x24 and image width 240
    export var assets = 
    {
        HERO_FACE_UP : 1,
        HERO_FACE_LEFT : 2,
        HERO_FACE_RIGHT : 3,
        HERO_FALLING : 4,
        HERO_LANDING : [5, 6, 7, 8],
        
        // these have difference index since, this index is counted from
        // grid [24, 48] with offset [0,24]
        FLOATING_TILE_FRAMES: [1, 2, 3, 4, 5],
        
        SMALL_SHADOW : 31,
        HEART: [35, 36],
        ATTACK_BONUS: 34,
        SWORD: [71, 72, 73, 74, 75, 76, 77, 78],
        PLAYER_TORCH: [81, 82, 83, 84, 85, 86, 87, 88, 89],
        GREEN_TORCH_FRAMES: [41, 42, 43, 44],
        
        HEART_FRAME: 37,
        HEART_FILL: 38,
        
        RED_DEMON_FRAMES: [51, 52],
        BLUE_DEMON_FRAMES: [53, 54, 55, 56],
        GREEN_DEMON_FRAMES: [57, 58, 59, 60],
        PURPLE_DEMON_FRAMES: [244, 245, 246, 247],
        DARK_DEMON_FRAMES: [59, 60],
        
        // gui of fight scene
        // just position on 24x24 grid, size is different.
        FIGHT_DEMON_HEALTHBAR: 117,
        
        FIGHT_DEMON_MOUTH: {
            // index in 24x24 grid of top left pixel of image 64x64
            // size is manually changed.
            RED: [91, 94],
            BLUE: [124, 127],
            GREEN: [154, 157]
        },
    
        // Size 40x40    
        FIGHT_LIGHT_CONE: 97,
        
        MAIN_MENU_SCENE: [121, 151, 181, 211]
    }
    
}