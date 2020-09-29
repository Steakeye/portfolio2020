<script context="module" lang="ts">
  import CustomEvent from 'custom-event';
  import eventKeys from '/src/resources/event-keys.json';
  import config from '/src/resources/config.json';
  import type { MediaQueryMatchMap } from '/src/components/media-query/MediaQueryStore.d';
  import { getCanvas } from './LayoutUtils.ts';

  const { navItemSelected } = eventKeys;
  const {
    ui: {
      layout: {
        nav: { marginTop: bricksYOffset },
      },
    },
    breakout: {
      sizeUnit,
      bat: { widthSize: brickWidthSize },
      bricks: { columns, rows, widthSize, heightSize },
    },
  } = config;
  const maxBricks = columns * rows;
  const brickWidth = sizeUnit * widthSize;
  const brickHeight = sizeUnit * heightSize;
  const batMargin = (sizeUnit * brickWidthSize) / 2;

  function isDevicePhone(mediaQueryMatches: MediaQueryMatchMap<'tablet'> | null): boolean {
    return !(mediaQueryMatches && mediaQueryMatches.tablet);
  }

  function deriveScaleFromMediaQuery(
    mediaQueryMatches: MediaQueryMatchMap<'tablet'> | null,
  ): number {
    return isDevicePhone(mediaQueryMatches) ? 1 : 2;
  }

  function deriveYOffsetFromMediaQuery(
    mediaQueryMatches: MediaQueryMatchMap<'tablet' | 'retina'> | null,
  ): number {
    return isDevicePhone(mediaQueryMatches) ? 0 : mediaQueryMatches.retina ? 2 : 4;
  }
</script>

<script lang="ts">
  import type Phaser from 'phaser';
  import { onMount } from 'svelte';
  import { onGameEvent, onInputEvent, getGame, getScene } from 'svelte-phaser';
  import { getMediaQueryContext } from '/src/components/media-query/MediaQuery.svelte';
  import Group from '/src/components/svelte-phaser/Group.svelte';
  import Bat from './Bat.svelte';
  import Ball from './Ball.svelte';
  import Brick from './Brick.svelte';
  import { getSceneToCanvasRatio } from './LayoutUtils.ts';

  const mediaQueryStore = getMediaQueryContext();
  const mediaQueryMatches = $mediaQueryStore;
  const mediaQueryScale = deriveScaleFromMediaQuery(mediaQueryMatches);
  const game: Phaser.Game = getGame();
  const scene = getScene();
  const sceneSize = scene.sys.game.scale.gameSize;
  const { height: sceneHeight, width: sceneWidth } = sceneSize;
  const sceneToCanvasRatio = getSceneToCanvasRatio(game);
  const scaledBrickWidth = mediaQueryScale * sceneToCanvasRatio * brickWidth;
  const scaledBrickHeight = mediaQueryScale * sceneToCanvasRatio * brickHeight;
  const bricksXOffset = (sceneWidth + scaledBrickWidth - scaledBrickWidth * columns) / 2;
  const bricks = [];
  const deviceBasedYOffset = deriveYOffsetFromMediaQuery(mediaQueryMatches);
  const actualBricksYOffset =
    scaledBrickHeight / 2 + sceneToCanvasRatio * bricksYOffset + deviceBasedYOffset;

  export let pauseGame: () => void;
  let bat: Phaser.GameObjects.Rectangle;
  let ball: Phaser.GameObjects.Sprite;
  let ballProps;
  let bricksGroup: Phaser.GameObjects.Group;
  let bricksConfig: {
    x: number;
    y: number;
    key: number;
  }[];
  let isBallLaunched = false;
  let resetting = false;

  function setBallPosition() {
    ball.setPosition(bat.x, bat.y - bat.height / 2 - ballProps.height / 2);
  }

  function resetBatAndBall() {
    ball.body.setVelocity(0);
    setBallPosition();
    isBallLaunched = false;
  }

  function resetBricks() {
    bricksGroup.setVisible(true);
    bricks.forEach((brick: Phaser.GameObjects.GameObject) => brick.setActive(true));
    scene.physics.world.enable(bricks);
    resetting = false;
  }

  function resetGame() {
    resetBatAndBall();
    resetting = true;
    //We can't reset everything in the same tick/frame, because the ball is still in its last position when the
    // bricks are reactivated, meaning we inadvertently hit that last ball again!
  }

  function isBrickInLinkRow(brick: Phaser.GameObjects.Rectangle): number | false {
    const index = bricks.indexOf(brick);
    const isInLinkRow = index > -1 && index < columns;

    return isInLinkRow ? index : false;
  }

  function handleLinkBrickHit(brickIndex: number) {
    const navSelectedEvent = new CustomEvent(navItemSelected, {
      bubbles: true,
      detail: {
        index: brickIndex,
      },
    });

    getCanvas(game).dispatchEvent(navSelectedEvent);
  }

  function onBallHitBrick(ball: Phaser.GameObjects.Sprite, brick: Phaser.GameObjects.Rectangle) {
    bricksGroup.killAndHide(brick as Phaser.GameObjects.GameObject);
    scene.physics.world.disable(brick);

    const linkIndex = isBrickInLinkRow(brick);
    if (linkIndex !== false) {
      pauseGame();
      handleLinkBrickHit(linkIndex);
    }
  }

  // set collisions on all edges of world except bottom
  scene.physics.world.setBoundsCollision(true, true, true, false);

  // setup game
  {
    const brickHeightPlusSpacer = scaledBrickHeight + 1;

    // create an array of 60 bricksConfig
    bricksConfig = Array.from({ length: maxBricks }).map((_, index) => {
      return {
        x: (index % columns) * scaledBrickWidth,
        y: Math.floor(index / columns) * brickHeightPlusSpacer,
        key: index,
      };
    });
  }

  onMount(() => {
    scene.physics.add.collider(ball, bricksGroup, onBallHitBrick);
  });

  const gameReady = () => !isBallLaunched;
  const gameBallLost = () => ball.y > sceneHeight;
  const gameWon = () => bricksGroup.countActive() === 0;
  const gameResetting = () => resetting;

  onGameEvent('step', () => {
    switch (true) {
      case gameResetting():
        resetBricks();
        break;
      case gameWon():
        resetGame();
        break;
      case gameBallLost():
        resetBatAndBall();
        break;
      case gameReady():
        setBallPosition();
        break;
    }
  });

  // launch ball on click - pointerup makes the experience better on touch devices
  onInputEvent('pointerup', () => {
    if (!isBallLaunched) {
      isBallLaunched = true;
      (ball.body as Phaser.Physics.Arcade.Body).setVelocity(-sizeUnit * 2, -sceneHeight);
    }
  });
</script>

<Group options="{{ name: 'bricks' }}" bind:instance="{bricksGroup}" items="{bricks}" />
{#each bricksConfig as brickConfig, index (brickConfig.key)}
  <Brick
    x="{brickConfig.x + bricksXOffset}"
    y="{brickConfig.y + actualBricksYOffset}"
    bind:instance="{bricks[index]}"
    scale="{mediaQueryScale * sceneToCanvasRatio}"
  />
{/each}
<Bat
  bind:instance="{bat}"
  x="{sceneWidth / 2}"
  y="{sceneHeight - sizeUnit}"
  xMin="{batMargin}"
  xMax="{sceneWidth - batMargin}"
/>
<Ball bind:instance="{ball}" bind:props="{ballProps}" />
