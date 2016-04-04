/// <reference path="Actor.ts" />

namespace game {
    
    export class Hero extends Actor
    {
        Start(): void
        {
            console.log("hello from hero.")
        }
    }
}