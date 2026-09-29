<script lang="ts">
  import type { ClassValue } from 'svelte/elements'
  import { FONT_FAMILY } from './ransom'
  import type { TileStyle } from './ransom'

  interface Props {
    /** Letters to render; whitespace is dropped. */
    text: string
    /** Tile styles, applied cyclically. */
    styles: TileStyle[]
    /** Index into `styles` used for the first letter. */
    startIndex?: number
    /** Base letter size (--rs); each tile scales it by its multiplier. */
    size?: string
    /** Default tile padding (a tile style's own `pad` wins). */
    pad?: string
    class?: ClassValue
  }

  let {
    text,
    styles,
    startIndex = 0,
    size = 'clamp(28px, 4vw, 54px)',
    pad = '.05em .14em .03em',
    class: klass,
  }: Props = $props()

  const tiles = $derived(
    [...text.replace(/\s+/g, '')].map((ch, i) => ({ ch, s: styles[(startIndex + i) % styles.length] })),
  )
</script>

<!-- Decorative: the accessible name lives on the surrounding heading. -->
<span class={['ransom', klass]} style:--rs={size} style:--tile-pad={pad} aria-hidden="true">
  {#each tiles as { ch, s }, i (i)}
    <span
      class="tile"
      style:background-color={s.bg}
      style:color={s.fg}
      style:border={s.border ?? null}
      style:padding={s.pad ?? null}
      style:margin-left={s.ml ?? null}
      style:box-shadow={s.shadow ?? null}
      style:font-family={FONT_FAMILY[s.font]}
      style:font-weight={s.font === 'serif' || s.font === 'serif-italic' ? 900 : 700}
      style:font-style={s.font === 'serif-italic' ? 'italic' : null}
      style:font-size="calc(var(--rs) * {s.mult})"
      style:transform="rotate({s.rot}deg) translateY({s.ty ?? 0}em)">{ch}</span
    >
  {/each}
</span>

<style>
  .ransom {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    text-transform: uppercase;
  }
  .tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--tile-pad);
    line-height: 1;
  }
</style>
