<script>
  import { cart } from '$lib/cart'
  import { paymentStatus } from '$lib/terminal'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let input
  export let disabled = false
  export let paying = false

  function type(chars) {
    dispatch('type', chars)
  }

  function add(sku) {
    dispatch('add', sku)
  }

  function pay() {
    dispatch('pay')
  }

  function cancel() {
    dispatch('cancel')
  }
</script>

<div class="numpad">
  <!-- digits -->
  {#each Array(9) as _, n}
    {@const num = (n + 1).toString()}
    <button on:click|preventDefault={() => type(num)} {disabled}>
      {num}
    </button>
  {/each}

  <!-- bottom row -->
  <button on:click|preventDefault={() => type('.')} {disabled}> . </button>
  <button on:click|preventDefault={() => type('0')} disabled={disabled || input.length == 0}> 0 </button>
  <button on:click|preventDefault={() => type('00')} disabled={disabled || input.length == 0}> 00 </button>
</div>

<div class="quick-add">
  <button on:click|preventDefault={() => add('slice')} {disabled}> Slice </button>
  <button on:click|preventDefault={() => add('pie')} {disabled}> Pie </button>
  <button on:click|preventDefault={() => add('soda')} {disabled}> Soda </button>
  <button on:click|preventDefault={() => add('water')} {disabled}> Water </button>
</div>

<div class="actions">
  <button
    on:click|preventDefault={cancel}
    disabled={disabled || ($cart.lineItems.length == 0 && input == '')}
  >
    Void
  </button>

  <button
    on:click|preventDefault={pay}
    disabled={$cart.lineItems.length == 0 || disabled || paying}
    class="pay"
  >
    {#if $paymentStatus == 'waiting_for_input'}
      Waiting...
    {:else if $paymentStatus == 'processing'}
      Processing...
    {:else}
      Pay
    {/if}
  </button>
</div>

<style>
  .numpad {
    grid-column: 4 / span 3;
    grid-row: 1 / span 4;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    gap: 0;
  }

  .quick-add {
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

  button:hover {
    background: #2223;
  }

  .quick-add button,
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
    .quick-add button,
    .actions button {
      font-size: 1.3rem;
    }
  }
  @media screen and (min-width: 768px) {
    button {
      font-size: 1.4rem;
    }
    .quick-add button,
    .actions button {
      font-size: 1.8rem;
    }
  }

  @media screen and (min-width: 1024px) {
    button {
      font-size: 1.6rem;
    }
    .quick-add button,
    .actions button {
      font-size: 1.6rem;
    }
  }
</style>
