<script lang="ts">
  import { url } from '@roxi/routify'
</script>

<h1>Home</h1>
<ul>
  <li><a href={$url('/shape-idea')}>shape-idea</a></li>
  <li><a href={$url('/geometry-visualization')}>geometry-visualization</a></li>
  <li><a href={$url('/addtriangle-visualization')}>addtriangle-visualization</a></li>
  <li><a href={$url('/skew-tangent-visualization')}>skew-tangent-visualization</a></li>
</ul>
