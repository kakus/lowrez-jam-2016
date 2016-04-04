/// <reference path="core/Game.ts" />
/// <reference path="state/SplashScreen.ts" />
/// <reference path="state/PlayState.ts" />
/// <reference path="state/Menu.ts" />
/// <reference path="state/Loading.ts" />


let mgame = new core.Game('canvas');
mgame.AddState('splash', new state.SplashScreen());
mgame.AddState('loading', new state.LoadingState());
mgame.AddState('menu', new state.Menu());
mgame.AddState('play', new state.PlayState());
mgame.Play('play');
mgame.Start();
