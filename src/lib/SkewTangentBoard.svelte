<script lang="ts">
  import { onMount } from 'svelte'
  import JXG from 'jsxgraph'
  import { createPalette } from './jsxgraphTheme'
  import { readThemeColors } from './themeColors'
  import { buildSkewTangentBoard } from './skewTangentBoard'

  let container: HTMLDivElement

  onMount(() => {
    const board = buildSkewTangentBoard(container, createPalette(readThemeColors(container)))
    return () => JXG.JSXGraph.freeBoard(board)
  })
</script>

<div bind:this={container} class="jxgbox" role="img" aria-label="A whole tapered quad with the square-cut version shown as a ghost behind it. At each end a cut line through the end midpoint intersects the two shared side edges, giving the four corners. Sliders set the skew at the base and at the tip."></div>

<style>
  .jxgbox {
    box-sizing: border-box;
    width: 720px;
    aspect-ratio: 720 / 560;
    position: relative;
    overflow: hidden;
    background: var(--color-base-200);
    border: 1px solid var(--color-base-300);
    border-radius: 0;
    margin: 0;
    touch-action: none;
  }
  .jxgbox :global(svg text) {
    cursor: default;
    user-select: none;
    font-family: 'IBM Plex Mono', monospace;
  }
  .jxgbox :global(.JXGtext) {
    background: transparent;
    padding: 0;
    margin: 0;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
