<!-- routify:meta reset -->
<script lang="ts">
  import { url } from '@roxi/routify'
  import DetailShell from '../lib/DetailShell.svelte'
  import RansomTitle from '../lib/RansomTitle.svelte'
  import P5Button from '../lib/P5Button.svelte'
  import { CYCLE } from '../lib/ransom'
</script>

<DetailShell title="Page not found">
  <main class="lost">
    <div class="lost-body">
      <p class="code">
        <span class="sr-only">Error 404</span>
        <RansomTitle text="404" styles={CYCLE} size="clamp(64px, 12vw, 140px)" />
      </p>
      <p class="msg">This page slipped out of the Metaverse.</p>
      <P5Button href={$url('/')}>Back to home</P5Button>
    </div>
  </main>
</DetailShell>

<style>
  .lost {
    flex: 1;
    display: grid;
    place-items: center;
    min-height: 100svh;
    padding: calc(var(--app-bar-h) + 2rem) 1.5rem 3rem;
    overflow: hidden;
    text-align: center;
    color: var(--p-ink);
    background:
      radial-gradient(ellipse 75% 65% at 8% 85%, var(--p-glow) 0%, transparent 70%),
      var(--p-bg);
  }
  .lost-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .code {
    margin: 0;
  }
  .msg {
    margin: 0;
    font: 700 clamp(20px, 2.4vw, 30px) / 1.2 var(--font-display);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
</style>
