<!-- routify:meta reset -->
<script lang="ts">
  import { url } from '@roxi/routify'

  const links = [
    { path: '/shape-idea', label: 'Shape Idea' },
    { path: '/geometry-visualization', label: 'Geometry Visualization' },
    { path: '/addtriangle-visualization', label: 'Add Triangle Visualization' },
    { path: '/skew-tangent-visualization', label: 'Skew Tangent Visualization' },
  ]
</script>

<svelte:head>
  <title>Persona 5 Okumura Kunikazu Timer Geometry Visualization</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content w-full text-center">
    <div class="w-full max-w-5xl">
      <h1 class="text-[clamp(1.25rem,5vw,3rem)] leading-tight font-bold">
        <span class="block whitespace-nowrap">Persona 5 Okumura Kunikazu Timer</span>
        <span class="block whitespace-nowrap">Geometry Visualization</span>
      </h1>
      <nav class="mt-8 flex flex-wrap justify-center gap-4" aria-label="Visualizations">
        {#each links as { path, label } (path)}
          <a href={$url(path)} class="btn">{label}</a>
        {/each}
      </nav>
    </div>
  </div>
</div>
