<style lang="scss">
  %renderOver {
    z-index: 5;
  }

  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    @extend %renderOver;
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    @extend %renderOver;
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<script>
  import Breakout from "./_index/Breakout.svelte";
  import styles from "./index.scss";
</script>

<h1>Steakeye</h1>
<p><strong>Senior Front-end Development Services</strong></p>

<Breakout className="{styles.breakoutWrapper}"/>