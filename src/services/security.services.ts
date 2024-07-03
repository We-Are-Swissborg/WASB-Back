import { IUser, User } from '../models/user.model';
import crypto from 'node:crypto';
import { getUserNonce, getUserByWallet } from './user.services';
import { logger } from '../middlewares/logger.middleware';
/* eslint-disable */
const utilCrypto = require('@polkadot/util-crypto');
const util = require('@polkadot/util');
/* eslint-enable */

/**
 * generateNonce
 * @param walletAddress public address of wallet
 * @returns user updated with new nonce and date expires
 */
const generateNonce = async (walletAddress: string): Promise<IUser> => {
    logger.info('generateNonce', { walletAddress: walletAddress });

    if (!walletAddress) {
        throw new Error(`Wallet is not initialized`);
    }

    const nonce = crypto.randomBytes(32).toString('hex');

    // Set the expiry of the nonce to 1 hour
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    const user = await getUserByWallet(walletAddress);

    const [newUser, created] = await User.upsert({
        id: user?.id,
        walletAddress: walletAddress,
        nonce: nonce,
        expiresIn: expires,
    });

    logger.info('new user or new connection ? ', { created: created });

    return newUser;
};

/**
 *
 * @param walletAddress
 * @param signedMessageHash
 * @returns
 */
const confirmSignMessage = async (walletAddress: string, signedMessageHash: string): Promise<IUser> => {
    logger.info('confirmSignMessage', { walletAddress: walletAddress, signedMessageHash: signedMessageHash });

    const nonce = await getUserNonce(walletAddress);
    try {
        if (!nonce) throw new Error(`Authentication is no longer valid for this address`);

        logger.info('nonce retrieve', nonce.nonce);

        const message = `Confirm your authentication to our community #WeAreSwissborg \nNONCE : ${nonce.nonce}`;

        const isValid = isValidSignaturePolkadot(message, signedMessageHash, walletAddress);

        if (!isValid) throw new Error('An error during signature validation');

        // If the signature is validated, we no longer need the nonce
        deleteNonce(nonce);
    } catch (e) {
        logger.error('Error : confirmSignMessage ', e);
        throw e;
    }

    logger.info('return user info', nonce);
    return nonce;
};

/**
 *
 * @param user
 */
const deleteNonce = async (user: IUser): Promise<void> => {
    logger.info('deleteNonce', { userId: user.id, nonce: user.nonce });

    user.nonce = null;
    user.expiresIn = null;
    const updatedUser = user as User;

    updatedUser.save();

    logger.info('The nonce for the user has been removed', { userId: updatedUser.id, nonce: updatedUser.nonce });
};

/**
 *
 * @param signedMessage message content signed
 * @param signature signature hash
 * @param address wallet address
 * @returns whether the signature corresponds to the message
 */
const isValidSignaturePolkadot = (signedMessage: string, signature: string, address: string) => {
    const publicKey = utilCrypto.decodeAddress(address);
    const hexPublicKey = util.u8aToHex(publicKey);
    return utilCrypto.signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export { generateNonce, confirmSignMessage };
