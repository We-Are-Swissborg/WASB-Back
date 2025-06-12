import { Request, Response } from 'express';
// import { updateLastLogin } from '../services/user.services';
import { confirmSignMessage } from '../services/security.web3.services';
// import { generateToken } from '../services/jwt.services';
// import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import { createNonce, verifyAndUseNonce } from '../cache/nonceUtils';
import nacl from 'tweetnacl';

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
const authWallet = async (req: Request, res: Response): Promise<void> => {
    try {
        // const { publicKey, signedMessage, signature, nonce } = req.body;
        const { output, nonce, account } = req.body;

        logger.warn(`account '${account}' `, account);
        logger.warn(`signedMessage '${output.signedMessage}' `, output.signedMessage);
        // logger.warn(`signature '${signature}' `, signature);
        // logger.warn(`signature '${signature}' `, signature);

        const keyArray = Object.keys(account)
            .filter(k => !isNaN(Number(k)))
            .sort((a, b) => Number(a) - Number(b))
            .map(k => account[k]);

        const publicKeyUint8 = Uint8Array.from(keyArray);
        logger.warn(`publicKeyUint8 '${publicKeyUint8}' `, publicKeyUint8);
        logger.warn(`keyArray '${keyArray}' `, keyArray);

  
        if (!verifyAndUseNonce(nonce)) {
            logger.error(`Le nonce '${nonce}' n'est pas valide`);
            res.status(401).send({ error: 'Invalid or expired nonce' });
            return;
        }

        const isValid = verifySolanaSignature({
            publicKey: Uint8Array.from(keyArray),
            message: Uint8Array.from(output.signedMessage),
            signature: Uint8Array.from(output.signature),
          });
        
          if (!isValid) {
            res.status(401).json({ error: 'Signature invalide' });
            return;
        }

        const message = 'Bien joué';

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

function verifySolanaSignature({
    publicKey,
    message,
    signature,
  }: {
    publicKey: Uint8Array;
    message: Uint8Array;
    signature: Uint8Array;
  }): boolean {
    try {
      return nacl.sign.detached.verify(message, signature, publicKey);
    } catch (e) {
      console.error("Erreur de vérification:", e);
      return false;
    }
}

export { authWallet, getNonce };
