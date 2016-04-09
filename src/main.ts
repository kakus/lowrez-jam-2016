/// <reference path="core/Game.ts" />
/// <reference path="state/SplashScreen.ts" />
/// <reference path="state/PlayState.ts" />
/// <reference path="state/Menu.ts" />
/// <reference path="state/Loading.ts" />


let GAME = new core.Game('canvas');
GAME.AddState('splash', new state.SplashScreen());
GAME.AddState('loading', new state.LoadingState());
GAME.AddState('menu', new state.Menu());
GAME.AddState('play', new state.PlayState());
GAME.Play('play');
GAME.Start();
