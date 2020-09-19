<style>
    @use 'src/styles/colour';
    @use 'src/styles/fonts';
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

        $button-diamter: 3rem;

        .play-pause-button {
            @include layout.extendVisuallyHiddenNoClip;

            &:before {
                content: '';
                height: $button-diamter;
                width: $button-diamter;
                position: fixed;
                margin-top: 1rem;
                margin-right: 1rem;
                right: 0;
                background-color: colour.$brand-yellow;
                border-radius: $button-diamter/2;
                padding: .55rem .45rem;
            }

            &.playing:before, &.paused:before {
                font-weight: bold;
            }

            &.playing:before {
                @include fonts.coreUIIcon('media-pause');
            }

            &.paused:before {
                @include fonts.coreUIIcon('media-play');
                padding-left: .55rem;
            }
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
    const { playPauseButton: { pauseState: { text: pausedText }, playState: { text: playingText } }, game: { title } } = breakoutText;
    //const gameTitle = getter('pages.index.breakout.game.title'.split('.'), textContent)
    const sceneKey = 'breakoutScene'
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

    function pauseGame() {
        playState = gameState(GameState.PAUSED);
        gameInstance.scene.pause(sceneKey);
    }

    function toggleGameState() {
        if (gameState() === GameState.PAUSED) {
            playState = gameState(GameState.PLAYING);
            gameInstance.scene.resume(sceneKey);
        } else  {
            pauseGame();
        }
    }

    export let className = '';

    let beforeMount = true;
    let breakoutContainer: HTMLCanvasElement;
    let gameInstance: Phaser.Game;
    let Phaser: SvelteComponent;
    let Game: SvelteComponent;
    let Scene: SvelteComponent;
    let Text: SvelteComponent;
    let LoadingBar: SvelteComponent;
    let Arena: SvelteComponent;

    let exposedProgress;
    //let sceneInstance;
    let playState: State;

    initGameState();

    playState = gameState();

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

    $: playPauseText = playState === GameState.PAUSED ? pausedText : playingText;

    $: if (exposedProgress === 1) {
        playState = gameState(GameState.READY)
    }
</script>

<div class="breakout-wrapper {className}">
{#if beforeMount}
    <p class="loading-message">Loading...</p>
{:else}
    {#if playState !== GameState.UNINITIALIZED }
        <button
            on:click={toggleGameState}
            class="play-pause-button"
            class:playing={playState !== GameState.PAUSED}
            class:paused={playState === GameState.PAUSED}
        >
            {playPauseText}
        </button>
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
        bind:instance={gameInstance}
    >
        <Scene
            key={sceneKey}
            preload={loadAssets}
        >
            <div class="loading-node" slot="loading" let:progress>{assignExposedProgress(progress), ''}</div>
            {#if exposedProgress !== 1}
                <LoadingBar x={0} y={0} progress={exposedProgress}/>
            {/if}
            <Arena {pauseGame} />
        </Scene>
    </Game>
    {/if}
{/if}
</div>