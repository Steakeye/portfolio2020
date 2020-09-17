<style>
  @use 'sass:map' as sassMap;
  @use 'sass:string' as sassString;
  @use 'sass:color' as sassColor;
  @use 'src/styles/colour';
  @use 'src/styles/layout';
  @use 'src/styles/fonts';

  $navLayoutConfig: sassMap.get(layout.$layoutConfig, nav);
  $baseUnit: sassMap.get(layout.$layoutConfig, baseUnit);
  $navMarginTop: sassMap.get($navLayoutConfig, marginTop);

  nav {
    position: sticky;
    margin-top: #{$navMarginTop/$baseUnit}rem;
    z-index: 5;

    ul {
      display: flex;
      justify-content: center;

      li {
        display: block;

        a {
          //TODO: Move this map into the config.json
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
          background-color: rgba(colour.$brand-pink, .25);

          .linkText {
            @include layout.extendVisuallyHidden;
          }

          &:hover .linkText {
            @include layout.extendOverrideVisuallyHidden;
            background-color: colour.$brand-black;
            color: colour.$brand-white;
            position: absolute;
            bottom: -2.4rem;
            line-height: 1.2rem;
            padding: 0.5rem 0.5rem .3rem;
            border-radius: .5rem;
            font-size: 1.2rem;

            $pointerSquareSize: .8rem;

            &:after {
              content: '';
              position: absolute;
              height: $pointerSquareSize;
              width: $pointerSquareSize;
              background-color: inherit;
              top: -#{$pointerSquareSize/2};
              left: calc(50% - #{$pointerSquareSize/2});
              transform: rotateZ(45deg);
            }
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
