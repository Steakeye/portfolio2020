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
    position: fixed;
    width: 100vw;
    margin-left: -2rem;
    top: 50vh;
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
  }

  p {
    font-size: 1.6rem;
    margin: 1em auto;
    position: fixed;
    top: 50vh;
    margin-left: -2rem;
    padding: 0 25vw;
    width: 100vw;
  }
</style>

<script>
  import Breakout from "./_index/Breakout.svelte";
  import styles from "./index.scss";
</script>

<h1>Steakeye</h1>
<p><strong>Senior Front-end Development Services</strong></p>

<Breakout className="{styles.breakoutWrapper}"/>