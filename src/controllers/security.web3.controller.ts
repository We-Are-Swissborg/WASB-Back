import { Request, Response } from 'express';
// import { updateLastLogin } from '../services/user.services';
import { confirmSignMessage } from '../services/security.web3.services';
// import { generateToken } from '../services/jwt.services';
// import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import { createNonce, verifyAndUseNonce } from '../cache/nonceUtils';

// /**
//  * Generate Nonce for user
//  *
//  * @param req Request
//  * @param res Response
//  */
// const nonce = async (req: Request, res: Response) => {
//     try {
//         const { walletAddress } = req.body;

//         const user = await generateNonce(walletAddress);
//         const userDTO = instanceToPlain(user, { groups: ['auth'], excludeExtraneousValues: true });
//         res.status(200).json(userDTO);
//     } catch (e: unknown) {
//         logger.error(`nonce error`, e);
//         if (e instanceof Error) res.status(400).json({ message: e.message });
//     }
// };

/**
 * Generate Nonce
 *
 * @param req Request
 * @param res Response
 */
const getNonce = async (req: Request, res: Response) => {
    try {
        const nonce = await createNonce();
        res.status(200).json({ nonce });
    } catch (e: unknown) {
        logger.error(`getNonce error`, e);
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
        const { output, nonce } = req.body;
        // const { walletAddress, signedMessage, signature, nonce } = req.body;
        // const { walletAddress, nonce, message, signature } = req.body;
        logger.info(`Attempt authWallet`, req.body);

        if (!verifyAndUseNonce(nonce)) {
            logger.error(`Le nonce '${nonce}' n'est pas valide`);
            res.status(401).send({ error: 'Invalid or expired nonce' });
            return;
        }

        await confirmSignMessage(output);

        const message = new TextEncoder().encode(nonce);

        logger.info('message', message);

        // const user = await confirmSignMessage(walletAddress, signedMessageHash);
        // updateLastLogin(user);
        // const token = generateToken(user);

        res.status(200).json({ token: message });
        // res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};
// const authWallet = async (req: Request, res: Response) => {
//     try {
//         const { walletAddress, signedMessageHash } = req.body;
//         // const { walletAddress, nonce, message, signature } = req.body;
//         logger.info(`Attempt authWallet`, req.body);

//         // const cachedNonce = cache.get(nonce);
//         // if (!cachedNonce || cachedNonce.used) {
//         //     return res.status(401).send({ error: 'Invalid or expired nonce' });
//         // }

//         const user = await confirmSignMessage(walletAddress, signedMessageHash);
//         updateLastLogin(user);
//         const token = generateToken(user);

//         res.status(200).json({ token: token });
//     } catch (e: unknown) {
//         logger.error(`User auth error`, e);
//         if (e instanceof Error) res.status(400).json({ message: e.message });
//     }
// };

export { authWallet, getNonce };
