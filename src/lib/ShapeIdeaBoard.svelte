<script lang="ts">
  import { onMount } from 'svelte'
  import JXG from 'jsxgraph'
  import { createPalette } from './jsxgraphTheme'
  import { readThemeColors } from './themeColors'
  import { buildShapeIdeaBoard } from './shapeIdeaBoard'

  let container: HTMLDivElement

  onMount(() => {
    const board = buildShapeIdeaBoard(container, createPalette(readThemeColors(container)))
    return () => JXG.JSXGraph.freeBoard(board)
  })
</script>

<div bind:this={container} class="jxgbox"></div>

<style>
  .jxgbox {
    box-sizing: border-box;
    width: 848px;
    aspect-ratio: 720 / 520;
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
