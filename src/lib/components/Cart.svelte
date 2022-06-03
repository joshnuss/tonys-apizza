<script>
  import { order } from '$lib/cart'

  export let buffer
</script>

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

  @media screen and (min-width: 480px) {
    .receipt {
      font-size: 1rem;
    }
  }
  @media screen and (min-width: 768px) {
    .receipt {
      font-size: 1.2rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .receipt {
      font-size: 1.3rem;
    }
  }
</style>
