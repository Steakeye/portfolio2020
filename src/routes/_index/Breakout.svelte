<style>
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
    }
</style>
<script context="module">
    import textContent from '/src/resources/content.json';
    import getter from "ramda/src/path";

    const gameTitle = getter('pages.index.breakout.game.title'.split('.'), textContent)
</script>
<script>
    import type { SvelteComponent } from 'svelte';
    import type { Phaser } from 'phaser';
    import {onMount} from 'svelte';

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

    export let className = '';

    let beforeMount = true;
    let breakoutContainer: HTMLCanvasElement;
    let Phaser: SvelteComponent;
    let Game: SvelteComponent;
    let Scene: SvelteComponent;
    let Text: SvelteComponent;
    let LoadingBar: SvelteComponent;
    let Arena: SvelteComponent;

    let exposedProgress;
    let sceneInstance;

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
    <canvas bind:this={breakoutContainer}></canvas>
    {#if breakoutContainer}
    <Game
        title={gameTitle}
        version="0.0.1a"
        width={400}
        height={400}
        physics={{
            default: 'arcade',
            arcade: {
                //debug: true, //TODO: Remove after debug complete
            },
        }}
        scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
        transparent="true"
        noop-disableContextMenu="true"
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
                <LoadingBar x={200} y={0} progress={exposedProgress}/>
            {/if}
            <Arena />
        </Scene>
    </Game>
    {/if}
{/if}
</div>