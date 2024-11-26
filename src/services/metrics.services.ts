import NodeCache from "node-cache";
import { Request, Response } from 'express';
import { logger } from "../middlewares/logger.middleware";

const metricsCache = new NodeCache();

const setMetricsCache = async (req: Request, res: Response) => {
  try {
    const metrics = req.body.metrics;
    const validType = ['string', 'undefined']; // Type of data authorized.

    if(!metrics) throw new Error('Metrics is missing for cache.');

    // Verify metrics values are valid.
    Object.keys(metrics).forEach((cryptoName) => {
      const metricsKeys = Object.keys(metrics[cryptoName]);
      const metricsValues = Object.values(metrics[cryptoName]);

      metricsValues.forEach((value, id) => {
        if (!validType.includes(typeof value)) throw new Error(`${cryptoName} ${metricsKeys[id]} type invalid`);
      })
    })

    metricsCache.set('metrics', metrics);
    logger.debug('Metrics Cached');

    res.status(201).json({message: 'Set metrics cache OK !'});
  } catch (e: unknown) {
    logger.error(`Metrics cache error :`, e);
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const getCryptoAvailable = async (req: Request, res: Response) => {
  try {
    const metrics = metricsCache.get('metrics');
    const cryptoAvailable: Record<string, string> = {};

    // Get crypto with walue for main metrics page.
    for (const [crypto, metricsProp] of Object.entries(metrics as object)) {
      if(metricsProp.value) cryptoAvailable[crypto] = metricsProp.value;
    }

    res.status(200).json({cryptoAvailable});
  } catch (e: unknown) {
    logger.error(`Metrics not found.`);
    res.status(400).json({ message: `Metrics not found.` });
  }
};

const getOneCrypto = async (req: Request, res: Response) => {
  const crypto = req.params.crypto;
  try {
    const metrics: Record<string, string | undefined> | undefined = metricsCache.get('metrics');

    if(!metrics || !metrics[crypto]) throw new Error;

     res.status(200).json({metricsCrypto: metrics[crypto]});
  } catch (e: unknown) {
    logger.error(crypto + ` metrics not found.`);
    res.status(400).json({ message: crypto + ` metrics not found.` });
  }
};

export { setMetricsCache, getCryptoAvailable, getOneCrypto };