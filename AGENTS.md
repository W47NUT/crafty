# Crafty Development Guide

Crafty is an arts-and-crafts ecommerce website.

## Project Architecture

- Astro is the primary framework.
- Svelte is available for interactive UI.
- Do not use Svelte automatically for static content that Astro can handle.
- Tailwind CSS is available for styling.
- pnpm is the package manager.
- The development environment is provided through Nix and direnv.

Prefer meaningful component-based development. Page files should compose
section and shared components, with major reusable or conceptual sections in
`src/components`. Do not create components for trivial markup solely to reduce
line count. Keep static content in Astro and use Svelte only when real
client-side interactivity warrants it. Favor simple, readable code that the
repository owner can inspect and edit.

## Code Style

Keep the code understandable to a human developer who is still learning and
maintaining the project directly.

Prefer:

- simple components
- explicit markup
- descriptive names
- straightforward control flow
- small, focused files
- comments when they explain a non-obvious decision

Avoid:

- premature abstraction
- unnecessary utility layers
- overly generic component systems
- clever code that saves lines but reduces readability
- introducing a dependency for something simple enough to implement directly

A component should have a clear reason to exist.

## Astro and Svelte

Use Astro for:

- pages
- layouts
- static content
- primarily presentational components

Use Svelte when browser-side interactivity genuinely requires it.

Do not turn the site into a client-side Svelte application without a specific
reason.

## Business Information

Read `docs/BUSINESS.md` before making business or content assumptions.

Never invent:

- products
- product descriptions
- prices
- inventory
- addresses
- contact information
- shipping policies
- return policies
- business policies
- customer testimonials

Use placeholders or ask for missing information instead.

## Design

Read `docs/DESIGN.md` before visual implementation.

## Project Decisions

Update `docs/DECISIONS.md` when an explicit, durable project decision is made.

## Ecommerce

Do not add or configure any of the following without explicit instruction:

- Shopify
- payment processing
- checkout systems
- customer accounts
- databases
- authentication
- inventory integrations
- backend services

## Privacy and Analytics

Do not add:

- analytics
- advertising trackers
- telemetry
- marketing pixels
- third-party tracking scripts

unless explicitly instructed.

## Dependencies

Do not add dependencies without a concrete reason.

Prefer the tools already present in the repository before introducing another
package.

## Deployment

Do not modify hosting, deployment, domains, DNS, CI/CD, or production
configuration unless explicitly instructed.

## Git

Do not commit or push changes unless explicitly instructed.

Keep changes narrowly scoped and easy to review.
