<script>
    import { Sprite, ArcadePhysics, ArcadeCollider } from 'svelte-phaser'
    export let instance = undefined

    const ballProps = {
        name: "ball",
        texture: "ball",
        //scale: .5,
        width: "50",
        height: "50",
        displayWidth: "50",
        displayHeight: "50",
    }

    function handlePaddleCollide(event) {
        const { self, other: paddle } = event.detail
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

<Sprite bind:instance {...ballProps}>
    <ArcadePhysics collideWorldBounds bounce={1} />
    <ArcadeCollider with="bat" on:collide={handlePaddleCollide} />
</Sprite>
