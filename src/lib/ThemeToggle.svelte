<script lang="ts">
  import { theme, toggleTheme } from './theme.svelte'

  let { size = 'lg' }: { size?: 'lg' | 'sm' } = $props()

  const isLight = $derived(theme.current === 'persona5light')
</script>

<button
  type="button"
  class={['p5-icon-btn', size === 'sm' && 'p5-icon-btn-sm', isLight && 'is-light']}
  aria-label="Light theme"
  aria-pressed={isLight}
  onclick={toggleTheme}
>
  <!-- light: show the sun -->
  <svg xmlns="http://www.w3.org/2000/svg" class="icon sun" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5.64 17l-.71.71a1 1 0 001.41 1.41l.71-.71A1 1 0 005.64 17zM5 12a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm7-7a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zM5.64 7.05a1 1 0 001.41-1.41l-.71-.71a1 1 0 00-1.41 1.41zm12 .29a1 1 0 00.7-.29l.71-.71a1 1 0 10-1.41-1.41l-.71.71a1 1 0 00.71 1.7zM21 11h-1a1 1 0 000 2h1a1 1 0 000-2zm-9 8a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm6.36-2a1 1 0 00-1.41 1.41l.71.71a1 1 0 001.41-1.41zM12 6.5a5.5 5.5 0 105.5 5.5A5.51 5.51 0 0012 6.5z"
    />
  </svg>
  <!-- dark: show the moon -->
  <svg xmlns="http://www.w3.org/2000/svg" class="icon moon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-8.14-8.1 8.59 8.59 0 01.25-2A1 1 0 008 2.36a10.14 10.14 0 1014 11.69 1 1 0 00-.36-1.05z"
    />
  </svg>
</button>

<style>
  .icon {
    grid-area: 1 / 1;
    inline-size: 1.25rem;
    block-size: 1.25rem;
    fill: currentColor;
  }
  .sun {
    opacity: 0;
    rotate: 45deg;
  }
  .moon {
    opacity: 1;
    rotate: 0deg;
  }
  .is-light .sun {
    opacity: 1;
    rotate: 0deg;
  }
  .is-light .moon {
    opacity: 0;
    rotate: -45deg;
  }
  @media (prefers-reduced-motion: no-preference) {
    .icon {
      transition:
        opacity 0.2s cubic-bezier(0, 0, 0.2, 1),
        rotate 0.2s cubic-bezier(0, 0, 0.2, 1);
    }
  }
</style>
