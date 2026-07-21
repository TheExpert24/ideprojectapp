# SEO Strategy

## In scope
- Public web experience generated from `artifacts/mobile`
- Public auth screens (`/(auth)/**`) and any publicly reachable web routes in the Expo web build
- Crawler-facing files for the deployed web build (`robots.txt`, `sitemap.xml`, `llms.txt`, favicon, HTML shell)

## Out of scope
- Native mobile app store optimization
- Internal API endpoints under `artifacts/api-server/src/**`
- Authenticated-only user state and admin workflows unless they are publicly reachable on the web build

## Target audience
- Unknown — likely people discovering the Ide app and its public journal/resources content via the web.

## Primary keywords
- Unknown — update once product positioning is clearer.

## Dismissed categories
- (None yet)

## Notes
- This repository appears to be an Expo Router mobile app with a web export, not a conventional SSR marketing site.
- SEO findings should be based on what the exported web HTML and server fallback expose to crawlers.
