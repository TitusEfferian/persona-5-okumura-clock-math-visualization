<script lang="ts">
  import { onMount } from 'svelte'
  import JXG from 'jsxgraph'
  import { PALETTE } from './jsxgraphTheme'
  import { buildAddTriangleBoard } from './addTriangleBoard'

  let container: HTMLDivElement

  onMount(() => {
    const board = buildAddTriangleBoard(container, PALETTE)
    return () => JXG.JSXGraph.freeBoard(board)
  })
</script>

<div bind:this={container} class="jxgbox" role="img" aria-label="The quad split into two triangles: vertices 0,1,2 in yellow and 2,3,0 in gold, sharing the diagonal from 0 to 2. Corners can be dragged."></div>

<style>
  .jxgbox {
    box-sizing: border-box;
    width: 600px;
    aspect-ratio: 1 / 1;
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
