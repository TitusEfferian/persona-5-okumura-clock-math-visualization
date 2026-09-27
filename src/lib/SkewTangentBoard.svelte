<script lang="ts">
  import { untrack } from 'svelte'
  import JXG from 'jsxgraph'
  import { PALETTE } from './jsxgraphTheme'
  import { buildSkewTangentBoard } from './skewTangentBoard'
  import type { SkewTangentBoardHandle } from './skewTangentBoard'

  let { showCircle = $bindable(true) }: { showCircle?: boolean } = $props()

  let container: HTMLDivElement
  let handle: SkewTangentBoardHandle | undefined

  $effect(() => {
    handle = buildSkewTangentBoard(container, PALETTE, { showCircle: untrack(() => showCircle) })
    return () => {
      JXG.JSXGraph.freeBoard(handle!.board)
      handle = undefined
    }
  })

  $effect(() => {
    handle?.setCircleVisible(showCircle)
  })
</script>

<div class="board-wrap">
  <label class="label cursor-pointer gap-2 self-start">
    <input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={showCircle} />
    <span class="label-text">Show unit circle</span>
  </label>
  <div bind:this={container} class="jxgbox" role="img" aria-label="A whole tapered quad with the square-cut version shown as a ghost behind it. At each end a cut line through the end midpoint intersects the two shared side edges, giving the four corners. Sliders set the skew at the base and at the tip."></div>
</div>

<style>
  .board-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 720px;
  }
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
