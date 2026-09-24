<script lang="ts">
  import JXG from 'jsxgraph'

  let container: HTMLDivElement

  $effect(() => {
    const board = JXG.JSXGraph.initBoard(container, {
      boundingbox: [-5, 5, 5, -5],
      axis: true,
      showCopyright: false,
      keepaspectratio: true,
    })
    const A = board.create('point', [1, 2], { name: 'A' })
    board.create('functiongraph', [(x: number) => Math.sin(x)], { strokeColor: '#c00' })
    board.create('text', [-4.5, 4, () => `A = (${A.X().toFixed(2)}, ${A.Y().toFixed(2)})`])
    return () => {
      JXG.JSXGraph.freeBoard(board)
    }
  })
</script>

<div bind:this={container} class="jxgbox" style="width: 500px; height: 500px; margin: 0 auto;"></div>
