<script>
  import { onMount } from 'svelte'
  import { order, add, cancel } from '$lib/cart'
  import { initTerminal, pay } from '$lib/terminal'
  import Cart from '$lib/components/Cart.svelte'
  import Numpad from '$lib/components/Numpad.svelte'

  export let latestOrder = null

  let paying = false
  let input = ''

  onMount(async () => {
    await initTerminal()

    if (latestOrder) {
      $order = latestOrder
    }
  })

  async function handleAdd(e) {
    const sku = e.detail
    const quantity = input ? parseInt(input) : 1

    await add(sku, quantity)
    input = ''
  }

  async function handleCancel() {
    await cancel()
    input = ''
  }

  async function handlePay() {
    paying = true

    await pay()
    paying = false
    input = ''
  }

  function handleType(e) {
    const chars = e.detail
    input += chars
  }
</script>

<svelte:head>
  <title>Tony's Apizza</title>
</svelte:head>

<header>
  <h1>Tony's Apizza</h1>
</header>

<div class="panel">
  <Cart {input}/>

  <Numpad
    {input}
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
    min-width: max(50vw, 50vh);
  }

</style>
