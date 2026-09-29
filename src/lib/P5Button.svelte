<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  interface Props extends HTMLAnchorAttributes {
    href: string
    /** tilt in degrees (the slant itself comes from .p5-btn in app.css) */
    r?: number
  }

  let { href, r = -2, class: klass, children, ...rest }: Props = $props()
</script>

<a {...rest} {href} class={['p5-btn', klass]} style:--r="{r}deg"><span>{@render children?.()}</span></a>
