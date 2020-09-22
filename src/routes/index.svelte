<style>
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
  }
</style>
<script context="module">
    import { pages } from '../resources/content.json';
    import styles from "./index.scss";

    const { index: { header: { title, subTitle }, content: [{ title: aboutTitle, body: aboutBody }] } } = pages;
</script>
<script>
  import { onMount } from "svelte";
  import Modal from "../components/Modal.svelte";
  import Breakout from "./_index/Breakout.svelte";

  let mounted: boolean = false;
  let modalOpen: boolean = false;

  onMount(() => {
      mounted = true;
  })
</script>
<article>
    <header>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
    </header>
    <Modal>
        <section
            class="content-section"
            id="about">
            <h3>{aboutTitle}</h3>
            <p>{aboutBody}</p>
        </section>
    </Modal>
</article>
<Breakout className="{styles.breakoutWrapper}"/>