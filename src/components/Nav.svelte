<style>
  @use 'src/styles/colour';
  @use 'src/styles/layout';
  @use 'src/styles/fonts';
  //@use 'src/styles/type.scss';

  nav {
    position: sticky;
    margin-top: 12rem;
    z-index: 5;

    ul {
      display: flex;
      justify-content: center;

      li {
        display: block;

        a {
        $icons: (
          about: info,
          cv: short-text,
          github: github,
          linkedIn: linkedin,
          twitter: twitter,
          email: envelope-closed
        );

          display: flex;
          padding: .5rem 1.2rem;
          line-height: 0;
          justify-content: center;

          .linkText {
            @include layout.extendVisuallyHidden;
          }

          &:hover .linkText {
            @include layout.extendOverrideVisuallyHidden;
            background-color: colour.$brand-black;
            color: colour.$brand-white;
            position: absolute;
            bottom: -2rem;
            line-height: 1.2rem;
            padding: .3rem .5rem;
            border-radius: .5rem;
          }

          &:after {
            font-size: 1.8rem;
          }

          @each $name, $icon in $icons {
            &.#{$name} {
              &:after {
                @include fonts.coreUIIcon($icon);
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
