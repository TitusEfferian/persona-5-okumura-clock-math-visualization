<script lang="ts">
  import { onMount } from 'svelte'
  import JXG from 'jsxgraph'
  import { PALETTE } from './jsxgraphTheme'
  import { DEFAULT_SHOW, PRESETS, buildGeometryVisualizationBoard, snapPreset } from './geometryVisualizationBoard'
  import type { LiveState, QuadParams, ShowFlags } from './geometryVisualizationBoard'

  let { params, show }: { params: QuadParams; show: ShowFlags } = $props()

  let container: HTMLDivElement
  let board: JXG.Board | undefined
  const live: LiveState = { params: snapPreset(PRESETS.clockhand), show: { ...DEFAULT_SHOW } }

  onMount(() => {
    live.params = $state.snapshot(params)
    live.show = $state.snapshot(show)
    board = buildGeometryVisualizationBoard(container, live, PALETTE)
    return () => {
      if (board) JXG.JSXGraph.freeBoard(board)
      board = undefined
    }
  })

  $effect(() => {
    live.params = $state.snapshot(params)
    live.show = $state.snapshot(show)
    board?.update()
  })
</script>

<div
  bind:this={container}
  class="jxgbox"
  role="img"
  aria-label="Interactive JSXGraph drawing of the tapered quad produced by the current slider values"
></div>

<style>
  .jxgbox {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    aspect-ratio: 340 / 580;
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
