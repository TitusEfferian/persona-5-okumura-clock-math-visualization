<script lang="ts">
  import { url } from '@roxi/routify'
  import JsxGraphBoard from '../lib/JsxGraphBoard.svelte'
</script>

<h1>JSXGraph smoke test</h1>
<JsxGraphBoard />
<a href={$url('/')}>Back to Home</a>
