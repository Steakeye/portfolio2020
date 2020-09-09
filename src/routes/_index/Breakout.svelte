<style>
    @use 'src/styles/layout';

    .loading-node {
        @include layout.extendVisuallyHidden;
    }
</style>
<script>
    import type { SvelteComponent } from 'svelte';
    import {onMount} from 'svelte';

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
        width={400}
        height={400}
        physics={{ default: 'arcade' }}
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