<script lang="ts">
  import type { Snippet } from 'svelte'
  import { url } from '@roxi/routify'
  import ThemeToggle from './ThemeToggle.svelte'

  let { title, children }: { title: string; children: Snippet } = $props()
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header class="app-bar">
  <div class="band-line" aria-hidden="true"></div>
  <div class="band" aria-hidden="true"></div>
  <div class="halftone" aria-hidden="true"></div>
  <div class="row">
    <div class="start">
      <a href={$url('/')} class="p5-icon-btn p5-icon-btn-sm p5-back-btn" aria-label="Back to home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <h1 class="title-tag">{title}</h1>
    </div>
    <div class="end">
      <ThemeToggle size="sm" />
    </div>
  </div>
</header>

{@render children()}

<style>
  .app-bar {
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 30;
    height: var(--app-bar-h);
    background-color: var(--color-base-100);
  }
  .band-line,
  .band,
  .halftone {
    position: absolute;
    top: 0;
    pointer-events: none;
  }
  .band-line {
    inset: 0;
    background-color: var(--p-band-line);
    clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
  }
  .band {
    left: 0;
    right: 0;
    height: calc(100% - 4px);
    background-color: var(--color-primary);
    clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
  }
  .halftone {
    right: 0;
    width: 38%;
    height: calc(100% - 4px);
    background-image: radial-gradient(circle, var(--p-black) 1.6px, transparent 2px);
    background-size: 9px 9px;
    opacity: 0.28;
    clip-path: polygon(0 0, 100% 0, 100% 80%, 0 94%);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 70%);
    mask-image: linear-gradient(90deg, transparent, #000 70%);
  }
  .row {
    position: relative;
    height: calc(100% - 8px);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 14px 0 12px;
  }
  .start {
    display: flex;
    flex: 1 1 0%;
    min-width: 0;
    align-items: center;
    gap: 16px;
  }
  .title-tag {
    min-width: 0;
    margin: 0 0 0 2px;
    padding: 7px 14px 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: var(--p-white);
    color: var(--p-black);
    font: 700 22px / 1.1 var(--font-display);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 4px 4px 0 var(--p-black);
    transform: rotate(-1.5deg);
  }
  .end {
    flex: none;
    margin-left: auto;
  }
  @media (max-width: 480px) {
    .title-tag {
      font-size: 17px;
    }
  }
</style>
