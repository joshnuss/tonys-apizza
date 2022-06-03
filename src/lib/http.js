export async function post(url, body = {}) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  })

  return await response.json()
}
