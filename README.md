# Tony's Apizza

Example POS for a pizza shop. Built using [Stripe Terminal](https://stripe.com/docs/terminal), [SvelteKit](https://kit.svelte.dev) and [Prisma](https://prisma.io).

## Screenshot

![screenshot](/screenshot.jpg)

## Features

- Built with [SvelteKit](https://kit.svelte.dev)
- Payments with [Stripe Terminal](https://stripe.com/docs/terminal)
- ORM uses [Prisma](https://prisma.io)
- Responsive touch keypad using CSS grid

## Caveats

In the real world it would likely need a few more things:

- Authentication of cashiers
- Support multiple readers and stations
- Support for tipping
- Support for cash and cash drawers
- Receipt printing and integration with thermal printer
- Barcode scanner
- Refunds

## Setup

```bash
pnpm install
```

```bash
cp .env.example .env.development
```

```bash
pnpm db:create db:seed
```

```bash
node scripts/create-test-reader.js
```

## Usage

```bash
pnpm dev
```

## License

MIT
