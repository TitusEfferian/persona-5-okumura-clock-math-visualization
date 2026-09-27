<script lang="ts">
  import type { Snippet } from 'svelte'
  import { url } from '@roxi/routify'
  import ThemeToggle from './ThemeToggle.svelte'

  let { title, children }: { title: string; children: Snippet } = $props()
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header class="navbar fixed inset-x-0 top-0 z-30 min-h-16 bg-base-100 shadow-sm">
  <div class="flex min-w-0 flex-1 items-center gap-1">
    <a href={$url('/')} class="btn btn-ghost btn-circle" aria-label="Back to home">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </a>
    <h1 class="truncate text-lg font-semibold">{title}</h1>
  </div>
  <div class="flex flex-none items-center">
    <ThemeToggle />
  </div>
</header>

{@render children()}
