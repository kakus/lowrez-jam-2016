namespace game {
    
    class Context
    {
        Purgatory: Purgatory;
        PlayState: state.PlayState;
        
        // ids of killed demons
        KilledDemons: string[] = [];
        // ids of picked up items
        AquiredItems: string[] = [];
        
        IsOnlyBossAlive(): boolean
        {
            return this.KilledDemons.length === 4;
        }    
    }
    
    export const context = new Context();
}