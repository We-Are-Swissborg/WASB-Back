import { createCache } from 'cache-manager';

export const nonceCache = createCache({
    ttl: 300,
    refreshThreshold: 100,
});
