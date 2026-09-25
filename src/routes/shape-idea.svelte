<!-- routify:meta reset -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { url } from '@roxi/routify'
  import ShapeIdeaBoard from '../lib/ShapeIdeaBoard.svelte'

  // The board keeps its native size (848 px wide, aspect ratio 720 / 520) and is scaled
  // as a whole, so text, markers, strokes and ticks all scale together.
  const BOARD_W = 848
  const BOARD_H = (BOARD_W * 520) / 720
  const MARGIN = 16

  let stageW = $state(0)
  let stageH = $state(0)
  // The stage reads 0 × 0 until it is first measured; keep the board hidden until then.
  const measured = $derived(stageW > 0 && stageH > 0)
  const scale = $derived(
    measured ? Math.min((stageW - 2 * MARGIN) / BOARD_W, (stageH - 2 * MARGIN) / BOARD_H) : 1,
  )

  onMount(() => {
    // <svelte:head><title> is not restored on unmount, so set and restore it here.
    const previousTitle = document.title
    document.title = 'shape-idea'
    return () => {
      document.title = previousTitle
    }
  })
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap" />
</svelte:head>

<div class="stage" bind:clientWidth={stageW} bind:clientHeight={stageH}>
  <h1 class="sr-only">shape-idea</h1>
  <a class="home" href={$url('/')}>← Home</a>
  <div
    class="fit"
    style:transform="translate(-50%, -50%) scale({scale})"
    style:visibility={measured ? null : 'hidden'}
  >
    <ShapeIdeaBoard />
  </div>
</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #f6f4ef;
    color: #151312;
    color-scheme: light;
    /* Undo the typography app.css sets on :root and #app. */
    text-align: start;
    line-height: normal;
    letter-spacing: normal;
  }
  .fit {
    position: absolute;
    left: 50%;
    top: 50%;
  }
  .home {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #5a554f;
    text-decoration: none;
  }
  .home:hover {
    color: #151312;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
