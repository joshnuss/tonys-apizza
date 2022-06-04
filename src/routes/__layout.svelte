<script>
  import '../app.css'
  import Status from '$lib/components/Status.svelte'
</script>

<main>
  <slot />
</main>

<footer>
  <Status/>
</footer>

<style>
  footer {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
  }
  main {
    height: 100vh;
  }
</style>
