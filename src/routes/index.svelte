<style lang="scss">
  @use '../styles/colour.scss';
  @use '../styles/layout';

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
    @extend %renderOver;
    padding: 1rem;
    background-color: colour.$brand-pink-dark;
    text-align: left;

    @include layout.js-enabled {
      //background-color: orange;
      //TODO: add styling just for the modal
    }

    h3 {
      border-bottom: 1px solid;
      padding-bottom: 1rem;
    }

    p {
      text-align: justify;
    }
  }
</style>
<script context="module">
    import { pages } from '../resources/content.json';
    import styles from "./index.scss";

    const { index: { header: { title, subTitle }, content: [{ title: aboutTitle, body: aboutBody }] } } = pages
</script>
<script>
  import Breakout from "./_index/Breakout.svelte";

</script>
<article>
    <header>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
    </header>
    <section class="content-section" id="about">
        <h3>{aboutTitle}</h3>
        <p>{aboutBody}</p>
    </section>
</article>
<Breakout className="{styles.breakoutWrapper}"/>