<script lang="ts">
  import { url } from '@roxi/routify'
</script>

<h1>Home</h1>
<ul>
  <li><a href={$url('/hello-world-a')}>Hello World A</a></li>
  <li><a href={$url('/hello-world-b')}>Hello World B</a></li>
  <li><a href={$url('/hello-world-c')}>Hello World C</a></li>
</ul>
