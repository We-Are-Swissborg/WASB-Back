import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Metrics from '../services/metrics.services';

export const metricsRouter: Router = express.Router();

metricsRouter.post('/', Auth.authorizeMetrics, Metrics.setMetricsCache);
metricsRouter.get('/', Metrics.getCryptoAvailable);
metricsRouter.get('/:crypto', Metrics.getOneCrypto);