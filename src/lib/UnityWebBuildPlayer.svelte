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
        <p class="text-error font-semibold">{error}</p>
      {:else}
        <progress class="progress progress-primary w-56" value={progress} max="1"></progress>
        <p class="text-sm">Loading Unity build… {percent}%</p>
      {/if}
    </div>
  {/if}

  {#if banner}
    <div class="banner alert alert-warning">{banner}</div>
  {/if}

  {#if ready}
    <button class="fullscreen btn btn-sm btn-primary" onclick={() => instance?.SetFullscreen(1)}>Fullscreen</button>
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
  .banner {
    position: absolute;
    left: 50%;
    top: 0.75rem;
    transform: translateX(-50%);
    width: max-content;
    max-width: calc(100% - 1.5rem);
  }
  .fullscreen {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
  }
</style>
