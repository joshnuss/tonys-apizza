import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    vite: {
      server: {
        hmr: {
          clientPort: process.env.HMR_HOST ? 443 : 24678,
          host: process.env.HMR_HOST ? process.env.HMR_HOST.substring("https://".length) : "localhost"
        }
      }
    }
  }
}

export default config
