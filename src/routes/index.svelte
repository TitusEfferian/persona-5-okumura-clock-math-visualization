<!-- routify:meta reset -->
<script lang="ts">
  import { url } from '@roxi/routify'
  import ThemeToggle from '../lib/ThemeToggle.svelte'

  const links = [
    { path: '/shape-idea', label: 'Shape Idea' },
    { path: '/geometry-visualization', label: 'Geometry Visualization' },
    { path: '/addtriangle-visualization', label: 'Add Triangle Visualization' },
    { path: '/skew-tangent-visualization', label: 'Skew Tangent Visualization' },
    { path: '/unity-web-build', label: 'Demo Unity Web Build' },
  ]
</script>

<svelte:head>
  <title>Persona 5 Okumura Kunikazu Timer Geometry Visualization</title>
</svelte:head>

<div class="hero relative min-h-screen bg-base-200">
  <div class="absolute top-4 right-4 z-10">
    <ThemeToggle />
  </div>
  <div class="hero-content w-full text-center">
    <div class="w-full max-w-5xl">
      <h1 class="text-[clamp(1.25rem,5vw,3rem)] leading-tight font-bold">
        <span class="block whitespace-nowrap">Persona 5 Okumura Kunikazu Timer</span>
        <span class="block whitespace-nowrap">Geometry Visualization</span>
      </h1>
      <nav class="mt-8 flex flex-wrap justify-center gap-4" aria-label="Visualizations">
        {#each links as { path, label } (path)}
          <a href={$url(path)} class="btn btn-primary">{label}</a>
        {/each}
      </nav>
    </div>
  </div>
</div>
