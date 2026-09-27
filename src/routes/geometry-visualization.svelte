<!-- routify:meta reset -->
<script lang="ts">
  import DetailShell from '../lib/DetailShell.svelte'
  import GeometryVisualizationBoard from '../lib/GeometryVisualizationBoard.svelte'
  import {
    DEFAULT_PRESET,
    DEFAULT_SHOW,
    PRESETS,
    PRESET_LABELS,
    PRESET_NAMES,
    SLIDERS,
    computeReadout,
    snapPreset,
  } from '../lib/geometryVisualizationBoard'
  import type { PresetName } from '../lib/geometryVisualizationBoard'

  const PANEL_W = 848
  const MARGIN = 16

  let stageW = $state(0)
  let stageH = $state(0)
  let panelH = $state(0)
  const measured = $derived(stageW > 0 && stageH > 0 && panelH > 0)
  const scale = $derived(
    measured ? Math.min((stageW - 2 * MARGIN) / PANEL_W, (stageH - 2 * MARGIN) / panelH) : 1,
  )

  const params = $state(snapPreset(PRESETS[DEFAULT_PRESET]))
  const show = $state({ ...DEFAULT_SHOW })
  let activePreset = $state<PresetName | null>(DEFAULT_PRESET)
  const readout = $derived(computeReadout(params).text)

  function applyPreset(name: PresetName) {
    Object.assign(params, snapPreset(PRESETS[name]))
    activePreset = name
  }

  function clearActivePreset() {
    activePreset = null
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&display=swap"
  />
</svelte:head>

<DetailShell title="Geometry Visualization">
<div class="stage" bind:clientWidth={stageW} bind:clientHeight={stageH}>
  <div
    class="fit"
    style:transform="translate(-50%, -50%) scale({scale})"
    style:visibility={measured ? null : 'hidden'}
  >
    <div class="play" bind:offsetHeight={panelH}>
      <div class="presets">
        {#each PRESET_NAMES as name (name)}
          <button
            type="button"
            class:on={activePreset === name}
            aria-pressed={activePreset === name}
            onclick={() => applyPreset(name)}
          >
            {PRESET_LABELS[name]}
          </button>
        {/each}
      </div>
      <div class="row">
        <div>
          <div class="ctl">
            {#each SLIDERS as slider (slider.key)}
              <label for={slider.key}>{slider.label}</label>
              <input
                type="range"
                id={slider.key}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                bind:value={params[slider.key]}
                oninput={clearActivePreset}
              />
              <output for={slider.key}>{params[slider.key]}</output>
            {/each}
          </div>
          <div class="toggles">
            <label><input type="checkbox" bind:checked={show.triangles} /> two triangles</label>
            <label><input type="checkbox" bind:checked={show.lines} /> construction lines</label>
            <label><input type="checkbox" bind:checked={show.rect} /> synced rect</label>
            <label><input type="checkbox" bind:checked={show.circle} /> unit circle</label>
          </div>
          <div class="readout">{readout}</div>
        </div>
        <div>
          <GeometryVisualizationBoard {params} {show} />
          <div class="legend">
            <span class="base-cut">base cut</span>
            <span class="tip-cut">tip cut</span>
            <span class="side-edges">side edges</span>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  }
  .play,
  .play :global(*),
  .play :global(*::before) {
    box-sizing: border-box;
  }
  .play {
    width: 848px;
    font: 16px/1.55 'IBM Plex Sans', system-ui, sans-serif;
    color: var(--color-base-content);
    background: var(--color-base-200);
    border: 2px solid var(--color-base-300);
    padding: 16px;
    margin: 0;
  }
  .play input,
  .play button,
  .play output {
    font: inherit;
  }
  .play .row {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) minmax(260px, 1.3fr);
    gap: 20px;
  }
  .ctl {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 6px 10px;
    align-items: center;
    font-size: 14px;
  }
  .ctl label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    white-space: nowrap;
  }
  .ctl input[type='range'] {
    width: 100%;
    accent-color: var(--color-primary);
  }
  .ctl output {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    min-width: 5ch;
    text-align: right;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 14px;
  }
  .presets button {
    font: 600 13px 'IBM Plex Sans', sans-serif;
    background: var(--color-base-200);
    color: var(--color-base-content);
    border: 2px solid var(--color-base-300);
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 2px;
  }
  .presets button:hover,
  .presets button:focus-visible {
    background: var(--color-primary);
    color: var(--color-primary-content);
    border-color: var(--color-primary);
    outline: none;
  }
  .presets button.on {
    background: var(--color-primary);
    color: var(--color-primary-content);
    border-color: var(--color-primary);
  }
  .readout {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    line-height: 1.6;
    background: var(--color-base-200);
    padding: 10px 12px;
    margin-top: 12px;
    overflow-x: auto;
    white-space: pre;
  }
  .toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 10px;
    font-size: 13.5px;
  }
  .toggles label {
    display: flex;
    gap: 6px;
    align-items: center;
    cursor: pointer;
  }
  .legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 13px;
    margin-top: 6px;
  }
  .legend span::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 3px;
    margin-right: 6px;
    vertical-align: middle;
    background: currentColor;
  }
  .legend .base-cut {
    color: var(--p5-base-cut);
  }
  .legend .tip-cut {
    color: var(--p5-tip-cut);
  }
  .legend .side-edges {
    color: var(--color-base-content);
    opacity: 0.6;
  }
</style>
