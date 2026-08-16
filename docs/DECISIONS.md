# Crafty Project Decisions

## 2026-08-09

- Crafty will be developed as a home-based, online-first artist and maker
  business with low overhead.
- The website will serve as an artist portfolio, a source of
  commission/custom-work leads, and a storefront for ready-to-buy work.
- The website will be the permanent business hub; physical events are not the
  primary business model.
- Portfolio work does not need to be for sale, ready-made work may be sold, and
  custom shirts and paintings may be handled through inquiries.
- Initial marketing will emphasize finished work, word of mouth, community
  connections, and online outreach. Paid advertising may be tested later once
  the business has a credible destination and clear offers.
- No public shirt-pricing model has been established. Future internal costing
  should account for vinyl area and actual additional labor rather than color
  count alone.
- The visual direction will be professional and artist/maker-led, will treat
  artwork seriously, and will preserve clear storefront usability.
- The site will not use a generic corporate ecommerce-template feel or an
  excessively flat or dark visual direction.
- The official Crafty logo will guide the eventual visual language; no
  replacement logo will be invented.
- Undecided business and design matters will remain explicitly unknown or TBD
  until a decision is made- The website will serve as an artist portfolio, a source of
  commission/custom-work leads, and a storefront for ready-to-buy work..
- `crafty` is the internal repository/project name only. The customer-facing
  business and brand name is **Breezy's Creative Co.**
- Public-facing website copy, branding, and metadata will use Breezy's Creative
  Co.
- The current visual direction is a restrained, editorial maker/atelier style
  informed by the official botanical scissors logo, with neutral foundations
  that allow the artwork itself to provide much of the color.

- The updated Breezy's Creative Co. homepage wireframe is approved as the current
  visual direction.
- The approved homepage hierarchy is Header, Hero, Selected Work, Commissions,
  Shop Preview, About Bre, and Footer.
- Portfolio presentation intentionally precedes the Shop on the homepage.
- The visual system will use a warm neutral editorial foundation, layered real
  photography, botanical/scissors influences from the official logo, and clear
  conventional storefront interactions.

- `Crafty` remains the internal repository/project name, while `Breezy's Creative Co.` is the public-facing business name.
- The approved brand direction is warm, handmade, feminine, editorial, and professional.
- The approved visual language includes warm paper/cream tones, dark ink typography, delicate botanical illustration, and subtle decorative accents.
- The logo may be creatively refined and extended as long as it remains recognizably rooted in the current Breezy's Creative Co. identity.
- Decorative accents derived from the logo's floral/botanical/bird language are approved for use across the site.
- The homepage should prioritize brand identity, portfolio visibility, commissions/custom work, and shopping in that order rather than behaving like a generic storefront.

- Crafty/Breezy's will use a component-oriented Astro architecture: pages will
  compose meaningful section and shared components, while Svelte will be
  reserved for genuine client-side interactivity.

## 2026-08-12

- Production will use Cloudflare Workers through the official Astro Cloudflare
  adapter and Wrangler, rather than a Cloudflare Pages deployment workflow.
  Astro remains static by default; narrow server endpoints opt out individually
  with `prerender = false`.
- Transactional form email will use Resend, and commerce integration is planned
  around Square.
- Secrets remain server-side in Cloudflare Worker secrets and local `.dev.vars`;
  they are never committed or exposed to client code. No Cloudflare storage
  resource is provisioned until one is explicitly needed.
- The production public domain is `breezys.net`, with the Cloudflare Worker as
  the application origin. The `workers.dev` address remains available for
  development and fallback access.
- Breezy's uses one universal contact form. Commission pages explain custom work
  and direct visitors to that form, where a broad topic dropdown categorizes
  the inquiry.
- Only `/api/contact` handles website inquiries. Email subjects begin with the
  selected topic for quick inbox scanning, and the visitor's email remains the
  Reply-To address.
- Resend sends one internal notification to Bre for each successful submission.
  Email credentials remain server-side, and no customer auto-response is sent.

## 2026-08-16

- The storefront will support two distinct product types: repeatable
  **made-to-order** products that are made after purchase from established
  designs and choices, and finished **one-of-one** work that can be available or
  sold. These labels describe how a shop item is offered; they do not establish
  any unconfirmed product, option, price, inventory, or turnaround details.
- True commissions remain outside the normal shop catalog and checkout flow. If
  Bre must understand an individual request before defining its choices and
  price, the visitor is directed through `/commissions` to the universal contact
  form instead.
- Shop presentation data is centralized in `src/data/shop-catalog.ts` and passed
  into reusable Astro components. The initial catalog is deliberately empty so
  sample data cannot be mistaken for live inventory.
- The current product type is a small, provider-neutral presentation model for
  storefront cards. Square-specific identifiers, variation structures,
  inventory mapping, product-detail routes, and checkout behavior are deferred
  until the real launch catalog and Square integration boundary are confirmed.
- Still unresolved: launch products, product options and variations, prices,
  product photography, availability, turnaround times, shipping and return
  policies, and the exact Square catalog/checkout architecture.
