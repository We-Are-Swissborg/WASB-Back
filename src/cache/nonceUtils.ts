import { logger } from '../middlewares/logger.middleware';
import { generateRandomNonce } from '../utils/generator';
import { nonceCache } from './cacheManager';

type NonceData = {
    used: boolean;
}

export const createNonce = async (): Promise<string> => {
    const nonce = generateRandomNonce();
    logger.info('createNonce', { nonce })
    const nonceData: NonceData = { used: false };

    await nonceCache.set(nonce, nonceData);
    return nonce;
};

export const verifyAndUseNonce = async (nonce: string): Promise<boolean> => {
    const nonceData = await nonceCache.get<NonceData>(nonce);

    if (!nonceData || nonceData.used) {
        return false;
    }

    await nonceCache.set(nonce, { ...nonceData, used: true });
    return true;
};
