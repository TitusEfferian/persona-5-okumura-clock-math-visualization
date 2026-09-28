<!-- routify:meta reset -->
<script lang="ts">
  import DetailShell from '../lib/DetailShell.svelte'
  import UnityWebBuildPlayer from '../lib/UnityWebBuildPlayer.svelte'

  const MARGIN = 16

  let stageW = $state(0)
  let stageH = $state(0)
  let measured = $state(false)
  const w = $derived(Math.max(0, Math.min(stageW - 2 * MARGIN, ((stageH - 2 * MARGIN) * 16) / 9)))
  const h = $derived((w * 9) / 16)

  $effect(() => {
    if (stageW > 0 && stageH > 0) measured = true
  })
</script>

<DetailShell title="Demo Unity Web Build">
<div class="stage" bind:clientWidth={stageW} bind:clientHeight={stageH}>
  {#if measured}
    <div class="fit">
      <UnityWebBuildPlayer width={w} height={h} />
    </div>
  {/if}
</div>
</DetailShell>

<style>
  .stage {
    position: fixed;
    top: 4rem;
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
    transform: translate(-50%, -50%);
  }
</style>
