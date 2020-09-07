<script>
    import {onMount} from 'svelte';
    import fragment from 'svelte-fragment';

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    let beforeMount = true;

    let Phaser;
    let Game;
    let Scene;
    let Text;
    let LoadingBar;
    let LoadingBar;

    onMount(async () => {
        const sveltePhaser = await import('svelte-phaser');

        Phaser = await import('phaser');
        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;

        LoadingBar = await import('./breakout/LoadingBar.svelte')

        beforeMount = false;
    });

    //let progress;

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
        >
            <template use:fragment slot="loading" let:progress>
                <svelte:component
                        this={LoadingBar} x={400} y={400} />
            </template>
        </Scene>
    </Game>
{/if}