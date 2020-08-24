<link lang="scss" href="index.scss">
<style lang="scss">
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
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
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<script>
  import styles from "index.scss";
  export let css = styles;
</script>

<svelte:head>
  <title>Steakeye - Senior Front End Developer</title>
</svelte:head>

<h1>Great success!</h1>

<figure class={css.background}>
  <img alt="Success Kid" src="successkid.jpg" />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
  <strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong>
</p>
