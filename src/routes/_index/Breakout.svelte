<style lang="scss">
  @use 'src/styles/colour';
  @use 'src/styles/fonts';
  @use 'src/styles/layout';
  @use 'src/styles/elements';

  .loading-node {
    @include layout.extendVisuallyHidden;
  }

  .breakout-wrapper {
    $bottom-margin: layout.$footer-height;

    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    /* mobile viewport bug fix */
    max-height: -webkit-fill-available;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    background-image: linear-gradient(0deg, colour.$brand-black, transparent);

    .loading-message {
      @include layout.extendVisuallyHidden;

      @include layout.js-enabled {
        @include layout.extendOverrideVisuallyHidden;
        text-align: center;
        width: 100vw;
        position: fixed;
        bottom: 2rem;
      }
    }

    .play-pause-button {
      @include layout.extendVisuallyHiddenNoClip;

      top: 0;
      right: 0;
      color: colour.$brand-pink-dark;

      &:before {
        $button-diameter: 3rem;

        content: '';
        height: $button-diameter;
        width: $button-diameter;
        position: fixed;
        margin-top: 1rem;
        margin-right: 1rem;
        right: 0;
        background-color: colour.$brand-yellow;
        border-radius: $button-diameter/2;
        padding: 0.55rem 0.45rem;
      }

      &:focus:before {
        @include elements.extendHasFocus;
      }

      &.playing:before,
      &.paused:before {
        font-weight: bold;
      }

      &.playing:before {
        @include fonts.coreUIIcon('media-pause');
      }

      &.paused:before {
        @include fonts.coreUIIcon('media-play');
        padding-left: 0.55rem;
      }
    }

    @include layout.for-device(layout.$tablet--portrait) {
      > canvas {
        padding-bottom: $bottom-margin;
      }
    }
  }
</style>
<script context="module" lang="ts">
  import type { Phaser } from 'phaser';
  import getter from 'ramda/src/path';
  import config from '/src/resources/config.json';
  import { pages } from '/src/resources/content.json';
  import type { MediaQueryMatchMap } from '/src/components/media-query/MediaQueryStore.d';
  import { State as GameState } from './breakout/State.ts';
  import type { State } from './breakout/State.ts';
  import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

  const {
    breakout: {
      canvas: { height: canvasHeight, width: canvasWidth },
    },
  } = config;
  const breakoutText = pages.index.breakout;
  const {
    playPauseButton: {
      pauseState: { text: pausedText },
      playState: { text: playingText },
    },
    game: { title },
    noJavaScript: { text: noJSMessage },
  } = breakoutText;
  const sceneKey = 'breakoutScene';

  function hasWebGLSupport(canvas: HTMLCanvasElement) {
    return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  }

  function loadAssets(scene: Phaser.Scene) {
    scene.load.image('ball', roundelPath);
  }

  function isLandscapeMediaQuery(mediaQueryMatches: MediaQueryMatchMap<'landscape'> | null): boolean {
    return !!(mediaQueryMatches && mediaQueryMatches.landscape);
  }
</script>
<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { onMount } from 'svelte';
  import { init as initGameState, context as gameState } from './breakout/StateContext.ts';
  import { getMediaQueryContext } from '../../components/media-query/MediaQuery.svelte';

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
    } else {
      pauseGame();
    }
  }

  export let className = '';

  let mounted = false;
  let breakoutContainer: HTMLDivElement;
  let breakoutCanvas: HTMLCanvasElement;
  let gameInstance: Phaser.Game;
  let Phaser: SvelteComponent;
  let Game: SvelteComponent;
  let Scene: SvelteComponent;
  let LoadingBar: SvelteComponent;
  let Arena: SvelteComponent;
  let isLandscape: boolean;
  let exposedProgress;
  let playState: State;

  const mediaQueryStore: SvelteStore<MediaQueryMatchMap> = getMediaQueryContext();

  initGameState();

  playState = gameState();

  onMount(async () => {
    ({ Game, Scene } = await import('svelte-phaser'));

    Phaser = await import('phaser');
    LoadingBar = (await import('./breakout/LoadingBar.svelte')).default;
    Arena = (await import('./breakout/Arena.svelte')).default;

    isLandscape = isLandscapeMediaQuery($mediaQueryStore);

    mounted = true;
  });

  $: playPauseText = playState === GameState.PAUSED ? pausedText : playingText;

  $: if (exposedProgress === 1) {
    playState = gameState(GameState.READY);
  }
</script>
<section bind:this="{breakoutContainer}" class="breakout-wrapper {className}">
  {#if !mounted}
    <p class="loading-message">Loading...</p>
    <noscript>
      <p>{noJSMessage}</p>
    </noscript>
  {:else}
    {#if playState !== GameState.UNINITIALIZED}
      <button
        on:click="{toggleGameState}"
        class="play-pause-button"
        class:playing="{playState !== GameState.PAUSED}"
        class:paused="{playState === GameState.PAUSED}"
      >
        {playPauseText}
      </button>
    {/if}
    <canvas bind:this="{breakoutCanvas}"></canvas>
    {#if breakoutCanvas}
      <Game
        {title}
        version="0.0.1a"
        width="{isLandscape ? canvasHeight : canvasWidth}"
        height="{Math.min(breakoutContainer.clientHeight, canvasHeight)}"
        physics="{{ default: 'arcade' }}"
        scale="{{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY }}"
        transparent="true"
        canvas="{breakoutCanvas}"
        type="{hasWebGLSupport(breakoutCanvas) ? Phaser.WEBGL : Phaser.CANVAS}"
        bind:instance="{gameInstance}"
        on:postBoot="{() => console.log('game started!')}"
      >
        <Scene key="{sceneKey}" preload="{loadAssets}">
          <div class="loading-node" slot="loading" let:progress>{(assignExposedProgress(progress), '')}</div>
          {#if exposedProgress !== 1}
            <LoadingBar x="{0}" y="{0}" progress="{exposedProgress}" />
          {/if}
          <Arena {pauseGame} />
        </Scene>
      </Game>
    {/if}
  {/if}
</section>
