<style lang="scss">
  @use '../styles/colour';
  @use '../styles/fonts';
  @use '../styles/layout';
  @use '../styles/elements';

  %renderOver {
    position: relative;
    z-index: 5;
  }

  article > header {
    > h1 {
      @extend %renderOver;
      text-align: center;
      margin: 0 auto;
      position: fixed;
      width: 100vw;
      margin-left: -2rem;
      top: 50vh;
      font-family: Bungee Shade;
      color-scheme: blue;
      font-weight: 500;
      color: colour.$brand-yellow;
      font-size: 4rem;
      margin-top: -4rem;
    }

    > h2 {
      color: colour.$brand-white;
      font-size: 2.5rem;
      font-family: Pacifico;
      margin: 1em -2rem;
      position: fixed;
      text-align: center;
      top: 50vh;
      padding: 0 4rem;
      width: 100vw;
    }
  }

  .content-section {
    padding: 1rem;
    background-color: colour.$brand-pink-dark;
    text-align: left;

    @include layout.js-enabled {
      //TODO: add styling just for the modal
      &.modal {
        @extend %renderOver;

        box-shadow: 0 2.5px 10px opacify(colour.$brand-black, .5);
        position: fixed;
        left: 0;
        margin: 2rem;
        top: 0;

        &.open {
          opacity: 1;
        }

        .close-button {
          @include elements.extendIconOnlyButton;

          top: 0;
          right: 0;
          position: absolute;
          padding: 1rem;
          line-height: 1rem;

          &:before {
            @include fonts.coreUIIcon('x-circle');

            color: colour.$brand-yellow;
            width: 1rem;
            height: 1rem;
          }

          span {}
        }
      }
    }

    h3 {
      font-family: Bungee;
      border-bottom: 1px solid colour.$brand-yellow;
      padding-bottom: 1rem;

      &.modal {
        padding-right: 3rem;
      }
    }

    p {
      text-align: justify;
    }
  }
</style>
<script context="module">
    import { pages } from '../resources/content.json';
    import styles from "./index.scss";

    const { index: { header: { title, subTitle }, content: [{ title: aboutTitle, body: aboutBody }], modal: { closeButton: { text: closeText } } } } = pages
</script>
<script>
  import { onMount } from "svelte";
  import Breakout from "./_index/Breakout.svelte";

  let mounted: boolean = false;
  let modalOpen: boolean = false;

  function closeModal() {
      console.log('closeModal');
      modalOpen = false;
  }

  onMount(() => {
      mounted = true;
  })
</script>
<article>
    <header>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
    </header>
    <section
        class="content-section"
        class:modal={mounted}
        class:open={mounted}
        id="about">
        <h3>{aboutTitle}</h3>
        <p>{aboutBody}</p>
        {#if mounted}
            <button
                class="close-button"
                on:click={closeModal}>
                <span>{closeText}</span>
            </button>
        {/if}
    </section>
</article>
<Breakout className="{styles.breakoutWrapper}"/>