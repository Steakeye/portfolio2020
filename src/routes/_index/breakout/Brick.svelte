<script context="module">
  import config from '/src/resources/config.json';
  import getter from 'ramda/src/path';

  const {
    breakout: { sizeUnit },
  } = config;
  const { defaultColor, defaultStroke, widthSize, heightSize } = getter('breakout.bricks'.split('.'), config);
  const width = sizeUnit * widthSize;
  const height = sizeUnit * heightSize;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Rectangle, getScene } from 'svelte-phaser';
  import Phaser from 'phaser';

  export let instance = undefined;
  export let x: number;
  export let y: number;
  export let fillColor = parseInt(defaultColor, 16);
  export let strokeColor = parseInt(defaultStroke, 16);
  export let scale = 1;
  const scaledWidth = scale * width;
  const scaledHeight = scale * height;

  onMount(() => {
    const scene = getScene();

    scene.physics.world.enable(instance, Phaser.Physics.Arcade.STATIC_BODY);
    instance.body.immovable = true;

    return () => {
      if (scene.children.exists(instance)) {
        scene.physics.world.disable(instance);
      }
    };
  });
</script>

<Rectangle
  bind:instance
  name="brick"
  {x}
  {y}
  {fillColor}
  {strokeColor}
  strokeWidth="1"
  width="{scaledWidth}"
  height="{scaledHeight}"
/>
