<style>
  @use 'src/styles/layout';
  @use 'src/styles/fonts';
  //@use 'src/styles/type.scss';

  nav {
    position: sticky;
    margin-top: 12rem;

    ul {
      /*margin: 0;
      padding: 0;*/
      display: flex;
      justify-content: center;

      li {
        display: block;
        float: left;

        a {
        $icons: (
          about: info,
          cv: short-text,
          github: github,
          linkedIn: linkedin,
          twitter: twitter,
          email: envelope-closed
        );

          display: block;
          padding: .5rem .75rem;
          line-height: 0;

          &:after {
            font-size: 1.8rem;
          }

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
