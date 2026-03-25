import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: 'ntv-box.myshopify.com',
  apiVersion: '2026-01',
  publicAccessToken: '18f4bae386da39dd418b4942e697bfaf',
});