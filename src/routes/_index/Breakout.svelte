<script>
    import {SvelteComponent} from 'svelte';
    import {onMount} from 'svelte';
    //import fragment from 'svelte-fragment';

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    let beforeMount = true;

    let bullshit = (...args) => {
        console.log('bs args', args)
    };
    let fragment;
    let Phaser: SvelteComponent;
    let Game: SvelteComponent;
    let Scene: SvelteComponent;
    let Text: SvelteComponent;
    let LoadingBar: SvelteComponent;
    let Arena: SvelteComponent;

    onMount(async () => {
        const sveltePhaser = await import('svelte-phaser');
        fragment = (await import('svelte-fragment')).default;
        Phaser = await import('phaser');

        /*console.log('sveltePhaser', sveltePhaser)
        console.log('Phaser', Phaser)*/

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
        >
            <template use:bullshit use:fragment slot="loading" let:progress>
                <LoadingBar x={400} y={400} /> <!--{progress} /-->
            </template>
            <Arena />
        </Scene>
    </Game>
{/if}