namespace game {
    
    class Context
    {
        Purgatory: Purgatory;
        MonsterFight: MonsterFight;
        PlayState: state.PlayState;    
    }
    
    export const context = new Context();
}
