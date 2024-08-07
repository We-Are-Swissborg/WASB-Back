import { IUser, User } from '../models/user.model';
import { logger } from '../middlewares/logger.middleware';
import { getUserByWallet, getUserNonce } from '../repository/user.repository';
import { generateRandomNonce } from '../utils/generator';
/* eslint-disable */
const utilCrypto = require('@polkadot/util-crypto');
const util = require('@polkadot/util');
/* eslint-enable */

/**
 * Generate a nonce for a wallet user
 * @param {string} walletAddress public address of wallet
 * @returns {Promise<IUser>} user updated with new nonce and date expires
 */
const generateNonce = async (walletAddress: string): Promise<IUser> => {
    logger.info('generateNonce', { walletAddress: walletAddress });

    if (!walletAddress) {
        throw new Error(`Wallet is not initialized`);
    }

    const nonce = generateRandomNonce();

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
 * According to a wallet address. Compare whether the message signed on the blockchain contains the nonce registered for the wallet.
 * @param {string} walletAddress wallet address
 * @param {string} signedMessageHash signature hash
 * @returns {Promise<User>} user
 */
const confirmSignMessage = async (walletAddress: string, signedMessageHash: string): Promise<User> => {
    logger.info('confirmSignMessage', { walletAddress: walletAddress, signedMessageHash: signedMessageHash });

    try {
        const nonce = await getUserNonce(walletAddress);
        logger.info('nonce retrieve', nonce.nonce);

        const message = `Confirm your authentification to our community #WeAreSwissborg \nNONCE : ${nonce.nonce}`;

        const isValid = isValidSignaturePolkadot(message, signedMessageHash, walletAddress);

        if (!isValid) throw new Error('An error during signature validation');

        // If the signature is validated, we no longer need the nonce
        deleteNonce(nonce);
        logger.info('return user info', nonce);
        return nonce;
    } catch (e) {
        logger.error('Error : confirmSignMessage ', e);
        throw e;
    }
};

/**
 * Deletes the nonce for the user
 * @param {IUser} user
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
 * @param {string} signedMessage message content signed
 * @param {string} signature signature hash
 * @param {string} address wallet address
 * @returns whether the signature corresponds to the message
 */
const isValidSignaturePolkadot = (signedMessage: string, signature: string, address: string) => {
    const publicKey = utilCrypto.decodeAddress(address);
    const hexPublicKey = util.u8aToHex(publicKey);
    return utilCrypto.signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export { generateNonce, confirmSignMessage };
