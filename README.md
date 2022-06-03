# Tony's Apizza

Point of sale example for a pizza shop. Using [Stripe Terminal](https://stripe.com/docs/terminal), [SvelteKit](https://kit.svelte.dev) and [Prisma](https://prisma.io).

## Features

- Built with [SvelteKit](https://kit.svelte.dev)
- Integration with [Stripe Terminal]()
- ORM uses [Prisma]()
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
