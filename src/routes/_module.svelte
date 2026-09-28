<script lang="ts">
  import { url, isActive } from '@roxi/routify'
</script>

<nav>
  <a href={$url('/')} class:active={$isActive('/')}>Home</a>
  <a href={$url('/shape-idea')} class:active={$isActive('/shape-idea')}>shape-idea</a>
  <a href={$url('/geometry-visualization')} class:active={$isActive('/geometry-visualization')}>geometry-visualization</a>
  <a href={$url('/addtriangle-visualization')} class:active={$isActive('/addtriangle-visualization')}>addtriangle-visualization</a>
  <a href={$url('/skew-tangent-visualization')} class:active={$isActive('/skew-tangent-visualization')}>skew-tangent-visualization</a>
  <a href={$url('/unity-web-build')} class:active={$isActive('/unity-web-build')}>unity-web-build</a>
</nav>

<main>
  <slot />
</main>

<style>
  nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }
  nav a.active {
    font-weight: bold;
    text-decoration: underline;
  }
</style>
