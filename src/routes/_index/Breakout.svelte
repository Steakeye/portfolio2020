<style>
    @use 'src/styles/colour';
    @use 'src/styles/layout';

    .loading-node {
        @include layout.extendVisuallyHidden;
    }

    .breakout-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-image: linear-gradient(0deg, colour.$brand-black, transparent);

        .loading-message {
            text-align: center;
            width: 100vw;
            position: fixed;
            bottom: 2rem;
        }

        .play-pause-button {
            height: 2rem;
            width: 2rem;
        }
    }
</style>
<script context="module">
    import getter from "ramda/src/path";
    import config from '/src/resources/config.json';
    import { pages } from '/src/resources/content.json';
    import { State as GameState } from './breakout/State.ts';
    import type { State } from './breakout/State.ts';
    import type { BreakoutStateContext } from './breakout/StateContext.d.ts'

    const { breakout: { gameHeight, gameWidth } } = config
    const breakoutText = pages.index.breakout;
    const { playPauseButton: { pauseState: { text: pauseText }, playState: { text: playText } }, game: { title } } = breakoutText;
    //const gameTitle = getter('pages.index.breakout.game.title'.split('.'), textContent)
</script>
<script>
    import type { SvelteComponent } from 'svelte';
    import type { Phaser } from 'phaser';
    import {onMount} from 'svelte';
    import { init as initGameState, context as gameState } from './breakout/StateContext.ts';

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    function hasWebGLSupport(canvas: HTMLCanvasElement) {
        return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    }

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    function assignExposedProgress(updatedValue: number) {
        exposedProgress = updatedValue;
    }

    initGameState();

    export let className = '';

    let beforeMount = true;
    //let gameState: BreakoutStateContext = context();
    let breakoutContainer: HTMLCanvasElement;
    let Phaser: SvelteComponent;
    let Game: SvelteComponent;
    let Scene: SvelteComponent;
    let Text: SvelteComponent;
    let LoadingBar: SvelteComponent;
    let Arena: SvelteComponent;

    let exposedProgress;
    let sceneInstance;
    let playState: State = GameState.UNINITIALIZED;

    let state: State = gameState();

    $: if(state != gameState()) {
        console.log('gameState', gameState())
    }

    $: if (exposedProgress === 1) {
        //gameState.setState(GameState.READY);
        gameState(GameState.READY)
        console.log('exposed progress causes state to be set to ', gameState());
    }

    onMount(async () => {
        const sveltePhaser = await import('svelte-phaser');

        Phaser = await import('phaser');

        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;

        LoadingBar = (await import('./breakout/LoadingBar.svelte')).default;
        Arena = (await import('./breakout/Arena.svelte')).default;

        beforeMount = false;
    });
</script>

<div class="breakout-wrapper {className}">
{#if beforeMount}
    <p class="loading-message">Loading...</p>
{:else}
    {#if state !== GameState.UNINITIALIZED }
        <button class="play-pause-button"></button>
    {/if}
    <canvas bind:this={breakoutContainer} />
    {#if breakoutContainer}
    <Game
        {title}
        version="0.0.1a"
        width={gameWidth}
        height={gameHeight}
        physics={{
            default: 'arcade',
            /*arcade: {
                //debug: true, //TODO: Remove after debug complete
            },*/
        }}
        scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY }}
        transparent="true"
        canvas={breakoutContainer}
        type={ hasWebGLSupport(breakoutContainer) ? Phaser.WEBGL: Phaser.CANVAS }
    >
        <Scene
            key="main"
            preload={loadAssets}
            bind:this={sceneInstance}
        >
            <div class="loading-node" slot="loading" let:progress>{assignExposedProgress(progress), ''}</div>
            {#if exposedProgress !== 1}
                <LoadingBar x={0} y={0} progress={exposedProgress}/>
            {/if}
            <Arena />
        </Scene>
    </Game>
    {/if}
{/if}
</div>