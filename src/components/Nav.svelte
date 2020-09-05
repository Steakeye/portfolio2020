<style>
  @use 'src/styles/layout';
  @use 'src/styles/fonts';
  //@use 'src/styles/type.scss';

  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;

    a {
      //cv options: read-the-docs, short-text
      $icons: (about: info, cv: short-text, github: github, linkedIn: linkedin, twitter: twitter, email: envelope-closed);

      @each $name, $icon in $icons {
        &.#{$name} {
          &:after {
          @include fonts.coreUIIcon($icon);
          }

          .linkText {
            @include layout.extendVisuallyHidden;
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import content from '../resources/content.json'

  const { global: { partials: { nav: { links } } } } = content;
</script>

<nav>
  <ul>
    {#each links as { name, href, text }}
    <li>
      <a class={name} href={href}>
        <strong class='linkText'>{text}</strong>
      </a>
    </li>
    {/each}
  </ul>
</nav>
