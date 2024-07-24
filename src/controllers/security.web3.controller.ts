import { Request, Response } from 'express';
import { updateLastLogin } from '../services/user.services';
import { confirmSignMessage, generateNonce } from '../services/security.web3.services';
import { generateToken } from '../services/jwt.services';
import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';

/**
 * Generate Nonce for user
 *
 * @param req Request
 * @param res Response
 */
const nonce = async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.body;

        const user = await generateNonce(walletAddress);
        const userDTO = instanceToPlain(user, { groups: ['auth'], excludeExtraneousValues: true });
        res.status(200).json(userDTO);
    } catch (e: unknown) {
        logger.error(`nonce error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates a user with wallet
 *
 * @param req Request
 * @param res Response
 */
const authWallet = async (req: Request, res: Response) => {
    try {
        const { walletAddress, signedMessageHash } = req.body;
        logger.info(`Attempt authWallet`, req.body);

        const user = await confirmSignMessage(walletAddress, signedMessageHash);
        updateLastLogin(user);
        const token = generateToken(user);

        res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { authWallet, nonce };
