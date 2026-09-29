<!-- routify:meta reset -->
<script lang="ts">
  import DetailShell from '../lib/DetailShell.svelte'
  import SkewTangentBoard from '../lib/SkewTangentBoard.svelte'

  const BOARD_W = 720
  const BOARD_H = 600
  const MARGIN = 16

  let stageW = $state(0)
  let stageH = $state(0)
  const measured = $derived(stageW > 0 && stageH > 0)
  const scale = $derived(
    measured ? Math.min((stageW - 2 * MARGIN) / BOARD_W, (stageH - 2 * MARGIN) / BOARD_H) : 1,
  )
</script>

<DetailShell title="Skew Tangent Visualization">
<div class="stage" bind:clientWidth={stageW} bind:clientHeight={stageH}>
  <div
    class="fit"
    style:transform="translate(-50%, -50%) scale({scale})"
    style:visibility={measured ? null : 'hidden'}
  >
    <SkewTangentBoard />
  </div>
</div>
</DetailShell>

<style>
  .stage {
    position: fixed;
    top: var(--app-bar-h);
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background: var(--color-base-100);
    color: var(--color-base-content);
    text-align: start;
    line-height: normal;
    letter-spacing: normal;
  }
  .fit {
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>
