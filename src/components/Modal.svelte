<style>
    @use '../styles/colour';
    @use '../styles/fonts';
    @use '../styles/layout';
    @use '../styles/elements';

    .modal-background {
        display: grid;
        align-content: center;
        justify-items: center;
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 100;
        top: 0;
        left: 0;
        opacity: 0;

        &.open {
            opacity: 1;
        }
    }

    .modal-content-wrapper {
        position: relative;
        box-shadow: 0 2.5px 10px opacify(colour.$brand-black, .5);
        max-height: calc(100vh - 6rem);

        @include layout.for-device(layout.$desktop) {
            width: 50vw;
        }

        .close-button {
            @include elements.extendIconOnlyButton;

            top: 0;
            right: 0;
            position: absolute;
            padding: 1rem;
            line-height: 1rem;
            margin-top: .2rem;

            &:before {
                @include fonts.coreUIIcon('x-circle');

                color: colour.$brand-yellow;
                width: 1rem;
                height: 1rem;
            }
        }
    }
</style>
<script context="module">
    import { onMount } from 'svelte';
    import { components } from '../resources/content.json';

    const { modal: { closeButton: { text: closeText } } } = components;
</script>
<script>
    export let id = ''
    export let className = ''
    let mounted = false;
    let open = true; //TODO change after debug

    function closeModal() {
        console.log('closeModal');
        open = false;
    }

    onMount(() => {
        mounted = true;
    });
</script>

{#if !mounted}
    <slot />
{:else}
    <div
            id:id
            class="modal-background"
            class:open
            class:className
    >
        <div class="modal-content-wrapper">
            <slot />
            <button
                    class="close-button"
                    on:click={closeModal}>
                <span>{closeText}</span>
            </button>
        </div>
    </div>
{/if}