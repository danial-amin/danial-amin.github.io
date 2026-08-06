## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Publishing a post

`/studio` is the writing desk: paste markdown, preview it, publish. It is
unlisted and `noindex`, and it has its own passphrase (`PUBLISH_PASSPHRASE`) —
deliberately not the one for the confidential cases. Reading a client's outcome
and being able to commit to the site are different privileges, so the two gates
in `src/server/gate.ts` keep separate secrets, separate cookies, separate
failure counters, and separate signing realms: a `cases_grant` cookie is not
accepted at the studio even if both passphrases were set to the same string.

Publishing does not store anything in the running container. `/api/publish`
commits the composed file to `src/content/writing/{essays,newsletter}/` over the
GitHub contents API, which means:

- every post is a normal collection entry, in version control, rendered by
  `/writing/[...slug]` with no second code path;
- a post goes live when the deploy that follows the commit finishes, not when
  the button is pressed;
- `PUBLISH_BRANCH` must be the branch the deploy watches, or the post lands in
  git and never appears.

The concept cloud on the homepage is derived, not stored: `npm run build` runs
`scripts/build-concept-map.mjs` before `astro build`, so the deploy that follows a
publish rebuilds `src/data/concept-map.json` from the corpus including the new
post. The generator is deterministic — no `Math.random`, fixed seeds, and
eigenvector signs canonicalised from the data — so an unchanged corpus produces a
byte-identical file and the cloud does not reshuffle itself between deploys. One
new post moves terms a median of 13% of the field and turns over about one term in
the 210. The checked-in JSON is a convenience for `astro dev`; the build always
regenerates it, so it can lag without affecting the deployed site.

`src/server/post.ts` is the single authority on slug, filename, frontmatter and
validation. It mirrors the zod schema in `src/content.config.ts` on purpose: a
post that fails there would otherwise fail the production build and take the
whole site down with it. `/api/preview` renders with Astro's own markdown
processor, so the preview and the published page cannot drift.

See `.env.example` for the token and repository variables.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
