<script>
  import { cart } from '$lib/cart'

  export let input

  function formatCurrency(cents) {
    return (cents / 100).toLocaleString('en', {
      style: 'currency',
      currency: 'USD'
    })
  }
</script>

<div class="receipt">
  <table>
    {#each $cart.lineItems as item}
      <tr>
        <td class="quantity">{item.quantity}x</td>
        <td class="name">{item.product.name}</td>
        <td class="subtotal">{formatCurrency(item.subtotal)}</td>
      </tr>
    {/each}

    {#if input}
      <tr>
        <td class="quantity">{input}x</td>
        <td colspan="2" />
      </tr>
    {/if}
  </table>

  <dl class="totals">
    <dd>Tax</dd>
    <dt>
      {formatCurrency($cart.tax)}
    </dt>
    <dd>Total</dd>
    <dt>
      {formatCurrency($cart.total)}
    </dt>
  </dl>
</div>

<style>
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

  table {
    grid-row: 1 / 4;
    margin: 0.5rem;
    width: calc(100% - 1rem);
    height: min-content;
    border-collapse: collapse;
  }

  table tr:nth-child(even) {
    background: #f6f6f6;
  }

  td {
    padding: 0.5rem;
  }

  .quantity {
    width: 1ch;
    text-align: right;
    font-weight: bold;
  }

  .subtotal {
    grid-column: 7 / 9;
    text-align: right;
  }

  .totals {
    grid-row: 5;
    border-top: solid 1px #ccc;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: baseline;
    padding: 0.5rem;
    gap: 0.5rem;
    position: absolute;
    width: 100%;
    height: 100%;
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

  @media screen and (min-width: 480px) {
    .receipt {
      font-size: 1rem;
    }

    table {
      margin: 0.75rem;
      width: calc(100% - 1.5rem);
    }

    .totals {
      padding: 0.75rem;
      gap: 0.5rem;
    }
  }
  @media screen and (min-width: 768px) {
    .receipt {
      font-size: 1.2rem;
    }

    table {
      margin: 1rem;
      width: calc(100% - 2rem);
    }

    .totals {
      padding: 1rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .receipt {
      font-size: 1.3rem;
    }
  }
</style>
