<script context="module">
    import config from '/src/resources/config.json';

    const { breakout: { sizeUnit, bricks: { columns, rows, widthSize, heightSize } } } = config;
    const maxBricks = columns * rows;
    const spacerUnit = sizeUnit * .6;
    const brickWidth = sizeUnit * widthSize;
    const brickHeight = sizeUnit * heightSize;
</script>
<script>
    import type { Phaser } from 'phaser'
    import { onMount } from 'svelte'
    import { onGameEvent, onInputEvent, getGame, getScene } from 'svelte-phaser';
    import Group from '/src/components/svelte-phaser/Group.svelte';
    import Bat from './Bat.svelte';
    import Ball from './Ball.svelte';
    import Brick from './Brick.svelte';

    // setup game
    function setup() {
        isBallLaunched = false

        const brickWidthPlusSpacer = brickWidth + spacerUnit;
        const brickHeightPlusSpacer = brickHeight + spacerUnit;

        // create an array of 60 bricksConfig
        bricksConfig = Array.from({ length: maxBricks }).map((_, index) => {
            return {
                x: (index % columns) * brickWidthPlusSpacer,
                y: Math.floor(index / columns) * brickHeightPlusSpacer,
                key: index,
            }
        })
    }

    function onBallHitBrick(ball: Phaser.GameObjects.Sprite, brick: Phaser.GameObjects.Rectangle) {
        //bricksConfig = bricksConfig.filter(b => b !== brickConfig)
        console.log('onBallHitBrick', arguments)
        group.killAndHide(brick as Phaser.GameObjects.GameObject);
    }

    const game: Phaser.Game = getGame();
    const scene = getScene();
    const sceneSize = scene.sys.game.scale.gameSize
    const { height: sceneHeight, width: sceneWidth } = sceneSize;

    // set collisions on all edges of world except bottom
    scene.physics.world.setBoundsCollision(true, true, true, false);

    let isBallLaunched = false;
    let bat;
    let ball;
    let group: Phaser.GameObjects.Group;
    let bricksConfig = [];

    setup()

    onMount(() => {
        console.log('Arena.onMount');
        console.log('group', group);
        console.log('bricks', bricks);
        group.setOrigin(0);
        group.incXY(sizeUnit/2, sizeUnit);
        //scene.physics.add.overlap(bat, bricks, onBallHitBrick) // <-- TODO: start here, memory leak? Why is the event always firing?
        //scene.physics.add.overlap(ball, group, onBallHitBrick) // <-- TODO: start here, memory leak? Why is the event always firing?
        //scene.physics.add.overlap(ball, bricks[bricks.length - 1], onBallHitBrick) // <-- TODO: start here, memory leak? Why is the event always firing?
        //scene.physics.add.collider(ball, bricks[bricks.length - 1], onBallHitBrick) // <-- TODO: start here, memory leak? Why is the event always firing?
    });

    onGameEvent('step', () => {
        // snap ball to bat
        if (!isBallLaunched) {
            ball.setPosition(bat.x, bat.y - sizeUnit)
        }
        // reset ball after it hits bottom of screen
        if (ball.y > sceneHeight) {
            ball.body.setVelocity(0)
            isBallLaunched = false
        }
        // you win!
        if (bricksConfig.length === 0) {
            ball.body.setVelocity(0)
            setup()
        }
    })
    // launch ball on click
    onInputEvent('pointerdown', () => {
        if (!isBallLaunched) {
            isBallLaunched = true
            ball.body.setVelocity(-sizeUnit*2, -400)
        }
    })

    const bricks = [];
</script>

<Group options={{ name: 'bricks' }} bind:instance={group} items={bricks} />
{#each bricksConfig as brickConfig, index (brickConfig.key)}
    <Brick
        x={brickConfig.x}
        y={brickConfig.y}
        onBallHit={() => {
            bricksConfig = bricksConfig.filter(b => b !== brickConfig)
        }}
        bind:instance={bricks[index]}
    />
{/each}
<Bat bind:instance={bat} x={sceneWidth/2} y={sceneHeight - sizeUnit} />
<Ball bind:instance={ball} />