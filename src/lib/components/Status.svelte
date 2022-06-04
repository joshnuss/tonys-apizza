<script>
  import { connectionStatus } from '$lib/terminal'

  const labels = {
    loading: 'loading...',
    connecting: 'connecting...',
    not_connected: 'disconnected',
  }

  $: label = labels[$connectionStatus] || $connectionStatus
</script>

<section>
  <span class={$connectionStatus} title={label}>
    {#if $connectionStatus == 'connected' || $connectionStatus == 'connecting' || $connectionStatus == 'loading'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
      </svg>
    {/if}
  </span>

  <span class={$connectionStatus}>
    {label}
  </span>
</section>

<style>
  section {
    background: #cccc;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    gap: 0.5rem;
    place-items: center;
  }

  section span {
    display: inline-flex;
    font-size: 0.8rem;
  }

  section :global(.loading) {
    color: #4448;
  }

  section :global(.connecting) {
    color: darkorange;
  }

  section :global(.connected) {
    color: seagreen;
  }

  section :global(.not_connected) {
    color: tomato;
  }

  svg {
    width: 20px;
  }
</style>
