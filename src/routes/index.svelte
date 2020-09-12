<style lang="scss">
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

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  /*@media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }*/
</style>

<script>
  import Breakout from "./_index/Breakout.svelte";
  import styles from "./index.scss";
</script>

<h1>Steakeye</h1>
<p><strong>Senior Front-end Development Services</strong></p>

<Breakout className="{styles.breakoutWrapper}"/>