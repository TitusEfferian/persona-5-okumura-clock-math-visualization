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
  <label class="switch">
    <input type="checkbox" role="switch" bind:checked={showCircle} />
    <span>Show unit circle</span>
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
  .switch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    align-self: flex-start;
    font-size: 1rem;
    line-height: 1.25rem;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    cursor: pointer;
  }
  .switch input {
    --knob: var(--p-edge);
    appearance: none;
    flex: none;
    inline-size: 2.5rem;
    block-size: 1.25rem;
    margin: 0;
    border: 2px solid var(--p-edge);
    border-radius: 0;
    background: linear-gradient(var(--knob), var(--knob)) no-repeat 2px 50% / 0.875rem calc(100% - 4px)
      var(--color-base-300);
    cursor: pointer;
    transform: skewX(-12deg);
    transition:
      background-color 0.16s var(--ease-p5),
      background-position 0.16s var(--ease-p5),
      border-color 0.16s var(--ease-p5);
  }
  .switch input:checked {
    --knob: var(--p-white);
    border-color: var(--p-btn-rim);
    background-color: var(--color-primary);
    background-position: calc(100% - 2px) 50%;
  }
  .switch input:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .switch input {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .switch input {
      appearance: auto;
      inline-size: auto;
      block-size: auto;
      border: 0;
      background: none;
      transform: none;
    }
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
