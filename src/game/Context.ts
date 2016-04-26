namespace game {
    
    let PlayerSawTutorial = false;
    
    class Context
    {
        
        Purgatory: Purgatory;
        PlayState: state.PlayState;
        
        // ids of killed demons
        KilledDemons: string[] = [];
        // ids of picked up items
        AquiredItems: string[] = [];
        // number of player lifes
        LifesLeft = 3;
        
        SetPlayerSawTutorial(): void
        {
            PlayerSawTutorial = true;
        }
        
        GetPlayerSawTutorial(): boolean
        {
            return PlayerSawTutorial;  
        }
        
        IsOnlyBossAlive(): boolean
        {
            return this.KilledDemons.length === 4;
        }
        
        AllDemonsKilled(): boolean
        {
            return this.KilledDemons.length === 5;
        }
        
        PlayerHas(itemName: string): boolean
        {
            return this.AquiredItems.indexOf(itemName) !== -1;
        }
        
        DemonNeedsLight(demonName: string): boolean
        {
            return ['Dark', 'Purple', 'Green'].indexOf(demonName) !== -1;
        }
        
        Reset(): void
        {
            console.log("Reseting context.");
            context = new Context();
        }
    }
    
    export var context = new Context();
}