export async function get(url) {
  return await fetchJson(url)
}

export async function post(url, body = {}) {
  return await fetchJson(url, {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)

  return await response.json()
}
