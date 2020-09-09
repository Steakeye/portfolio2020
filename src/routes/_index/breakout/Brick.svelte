<script context="module">
    import config from '/src/resources/config.json';
    import getter from "ramda/src/path";

    const { breakout: { sizeUnit } } = config
    const { defaultColor, defaultStroke, widthSize, heightSize } = getter('breakout.bricks'.split('.'), config)
    const width = sizeUnit * widthSize;
    const height = sizeUnit * heightSize;
</script>
<script>
    import { Sprite, Rectangle, ArcadePhysics, ArcadeCollider } from 'svelte-phaser'
    export let x;
    export let y;
    export let fillColor = parseInt(defaultColor, 16);
    export let strokeColor = parseInt(defaultStroke, 16);
    export let onBallHit;
</script>

<Rectangle name="brick" {x} {y} {fillColor} {strokeColor} {width} {height}>
    <ArcadePhysics immovable bodyType="static" />
    <ArcadeCollider with="ball" on:collide={onBallHit} />
</Rectangle>