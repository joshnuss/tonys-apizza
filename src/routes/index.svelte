<script>
  import { onMount } from 'svelte'
  import { order, add, createPaymentIntent, cancel, capture } from '$lib/order'
  import { loadStripeTerminal } from '@stripe/terminal-js'
  import { post } from '$lib/http'

  export let latestOrder = null

  let terminal = null
  let paying = false
  let buffer = ''

  onMount(async () => {
    const StripeTerminal = await loadStripeTerminal()

    terminal = StripeTerminal.create({
      onFetchConnectionToken,
      onUnexpectedReaderDisconnect,
      onConnectionStatusChange({ status }) {
        console.log(`connection status changed ${status}`)
      },
      onPaymentStatusChange({ status }) {
        console.log(`payment status changed ${status}`)
      }
    })

    console.log(terminal.getConnectionStatus())

    const { discoveredReaders } = await terminal.discoverReaders({ simulated: true })
    console.log(discoveredReaders)

    terminal.connectReader(discoveredReaders[0])
    console.log(terminal.getConnectionStatus())

    if (latestOrder) {
      $order = latestOrder
    }
  })

  async function onFetchConnectionToken() {
    const token = await post('/stripe/connection-token')
    console.log(`Got new token: ${token.secret}`)
    return token.secret
  }

  function onUnexpectedReaderDisconnect() {
    console.error('reader disconnected')
  }

  async function handleAdd(sku) {
    const quantity = buffer ? parseInt(buffer) : 1

    await add(sku, quantity)
    buffer = ''

    terminal.setReaderDisplay({
      type: 'cart',
      cart: {
        line_items: $order.lineItems.map((line) => ({
          description: line.product.name,
          quantity: line.quantity,
          amount: line.subtotal
        })),
        tax: $order.tax,
        total: $order.total,
        currency: 'usd'
      }
    })
  }

  async function handleCancel() {
    await cancel()
    buffer = ''
  }

  async function handlePay() {
    paying = true

    const paymentIntent = await createPaymentIntent()
    console.log(paymentIntent)
    let result = await terminal.collectPaymentMethod(paymentIntent.client_secret)

    if (result.error) {
      paying = false
      console.error(result.error)
    }

    //result = await terminal.processPayment(result.paymentIntent)

    console.log(result)

    if (result.error) {
      paying = false
      console.error(result.error)
    }

    await capture()

    paying = false
    buffer = ''
  }

  function type(char) {
    buffer += char
  }
</script>

<svelte:head>
  <title>Tony's Apizza</title>
</svelte:head>

<header>
  <h1>Tony's Apizza</h1>
</header>

<div class="panel">
  <div class="receipt">
    <table class="items">
      {#each $order.lineItems as item}
        <tr class="item">
          <td class="quantity">{item.quantity}x</td>
          <td class="name">{item.product.name}</td>
          <td class="subtotal"
            >{(item.subtotal / 100).toLocaleString('en', {
              style: 'currency',
              currency: 'USD'
            })}</td
          >
        </tr>
      {/each}

      {#if buffer}
        <tr class="item">
          <td class="quantity">{buffer}x</td>
          <td colspan="2" />
        </tr>
      {/if}
    </table>

    <dl class="totals">
      <dd>Tax</dd>
      <dt>
        {($order.tax / 100).toLocaleString('en', { style: 'currency', currency: 'USD' })}
      </dt>
      <dd>Total</dd>
      <dt>
        {($order.total / 100).toLocaleString('en', { style: 'currency', currency: 'USD' })}
      </dt>
    </dl>
  </div>
  <div class="numpad">
    {#each Array(9) as _, n}
      {@const num = (n + 1).toString()}
      <button on:click|preventDefault={() => type(num)}>
        {num}
      </button>
    {/each}

    <button on:click|preventDefault={() => type('.')}> . </button>

    <button on:click|preventDefault={() => type('0')} disabled={buffer.length == 0}> 0 </button>

    <button on:click|preventDefault={() => type('00')} disabled={buffer.length == 0}> 00 </button>
  </div>

  <div class="shortcuts">
    <button on:click|preventDefault={() => handleAdd('slice')}> Slice </button>
    <button on:click|preventDefault={() => handleAdd('pie')}> Pie </button>
    <button on:click|preventDefault={() => handleAdd('soda')}> Soda </button>
    <button on:click|preventDefault={() => handleAdd('water')}> Water </button>
  </div>

  <div class="actions">
    <button
      on:click|preventDefault={handleCancel}
      disabled={$order.lineItems.length == 0 && buffer == ''}
    >
      Void
    </button>

    <button
      on:click|preventDefault={handlePay}
      disabled={$order.lineItems.length == 0 || paying}
      class="pay"
    >
      {paying ? 'Waiting...' : 'Pay'}
    </button>
  </div>
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

  .receipt {
    position: relative;
    background: white;
    grid-column: span 3;
    grid-row: span 5;
    border: solid 1px #ccc;
    border-radius: 0;
    padding: 0;
    display: grid;
    grid-template-rows: repeat(5, 1fr);
  }

  .items {
    grid-row: 1 / span 4;
    margin: 1rem;
    width: calc(100% - 2rem);
    height: min-content;
    border-collapse: collapse;
  }

  .items tr:nth-child(even) {
    background: #f6f6f6;
  }

  .item td {
    padding: 0.5rem;
  }

  .item .quantity {
    width: 1ch;
    text-align: right;
    font-weight: bold;
  }

  .item .subtotal {
    grid-column: 7 / 9;
    text-align: right;
  }

  .totals {
    border-top: solid 1px #ccc;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
    gap: 0.5rem;
    position: absolute;
    width: 100%;
    bottom: 0;
    margin: 0;
  }
  .totals dd,
  .totals dt {
    padding: 0;
    margin: 0;
  }
  .totals dd {
    font-weight: bold;
  }
  .totals dt {
    text-align: right;
  }

  .numpad {
    grid-column: 4 / span 3;
    grid-row: 1 / span 4;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    gap: 0;
  }

  .shortcuts {
    grid-column: 7;
    grid-row: 1 / span 4;

    display: grid;
    grid-template-columns: 1;
    grid-template-rows: repeat(4, 1fr);

    gap: 0.7rem;
    gap: 0;
  }

  .actions {
    grid-column: 4 / span 4;
    grid-row: 5;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(1, 1fr);

    gap: 1rem;
    gap: 0;
  }

  button {
    color: #555;
    margin: 0;
    aspect-ratio: 1 / 1;
    font-size: 1rem;
    border-radius: 5px;
    border-radius: 0;
  }

  .shortcuts button,
  .actions button {
    background: #ccc;
    border-color: #bbb;
  }

  .actions button {
    aspect-ratio: 1;
  }

  button.pay {
    grid-row: 1;
    grid-column: 2 / 5;
    aspect-ratio: 3 / 1;
    background: orange;
    color: white;
  }

  button[disabled] {
    color: #aaa;
  }
  button.pay[disabled] {
    background: #ccc;
  }

  @media screen and (min-width: 480px) {
    button {
      font-size: 1.2rem;
    }
    .shortcuts button,
    .actions button {
      font-size: 1.3rem;
    }
    .receipt {
      font-size: 1rem;
    }
  }
  @media screen and (min-width: 768px) {
    .panel {
      aspect-ratio: 7 / 5;
      max-width: max(95vw, 95vh);
    }
    button {
      font-size: 1.4rem;
    }
    .shortcuts button,
    .actions button {
      font-size: 1.8rem;
    }
    .receipt {
      font-size: 1.2rem;
    }
  }

  @media screen and (min-width: 1024px) {
    button {
      font-size: 1.6rem;
    }
    .shortcuts button,
    .actions button {
      font-size: 1.6rem;
    }
    .receipt {
      font-size: 1.3rem;
    }
  }
</style>
