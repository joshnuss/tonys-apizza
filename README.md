# Tony's Apizza

Example POS for a pizza shop. Built using [Stripe Terminal](https://stripe.com/terminal), [SvelteKit](https://kit.svelte.dev) and [Prisma](https://prisma.io).

## Screenshot

![screenshot](/screenshot.jpg)

## Features

- Contactless and dippable payments using [Stripe Terminal](https://stripe.com/terminal).
- Responsive keypad using CSS grid.
- Quick add buttons for purchasing common products.
- Basic tax computation for taxable products.

## Setup

First, install dependencies:

```bash
pnpm install
```

Create a `.env.development` file, and set up you Stripe private key:

```bash
cp .env.example .env.development
```

Create the Postgres database:

```bash
sudo -u postgres createdb tonys_apizza_dev
```

Set up the database schema:

```bash
pnpm db:push
```

Load the fake product data:

```bash
pnpm db:seed
```

## Create a simulated reader

To test card payments in dev mode, physical hardware isn't needed, Stripe provides simulated readers.

To create a simulated reader, first create the location:

```bash
> stripe terminal locations create --display-name=store1 \
    -d "address[line1]=123 Main St." \
    -d "address[city]=New Haven" \
    -d "address[state]=CT" \
    -d "address[country]=US" \
    -d "address[postal_code]=10000"
{
    "id": "tml_abcd1234",
    ...
}
```

Then, create a simulated reader at that location:

```bash
> stripe terminal readers create --location=tml_abcd1234 \
    --registration-code=simulated-wpe
{
    "id": "tmr_abcd1234",
    ...
}
```

Copy the ID's for the location and reader (they start with `tml_` & `tmr_`) and paste them into the `.env.development` under the keys `STRIPE_LOCATION` & `STRIPE_TERMINAL`.

## Development

Run the dev server:

```bash
pnpm dev
```

Forward all Stripe events to the local webhook handler:

```bash
stripe listen --forward-to localhost:3000/stripe/events
```

If you'd like to inspect data, open Prisma Studio and visit http://localhost:5555

```bash
pnpm db:studio
```

## Caveats

In the real world, you might want to add a few more things:

- Authentication of cashiers
- Support multiple readers and stations
- Support for tipping
- Support for cash and cash drawers
- Receipt printing and integration with thermal printer
- Barcode scanner
- Ability to refund

## License

MIT
