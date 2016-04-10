namespace game {
    
    class Context
    {
        Purgatory: Purgatory;
        PlayState: state.PlayState;
        
        // ids of killed demons
        KilledDemons: string[] = [];
        // ids of picked up items
        AquiredItems: string[] = [];    
    }
    
    export const context = new Context();
}