<!-- routify:meta reset -->
<script lang="ts">
  import { url } from '@roxi/routify'
  import ThemeToggle from '../lib/ThemeToggle.svelte'
  import RansomTitle from '../lib/RansomTitle.svelte'
  import P5Chip from '../lib/P5Chip.svelte'
  import P5Button from '../lib/P5Button.svelte'
  import { PERSONA5 } from '../lib/ransom'

  const links = [
    { path: '/shape-idea', label: 'Shape Idea' },
    { path: '/geometry-visualization', label: 'Geometry Visualization' },
    { path: '/addtriangle-visualization', label: 'Add Triangle Visualization' },
    { path: '/skew-tangent-visualization', label: 'Skew Tangent Visualization' },
    { path: '/unity-web-build', label: 'Demo Unity Web Build' },
  ]
</script>

<svelte:head>
  <title>Persona 5 Okumura Kunikazu Timer</title>
</svelte:head>

<div class="home">
  <div class="theme-slot">
    <ThemeToggle />
  </div>
  <main class="wrap">
    <h1 class="title">
      <span class="sr-only">Persona 5 Okumura Kunikazu Timer</span>
      <RansomTitle text="Persona5" styles={PERSONA5} size="clamp(30px, 4.2vw, 56px)" pad=".06em .16em .04em" />
      <span class="chips" aria-hidden="true">
        <P5Chip tone="yellow" r={-2}>Okumura</P5Chip>
        <P5Chip tone="paper" r={1.5} y={3}>Kunikazu</P5Chip>
        <P5Chip tone="ink" r={-3}>Timer</P5Chip>
      </span>
    </h1>
    <nav class="links" aria-label="Visualizations">
      {#each links as { path, label }, i (path)}
        <P5Button href={$url(path)} r={i % 2 ? -1 : -2}>{label}</P5Button>
      {/each}
    </nav>
  </main>
</div>

<style>
  .home {
    position: relative;
    isolation: isolate;
    flex: 1;
    display: grid;
    place-items: center;
    min-height: 100svh;
    padding: 4rem 1.5rem;
    overflow: hidden;
    text-align: center;
    color: var(--p-ink);
    background: var(--p-page-bg);
    transition: background-color 0.3s;
  }
  .theme-slot {
    position: absolute;
    top: clamp(16px, 3vh, 28px);
    right: clamp(16px, 3vw, 36px);
    z-index: 10;
  }
  .wrap {
    width: 100%;
    max-width: 64rem;
  }
  .title {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    font-weight: 400;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px 6px;
    font: 700 clamp(22px, 2.5vw, 34px) / 1 var(--font-display);
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .links {
    margin-top: 2.75rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 22px 26px;
  }
  @media (prefers-reduced-motion: reduce) {
    .home {
      transition: none;
    }
  }
</style>
