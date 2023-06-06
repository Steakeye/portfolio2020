<script context="module">
  import config from '$lib/resources/config.json';

  const {
    breakout: {
      sizeUnit,
      loadingBar: { heightSize, progressColor, backgroundColor },
    },
  } = config;
  const height = sizeUnit * heightSize;
  const progressFill = parseInt(progressColor, 16);
  const backgroundFill = parseInt(backgroundColor, 16);
</script>

<script>
  import Phaser from 'phaser';
  import { Rectangle, Container } from 'svelte-phaser';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  const barWidth = 400;
  export let x;
  export let y;
  export let progress;
  const tweenedProgress = tweened(progress, {
    duration: 200,
    easing: cubicOut,
  });
  $: $tweenedProgress = progress;
</script>

<Container {x} {y} width="{barWidth}" height="{50}">
  <!-- outer bar -->
  <Rectangle width="{barWidth}" {height} fillColor="{backgroundFill}" {...$$restProps} />
  <!-- inner bar -->
  <Rectangle
    x="{-barWidth / 2}"
    originX="{0}"
    originY="{0.5}"
    width="{Phaser.Math.Clamp(barWidth * $tweenedProgress, 10, barWidth)}"
    {height}
    fillColor="{progressFill}"
  />
</Container>
