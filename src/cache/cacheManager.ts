import { createCache } from 'cache-manager';

export const cache = createCache({
    refreshThreshold: 100,
});
