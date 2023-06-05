<style lang="scss">
  @use '$lib/styles/colour';
  @use '$lib/styles/fonts';
  @use '$lib/styles/layout';
  @use '$lib/styles/elements';

  .modal-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    /* mobile viewport bug fix */
    height: -webkit-fill-available;
    z-index: 100;
    top: 0;
    left: 0;
    opacity: 0;

    &.open {
      display: grid;
      align-content: center;
      justify-items: center;
      opacity: 1;
    }
  }

  .modal-content-wrapper {
    @include colour.extendStandardBoxShadow;
    position: relative;
    margin: 3rem;
    overflow: hidden;
    max-height: 100vh;

    .close-button {
      @include elements.extendIconOnlyButton;

      top: 0;
      right: 0;
      position: absolute;
      padding: 1rem;
      line-height: 1rem;
      margin-top: 0.2rem;

      &:before {
        @include fonts.coreUIIcon('x-circle');

        color: colour.$brand-yellow;
        width: 1rem;
        height: 1rem;
      }
    }
  }
</style>

<script context="module" lang="ts">
  import { onMount } from 'svelte';
  import { sleep } from '$lib/utils/Runtime.ts';
  import { components } from '$lib/resources/content.json';
  import type { ModalActions } from './Modal.d.ts';
  import { ModalsActions } from './ModalAction.ts';

  const {
    modal: {
      closeButton: { text: closeText },
    },
  } = components;

  function assignModalBackgroundElProps(props, open: boolean, id?: string) {
    let hidden = !open;

    return { ...props, id, hidden, 'aria-hidden': hidden };
  }
</script>

<script lang="ts">
  export let id = '';
  export let targetId = '';
  export let className = '';
  export let renderBeforeOpen = true;

  let mounted = false;
  let open = false;
  let wrapperEl: HTMLDivElement;
  let modalBGProps = {};

  function openModal() {
    open = true;
  }

  function closeModal() {
    open = false;
  }

  onMount(async () => {
    mounted = true;

    let modalId = targetId || id;

    if (!modalId) {
      console.warn(`Modal is missing 'targetId' or 'id' property set, looking for nearest child with 'id' attribute`);

      await sleep(0); // This is just to guarantee the node is available

      //try to find first child element with an id to use as the target value
      if (wrapperEl) {
        const childWithId = Array.from(wrapperEl.children).filter((el: HTMLElement) => !!el.id)[0];

        modalId = childWithId?.id;
      }

      if (!modalId) {
        throw new Error(`Modal is missing 'targetId' or 'id', cannot create store entry for trigger bindings`);
      }
    }

    if (ModalsActions.has(modalId)) {
      throw new Error(
        `Modal id is already listed ias a key in the modal Map. Make sure your modal id values are unique.`,
      );
    }

    ModalsActions.set(modalId, { open: openModal, close: closeModal });

    return () => {
      //teardown
      ModalsActions.delete(modalId);
    };
  });

  $: {
    modalBGProps = assignModalBackgroundElProps(modalBGProps, open, id);
  }
</script>

{#if !mounted && renderBeforeOpen}
  <slot />
{:else if (mounted && renderBeforeOpen) || open}
  <div {...modalBGProps} class="modal-background" class:className class:open>
    <div bind:this="{wrapperEl}" class="modal-content-wrapper">
      <slot />
      <button class="close-button" on:click="{closeModal}">
        <span>{closeText}</span>
      </button>
    </div>
  </div>
{/if}
