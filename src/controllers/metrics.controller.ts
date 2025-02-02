import NodeCache from 'node-cache';
import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import { checkMetrics, getCryptoWithValue } from '../services/metrics.services';

const metricsCache = new NodeCache();

const setMetricsCache = async (req: Request, res: Response) => {
    try {
        const metrics = req.body.metrics;

        if (!metrics) throw new Error('Metrics is missing for cache.');

        // Verify metrics values are valid.
        checkMetrics(metrics.crypto);

        metricsCache.set('metrics', metrics);
        logger.debug('Metrics Cached');

        res.status(201).json({ message: 'Set metrics cache OK !' });
    } catch (e: unknown) {
        logger.error(`Metrics cache error :`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getCryptoAvailable = async (req: Request, res: Response) => {
    try {
        const metrics: (Record<'crypto', Record<string, object>> & Record<'lastUpdate', Date>) | undefined =
            metricsCache.get('metrics');
        if (!metrics) throw new Error();

        const cryptoList: Record<string, object> = metrics.crypto;
        const lastUpdate: Date = metrics.lastUpdate;

        const cryptoAvailable: Record<'crypto', object> & Record<'lastUpdate', Date> = {
            crypto: getCryptoWithValue(cryptoList),
            lastUpdate: lastUpdate,
        }; // Get crypto with walue for main metrics page.

        res.status(200).json({ cryptoAvailable });
    } catch {
        logger.error(`Metrics not found.`);
        res.status(400).json({ message: `Metrics not found.` });
    }
};

const getOneCrypto = async (req: Request, res: Response) => {
    const crypto = req.params.crypto;
    try {
        const metrics: (Record<'crypto', Record<string, string>> & Record<'lastUpdate', Date>) | undefined =
            metricsCache.get('metrics');

        if (!metrics || !metrics.crypto[crypto]) throw new Error();

        const metricsCrypto = {
            crypto: metrics.crypto[crypto],
            lastUpdate: metrics.lastUpdate,
        };

        res.status(200).json({ metricsCrypto });
    } catch {
        logger.error(crypto + ` metrics not found.`);
        res.status(400).json({ message: crypto + ` metrics not found.` });
    }
};

export { setMetricsCache, getCryptoAvailable, getOneCrypto };
