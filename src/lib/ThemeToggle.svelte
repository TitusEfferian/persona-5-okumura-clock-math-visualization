<script lang="ts">
  import { theme, THEME_STORAGE_KEY } from './theme.svelte'

  $effect(() => {
    document.documentElement.dataset.theme = theme.current
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.current)
    } catch {
      // ignore storage failures
    }
  })
</script>

<label class="flex cursor-pointer items-center gap-2 text-sm">
  <span class="sr-only sm:not-sr-only">Light</span>
  <input
    type="checkbox"
    class="toggle theme-controller"
    value="light"
    aria-label="Switch to light theme"
    bind:checked={() => theme.current === 'light', (v) => (theme.current = v ? 'light' : 'persona5royal')}
  />
</label>
