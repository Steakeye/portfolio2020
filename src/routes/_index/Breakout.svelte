<style>
    @use 'src/styles/layout';

    .loading-node {
        @include layout.extendVisuallyHidden;
    }
</style>
<script context="module">
    import textContent from '/src/resources/content.json';
    import getter from "ramda/src/path";

    const gameTitle = getter('pages.index.breakout.game.title'.split('.'), textContent)
</script>
<script>
    import type { SvelteComponent } from 'svelte';
    import {onMount} from 'svelte';
    //import getter from 'ramda/src/path'

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    function assignExposedProgress(updatedValue: number) {
        exposedProgress = updatedValue;
    }

    let beforeMount = true;

    let removeFromParent;
    let fragment;
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
        fragment = (await import('svelte-fragment')).default;
        Phaser = await import('phaser');

        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;

        LoadingBar = (await import('./breakout/LoadingBar.svelte')).default;
        Arena = (await import('./breakout/Arena.svelte')).default;

        beforeMount = false;
    });
</script>

{#if beforeMount}
    <div>Loading...</div>
{:else}
    <Game
        title={gameTitle}
        width={400}
        height={400}
        physics={{
            default: 'arcade',
            arcade: {
                debug: true,
            },
        }}
        scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
        noop-transparent="true"
    >
        <Scene
            key="main"
            preload={loadAssets}
            bind:this={sceneInstance}
        >
            <div class="loading-node" slot="loading" let:progress>{assignExposedProgress(progress), ''}</div>
            {#if exposedProgress !== 1}
                <LoadingBar x={400} y={0} progress={exposedProgress}/>
            {/if}
            <Arena />
        </Scene>
    </Game>
{/if}