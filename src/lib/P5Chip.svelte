<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    tone: 'yellow' | 'paper' | 'ink'
    /** rotation in degrees */
    r?: number
    /** vertical nudge in px */
    y?: number
    children: Snippet
  }

  let { tone, r = 0, y = 0, children }: Props = $props()
</script>

<span
  class={{ chip: true, 'p5-timer-outline': tone === 'yellow', yellow: tone === 'yellow', paper: tone === 'paper', ink: tone === 'ink' }}
  style:--r="{r}deg"
  style:--y="{y}px">{@render children()}</span
>

<style>
  .chip {
    display: inline-block;
    padding: 0.2em 0.4em 0.16em;
    transform: rotate(var(--r)) translateY(var(--y));
  }
  .yellow {
    background-color: var(--color-accent);
    color: var(--p-black);
    box-shadow: 4px 4px 0 var(--p-edge);
  }
  .paper {
    background-color: var(--p-white);
    color: var(--p-black);
    border: 2px solid var(--p-paper-edge);
  }
  .ink {
    background-color: var(--p-black);
    color: var(--color-accent);
    border: 2px solid var(--color-accent);
  }
</style>
