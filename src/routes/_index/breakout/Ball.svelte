<script>
    import { Sprite, ArcadePhysics, ArcadeCollider } from 'svelte-phaser'
    export let instance = undefined

    export const props = Object.freeze({
        name: "ball",
        texture: "ball",
        //scale: .5,
        width: 25,
        height: 25,
        displayWidth: 25,
        displayHeight: 25,
    });

    function handlePaddleCollide({ detail: { self, other: paddle } }) {
        if (self.x < paddle.x) {
            const diff = paddle.x - self.x
            self.body.setVelocityX(-10 * diff)
        } else if (self.x > paddle.x) {
            const diff = self.x - paddle.x
            self.body.setVelocityX(10 * diff)
        } else {
            self.body.setVelocityX(2 + Math.random() * 8)
        }
    }
</script>

<Sprite bind:instance {...props}>
    <ArcadePhysics collideWorldBounds bounce={1} />
    <ArcadeCollider with="bat" on:collide={handlePaddleCollide} />
</Sprite>
