<style lang="scss">
  @use '$lib/styles/colour';
  @use '$lib/styles/fonts';
  @use '$lib/styles/layout';
  @use '$lib/styles/elements';

  %renderOver {
    position: relative;
    z-index: 5;
  }

  article > header {
    > h1 {
      text-align: center;
      font-family: Bungee Shade;
      font-weight: 500;
      color: colour.$brand-yellow;
      font-size: 4rem;

      @include layout.js-enabled {
        @extend %renderOver;
        margin: -4rem auto 0 -2rem;
        width: 100vw;
        top: 50vh;
        position: fixed;
      }
    }

    > h2 {
      color: colour.$brand-white;
      font-size: 2.5rem;
      font-family: Pacifico;
      text-align: center;

      @include layout.js-enabled {
        margin: 1em -2rem;
        position: fixed;
        top: 50vh;
        padding: 0 4rem;
        width: 100vw;
      }
    }
  }

  .promo-message {
    @extend %renderOver;
    @include colour.extendStandardBoxShadow;

    $promoFlagDimensions: 20rem;
    $promoFlagPosition: 0 - $promoFlagDimensions/2;

    background-color: colour.$brand-blue;
    height: $promoFlagDimensions;
    width: $promoFlagDimensions;
    position: fixed;
    top: $promoFlagPosition;
    left: $promoFlagPosition;
    transform: rotateZ(-45deg);
    text-align: center;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    p {
      font-family: bungee;
      padding: 0 3rem 0.5rem;
      font-size: 3rem;
      line-height: 1em;
      text-shadow: -2px 2px 0px colour.$brand-blue-dark;
    }
  }

  .content-section {
    padding: 1rem;
    background-color: colour.$brand-pink-dark;
    text-align: left;

    $content-width: 52rem;

    @include layout.for-device(layout.$tablet--portrait) {
      max-width: $content-width;
      margin: auto;
    }

    h3 {
      font-family: Bungee;
      border-bottom: 1px solid colour.$brand-yellow;
      padding-bottom: 1rem;

      :global(.modal) & {
        padding-right: 3rem;
      }
    }

    p {
      text-align: justify;
    }

    :global(.modal-content-wrapper) & {
      overflow-y: auto;
      max-height: 100%;

      h3 {
        background-color: colour.$brand-pink-dark;
        position: sticky;
        padding-top: 1rem;
        padding-left: 1rem;
        top: -1rem;
        right: -1rem;
        margin: -1rem -1rem 1rem;
      }
    }
  }
</style>

<script context="module">
    import { pages } from '$lib/resources/content.json';
    import styles from './+page.scss';

    const {
        index: {
            header: { title, subTitle },
            aside: { promo },
            content: [{ title: aboutTitle, body: aboutBody }],
        },
    } = pages;
</script>

<script>
    import Modal from '$lib/components/modal/Modal.svelte';
</script>

<article>
    <header>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
    </header>
    <aside class="promo-message">
        <p>
            <strong>{promo}</strong>
        </p>
    </aside>
    <Modal>
        <section class="content-section" id="about">
            <h3>{aboutTitle}</h3>
            {#if Array.isArray(aboutBody)}
                {#each aboutBody as bodyItem}
                    <p>{bodyItem}</p>
                {/each}
            {:else}
                <p>{aboutBody}</p>
            {/if}
        </section>
    </Modal>
</article>