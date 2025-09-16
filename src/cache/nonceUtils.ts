import { logger } from '../middlewares/logger.middleware';
import { INonceData } from '../types/Cache';
import { generateRandomNonce } from '../utils/generator';
import { cache } from './cacheManager';

export const createNonce = async (): Promise<string> => {
    const nonce = generateRandomNonce();
    logger.info('createNonce', { nonce });
    const nonceData: INonceData = { used: false };

    await cache.set(nonce, nonceData, 300);
    return nonce;
};

export const verifyAndUseNonce = async (nonce: string): Promise<boolean> => {
    const nonceData = await cache.get<INonceData>(nonce);

    if (!nonceData || nonceData.used) {
        return false;
    }

    await cache.set(nonce, { ...nonceData, used: true }, 300);
    return true;
};
