<script lang="ts">
  import { onMount } from 'svelte'
  import JXG from 'jsxgraph'
  import { buildShapeIdeaBoard } from './shapeIdeaBoard'

  let container: HTMLDivElement

  onMount(() => {
    const board = buildShapeIdeaBoard(container)
    return () => JXG.JSXGraph.freeBoard(board)
  })
</script>

<!-- Fixed at the original figure's native size; the page scales it to fit. -->
<div bind:this={container} class="jxgbox"></div>

<style>
  /* Scoped rules beat jsxgraph.css's .jxgbox / .JXGtext on specificity. */
  .jxgbox {
    box-sizing: border-box;
    width: 848px;
    aspect-ratio: 720 / 520;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #d9d4cb;
    border-radius: 0;
    margin: 0;
    touch-action: none;
  }
  /* JSXGraph creates these nodes at runtime, outside Svelte's scoping. */
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
