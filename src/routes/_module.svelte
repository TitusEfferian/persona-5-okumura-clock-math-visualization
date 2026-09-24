<script lang="ts">
  import { url, isActive } from '@roxi/routify'
</script>

<nav>
  <a href={$url('/')} class:active={$isActive('/')}>Home</a>
  <a href={$url('/hello-world-a')} class:active={$isActive('/hello-world-a')}>Hello World A</a>
  <a href={$url('/hello-world-b')} class:active={$isActive('/hello-world-b')}>Hello World B</a>
  <a href={$url('/hello-world-c')} class:active={$isActive('/hello-world-c')}>Hello World C</a>
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
