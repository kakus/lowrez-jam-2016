namespace game {
    
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
        
        IsOnlyBossAlive(): boolean
        {
            return this.KilledDemons.length === 4;
        }
        
        Reset(): void
        {
            console.log("Reseting context.");
            context = new Context();
        }
    }
    
    export var context = new Context();
}