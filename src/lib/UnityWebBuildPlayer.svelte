<script lang="ts">
  import { onMount } from 'svelte'

  let { width, height }: { width: number; height: number } = $props()

  const LOADER_URL = '/okumura/Build/Web.loader.js'
  const CONFIG: UnityConfig = {
    arguments: [],
    dataUrl: '/okumura/Build/Web.data.unityweb',
    frameworkUrl: '/okumura/Build/Web.framework.js.unityweb',
    codeUrl: '/okumura/Build/Web.wasm.unityweb',
    streamingAssetsUrl: '/okumura/StreamingAssets',
    companyName: 'DefaultCompany',
    productName: 'persona_5_okumura_clock',
    productVersion: '0.1.0',
  }

  let canvas: HTMLCanvasElement
  let instance: UnityInstance | null = null
  let progress = $state(0)
  let ready = $state(false)
  let error = $state<string | null>(null)
  let banner = $state<string | null>(null)

  onMount(() => {
    let cancelled = false
    let script: HTMLScriptElement | null = null
    let bannerTimer: ReturnType<typeof setTimeout> | undefined

    const showBanner = (msg: string, type?: string) => {
      if (cancelled) return
      if (type === 'error') {
        error = msg
        return
      }
      banner = msg
      clearTimeout(bannerTimer)
      bannerTimer = setTimeout(() => (banner = null), 5000)
    }

    const start = async () => {
      try {
        const unity = await createUnityInstance(canvas, { ...CONFIG, showBanner }, (p) => {
          if (!cancelled) progress = p
        })
        if (cancelled) {
          void unity.Quit()
          return
        }
        instance = unity
        progress = 1
        ready = true
      } catch (e) {
        if (!cancelled) error = e instanceof Error ? e.message : String(e)
      }
    }

    if (typeof createUnityInstance === 'function') {
      void start()
    } else {
      script = document.createElement('script')
      script.src = LOADER_URL
      script.onload = () => void start()
      script.onerror = () => {
        if (!cancelled) error = `Failed to load ${LOADER_URL}`
      }
      document.body.appendChild(script)
    }

    return () => {
      cancelled = true
      clearTimeout(bannerTimer)
      script?.remove()
      if (instance) {
        void instance.Quit()
        instance = null
      }
    }
  })

  const percent = $derived(Math.round(progress * 100))
</script>

<div class="player" style:width="{width}px" style:height="{height}px">
  <canvas bind:this={canvas} id="unity-canvas" width={1920} height={1080} tabindex="-1"></canvas>

  {#if !ready}
    <div class="overlay">
      {#if error}
        <p class="error" role="alert">{error}</p>
      {:else}
        <progress class="bar" value={progress} max="1" aria-label="Loading Unity build"></progress>
        <p class="status">Loading Unity build… {percent}%</p>
      {/if}
    </div>
  {/if}

  <div class="banner-region" role="status">
    {#if banner}
      <p class="banner">{banner}</p>
    {/if}
  </div>

  {#if ready}
    <button type="button" class="fullscreen p5-btn p5-btn-sm" onclick={() => instance?.SetFullscreen(1)}>
      <span>Fullscreen</span>
    </button>
  {/if}
</div>

<style>
  .player {
    position: relative;
    overflow: hidden;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: var(--color-base-200);
    color: var(--color-base-content);
  }
  .error {
    color: var(--color-error);
    font-weight: 600;
  }
  .status {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .bar {
    appearance: none;
    display: block;
    inline-size: 14rem;
    block-size: 0.75rem;
    border: 2px solid var(--p-edge);
    border-radius: 0;
    background-color: var(--color-base-300);
    color: var(--color-primary);
    overflow: hidden;
    transform: skewX(-14deg);
  }
  .bar::-webkit-progress-bar {
    background-color: var(--color-base-300);
  }
  .bar::-webkit-progress-value {
    background-color: var(--color-primary);
  }
  .bar::-moz-progress-bar {
    background-color: var(--color-primary);
  }
  .banner-region {
    position: absolute;
    top: 0.75rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }
  .banner {
    max-width: calc(100% - 1.5rem);
    padding: 0.5rem 0.875rem;
    background-color: var(--color-warning);
    color: var(--color-warning-content);
    border: 2px solid var(--p-black);
    box-shadow: 4px 4px 0 var(--p-black);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    transform: rotate(-1deg);
    pointer-events: auto;
  }
  .fullscreen {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
</style>
