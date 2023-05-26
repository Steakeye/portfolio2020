<style lang="scss">
    @use '$lib/styles/colour';
    @use '../styles/type';
    @use '../styles/layout';

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 2rem;
        margin-bottom: 2rem;
        font-size: 2em;

        //> :global(#{type.$headers}, p) {
        > #{type.$headers}, p {
            color: colour.$brand-white;
        }
    }

    header {
        position: sticky;
        top: layout.$navMarginTopRem;
        z-index: 5;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: 100vw;
        background-color: colour.$brand-black;
        color: colour.$brand-white;
        font-size: 1.2rem;
        padding: 0.25rem 0.5rem;
        height: layout.$footer-height;

        .copyright {
            line-height: 1.62;
        }
    }
</style>
<div class='content'>
  <p>layout.svelte!! in routes!!</p>
</div>

<main class="content">
    <slot />
</main>