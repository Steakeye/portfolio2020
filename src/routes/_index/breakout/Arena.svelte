<script context="module">
    import config from '/src/resources/config.json';

    const { ui: { layout: { nav: { marginTop: bricksYOffset }} }, breakout: { gameWidth, sizeUnit, bricks: { columns, rows, widthSize, heightSize } } } = config;
    const maxBricks = columns * rows;
    const spacerUnit = sizeUnit * .6;
    const brickWidth = sizeUnit * widthSize;
    const brickHeight = sizeUnit * heightSize;
    //const bricksXOffset = (gameWidth - (brickWidth * rows))/2 - brickWidth/2;
</script>
<script>
    import type Phaser from 'phaser';
    import { onMount } from 'svelte';
    import { onGameEvent, onInputEvent, getGame, getScene } from 'svelte-phaser';
    import Group from '/src/components/svelte-phaser/Group.svelte';
    import Bat from './Bat.svelte';
    import Ball from './Ball.svelte';
    import Brick from './Brick.svelte';
    import { getSceneToCanvasRatio } from "./LayoutUtils.ts";

    const game: Phaser.Game = getGame();
    const sceneToCanvasRatio = getSceneToCanvasRatio(game);
    const scaledBrickWidth = sceneToCanvasRatio * brickWidth;
    const bricksXOffset = (gameWidth - (scaledBrickWidth * rows))/2 - scaledBrickWidth/2;

    let isBallLaunched = false;
    let resetting = false;

    function setBallPosition() {
        ball.setPosition(bat.x, bat.y - bat.height)
    }

    function resetBatAndBall() {
        ball.body.setVelocity(0);
        setBallPosition();
        isBallLaunched = false
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

    function onBallHitBrick(ball: Phaser.GameObjects.Sprite, brick: Phaser.GameObjects.Rectangle) {
        bricksGroup.killAndHide(brick as Phaser.GameObjects.GameObject);
        scene.physics.world.disable(brick);
    }

    const scene = getScene();
    const sceneSize = scene.sys.game.scale.gameSize;
    const { height: sceneHeight, width: sceneWidth } = sceneSize;

    const actualBricksYOffset = sceneToCanvasRatio * (bricksYOffset + brickHeight/2);

    // set collisions on all edges of world except bottom
    scene.physics.world.setBoundsCollision(true, true, true, false);

    let bat;
    let ball;
    let bricksGroup: Phaser.GameObjects.Group;
    let bricksConfig;
    const bricks = [];

    // setup game
    {
        const brickHeightPlusSpacer = brickHeight + spacerUnit;

        // create an array of 60 bricksConfig
        bricksConfig = Array.from({ length: maxBricks }).map((_, index) => {
            return {
                x: (index % columns) * scaledBrickWidth,
                y: Math.floor(index / columns) * brickHeightPlusSpacer,
                key: index,
            }
        })
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
            case gameResetting(): resetBricks(); break;
            case gameWon(): resetGame(); break;
            case gameBallLost(): resetBatAndBall(); break;
            case gameReady(): setBallPosition(); break;
        }
    })

    // launch ball on click
    onInputEvent('pointerdown', () => {
        if (!isBallLaunched) {
            isBallLaunched = true
            ball.body.setVelocity(-sizeUnit*2, -sceneHeight);
        }
    })

</script>

<Group options={{ name: 'bricks' }} bind:instance={bricksGroup} items={bricks} />
{#each bricksConfig as brickConfig, index (brickConfig.key)}
    <Brick
        x={brickConfig.x + bricksXOffset}
        y={brickConfig.y + actualBricksYOffset}
        bind:instance={bricks[index]}
        scale={sceneToCanvasRatio}
    />
{/each}
<Bat bind:instance={bat} x={sceneWidth/2} y={sceneHeight - sizeUnit} xMin={sizeUnit * 1.5} xMax={sceneWidth - (sizeUnit * 1.5)}/>
<Ball bind:instance={ball} />