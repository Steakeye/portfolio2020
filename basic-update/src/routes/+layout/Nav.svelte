<style lang="scss">
  @use '$lib/styles/colour';
  @use '$lib/styles/layout';
  @use '$lib/styles/fonts';

  nav {
    margin-bottom: layout.$navMarginTopRem;
    position: relative;

    @include layout.js-enabled {
      margin-top: layout.$navMarginTopRem;
      position: sticky;
      z-index: 5;
    }

    ul {
      display: flex;
      justify-content: center;
      color: colour.$brand-black;

      li {
        display: block;
        background-color: colour.$brand-pink-dark;

        @include layout.js-enabled {
          background-color: transparent;
        }

        a {
          //TODO: Move this map into the config.json
          $icons: (
            about: info,
            cv: short-text,
            github: github,
            linkedIn: linkedin,
            twitter: twitter, // Seems to be a bug in the font scss, so this is the workaround mapping
            email: envelope-closed,
          );

          display: flex;
          padding: 0.5rem 1.2rem;
          line-height: 0;
          justify-content: center;
          background-color: rgba(colour.$brand-pink, 0.25);
          text-decoration: none;

          .linkText {
            @include layout.extendVisuallyHidden;
            background-color: colour.$brand-black;
            color: colour.$brand-white;
            bottom: -2.4rem;
            line-height: 1.2rem;
            padding: 0.5rem 0.5rem 0.3rem;
            border-radius: 0.5rem;
            font-size: 1.2rem;

            $pointerSquareSize: 0.8rem;

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

          &:hover,
          &:focus {
            background-color: rgba(colour.$brand-pink, 0.5);

            .linkText {
              @include layout.extendOverrideVisuallyHidden;
              position: absolute;
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

          @include layout.for-device(layout.$tablet--portrait) {
            padding: 1rem 2.4rem;

            .linkText {
              bottom: -4.8rem;
              line-height: 2.4rem;
              padding: 1rem 1rem 0.6rem;
              border-radius: 1rem;
              font-size: 2.4rem;

              $pointerSquareSizeLarge: 1.6rem;

              &:after {
                height: $pointerSquareSizeLarge;
                width: $pointerSquareSizeLarge;
                top: -#{$pointerSquareSizeLarge/2};
                left: calc(50% - #{$pointerSquareSizeLarge/2});
              }
            }

            &:after {
              font-size: 3.6rem;
            }
          }
        }
      }
    }
  }
</style>

<script context="module" lang="ts">
  import { onMount } from 'svelte';
  import { modalTrigger } from '$lib/components/modal/ModalAction.ts';
  import { navItemSelected } from '$lib/resources/event-keys.json';
  import content from '$lib/resources/content.json';
  import type { LinkProps } from './Nav.d.ts';

  const {
    siteWide: {
      partials: {
        nav: { links },
      },
    },
  } = content;
  const fullyQualifiedUrlTest = /^(?:http(s)?)?:\/\//;

  function isLinkToLocalTarget(href: string): boolean {
    return href.startsWith('#');
  }

  function isLinkExternal(href: string): boolean {
    return fullyQualifiedUrlTest.test(href);
  }

  function determineHrefTarget(href: string): '_self' | '_blank' {
    return isLinkExternal(href) || href.startsWith('mailto:') ? '_blank' : '_self';
  }

  function getLinkPropsFromHref(href: string): LinkProps {
    const target = determineHrefTarget(href);
    const external = isLinkExternal(href);
    const props: LinkProps = {
      external,
      target,
    };

    if (external) {
      props.rel = 'noreferrer';
    }

    return props;
  }
</script>

<script lang="ts">
  const linkElements: HTMLAnchorElement[] = [];

  onMount(() => {
    function handleNavMenuItemSelected(event: CustomEvent) {
      const {
        detail: { index },
      } = event;
      const elementToTarget = linkElements[index];
      elementToTarget.focus();
    }
    document.addEventListener(navItemSelected, handleNavMenuItemSelected);

    return () => {
      document.removeEventListener(handleNavMenuItemSelected);
    };
  });
</script>

<nav>
  <ul>
    {#each links as { name, href, text }, index}
      <li>
        {#if isLinkToLocalTarget(href)}
          <a bind:this="{linkElements[index]}" use:modalTrigger class="{name}" {href} {...getLinkPropsFromHref(href)}>
            <strong class="linkText">{text}</strong>
          </a>
        {:else}
          <a bind:this="{linkElements[index]}" class="{name}" {href} {...getLinkPropsFromHref(href)}>
            <strong class="linkText">{text}</strong>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
