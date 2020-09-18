<style lang="scss">
  @use '../styles/colour.scss';

  %renderOver {
    position: relative;
    z-index: 5;
  }

  h1,
  p {
    @extend %renderOver;
    text-align: center;
    margin: 0 auto;
  }

  :global(.content) h1 {
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

  h2 {
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
</style>

<script>
  import { pages } from '../resources/content.json';
  import Breakout from "./_index/Breakout.svelte";
  import styles from "./index.scss";

  const { index: { header: { title, subTitle } } } = pages
</script>

<h1>{title}</h1>
<h2>{subTitle}</h2>

<Breakout className="{styles.breakoutWrapper}"/>