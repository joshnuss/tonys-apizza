<script>
  import { onMount } from 'svelte'
  import { cart, add, cancel } from '$lib/cart'
  import { initTerminal, pay, paymentStatus } from '$lib/terminal'
  import Cart from '$lib/components/Cart.svelte'
  import Numpad from '$lib/components/Numpad.svelte'

  export let openOrder = null

  let input = ''

  onMount(async () => {
    await initTerminal()

    if (openOrder) {
      $cart = openOrder
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
    await pay()
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

<h1>Tony's Apizza</h1>

<div class="panel">
  <Cart {input}/>

  <Numpad
    {input}
    disabled={$paymentStatus != 'ready'}
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
