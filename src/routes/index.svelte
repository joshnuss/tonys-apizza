<script>
  import { onMount } from 'svelte'
  import { order, add, cancel } from '$lib/cart'
  import { initTerminal, pay } from '$lib/terminal'
  import Cart from '$lib/components/Cart.svelte'
  import Numpad from '$lib/components/Numpad.svelte'

  export let latestOrder = null

  let paying = false
  let buffer = ''

  onMount(async () => {
    await initTerminal()

    if (latestOrder) {
      $order = latestOrder
    }
  })

  async function handleAdd(e) {
    const sku = e.detail
    const quantity = buffer ? parseInt(buffer) : 1

    await add(sku, quantity)
    buffer = ''
  }

  async function handleCancel() {
    await cancel()
    buffer = ''
  }

  async function handlePay() {
    paying = true

    await pay()
    paying = false
    buffer = ''
  }

  function handleType(e) {
    const chars = e.detail
    buffer += chars
  }
</script>

<svelte:head>
  <title>Tony's Apizza</title>
</svelte:head>

<header>
  <h1>Tony's Apizza</h1>
</header>

<div class="panel">
  <Cart {buffer}/>

  <Numpad
    {buffer}
    {paying}
    disabled={paying}
    on:type={handleType}
    on:add={handleAdd}
    on:pay={handlePay}
    on:cancel={handleCancel}
    />
</div>

<style>
  .panel {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 1rem;
    gap: 0;
    border-radius: 15px;
    min-width: 500px;
  }

</style>
