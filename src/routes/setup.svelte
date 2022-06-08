<script>
  import { get } from '$lib/http'

  export let locations

  let locationId = 'new'
  let readerId = 'new'
  let readers = []

  async function loadReaders() {
    if (locationId == 'new' || locationId == '') {
      readers = []
      return
    }

    readers = await get(`/stripe/locations/${locationId}/readers`)
  }
</script>

{JSON.stringify(locations)}

<h1>Setup</h1>

{locationId}

<form>
  <label for="location">Location</label>

  <select id="location" bind:value={locationId} required on:change={loadReaders}>
    {#if locations.length > 0}
      <option value=''>--choose--</option>
    {/if}

    {#each locations as location}
      <option value={location.id}>{location.display_name}</option>
    {/each}
    <option value="new">New location</option>
  </select>

  <label for="reader">Reader</label>

  <select id="reader" bind:value={readerId} required>
    {#if readers.length > 0}
      <option value="">--choose--</option>
    {/if}
    <option value="new">New reader</option>
  </select>

  <button>Set up</button>
</form>