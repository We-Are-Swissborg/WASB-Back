import type { SolanaSignInOutput } from '@solana/wallet-standard-features' with { 'resolution-mode': 'import' };
import { ed25519 } from '@noble/curves/ed25519';
import { logger } from '../middlewares/logger.middleware';
// import { getUserByWallet } from '../repository/user.repository';

// /**
//  * Generate a nonce for a wallet user
//  * @param {string} walletAddress public address of wallet
//  * @returns {Promise<IUser>} user updated with new nonce and date expires
//  */
// const generateNonce = async (walletAddress: string): Promise<IUser> => {
//     logger.info('generateNonce', { walletAddress: walletAddress });

//     if (!walletAddress) {
//         throw new Error(`Wallet is not initialized`);
//     }

//     const nonce = generateRandomNonce();

//     // Set the expiry of the nonce to 1 hour
//     const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

//     const user = await getUserByWallet(walletAddress);

//     const [newUser, created] = await User.upsert({
//         id: user?.id,
//         walletAddress: walletAddress,
//         nonce: nonce,
//         expiresIn: expires,
//     });

//     logger.info('new user or new connection ? ', { created: created });

//     return newUser;
// };

/**
 * According to a wallet address. Compare whether the message signed on the blockchain contains the nonce registered for the wallet.
 * @param {Uint8Array} walletAddress wallet address
 * @param {Uint8Array} signedMessage signature hash
 * @param {Uint8Array} signature signature hash
 * @returns {Promise<User>} user
 */
// const confirmSignMessage = async (walletAddress: string, signedMessage: Uint8Array, signature: Uint8Array): Promise<void> => {
const confirmSignMessage = async (output: SolanaSignInOutput): Promise<void> => {
    logger.info('confirmSignMessage', { walletAddress: output });

    try {
        // TODO: récupérer le message dans la table des Paramètres.
        // const publicKey = getBase58Codec.(walletAddress);
        // logger.info(`signedMessage`, getBase58Decoder().decode(signedMessage));
        // logger.info(`signature`, getBase58Decoder().decode(signature));
        // logger.info(`walletAddress`, { walletAddress });
        // logger.info(`publicKey`, publicKey);

        // const test = createPublicKey(walletAddress);
        // logger.info(`test`, test);
        // logger.info(`test.toCryptoKey`, test.toCryptoKey);

        const verified = ed25519.verify(output.signature, output.signedMessage, output.account.publicKey as Uint8Array);
        logger.info('verified', verified);

        if (!verified) throw new Error('An error during signature validation');

        // If the signature is validated, we no longer need the nonce
        // deleteNonce(nonce);
        // logger.info('return user info', nonce);
        // return nonce;
    } catch (e) {
        logger.error('Error : confirmSignMessage ', e);
        throw e;
    }
};

// /**
//  * Deletes the nonce for the user
//  * @param {IUser} user
//  */
// const deleteNonce = async (user: IUser): Promise<void> => {
//     logger.info('deleteNonce', { userId: user.id, nonce: user.nonce });

//     user.nonce = null;
//     user.expiresIn = null;
//     const updatedUser = user as User;

//     updatedUser.save();

//     logger.info('The nonce for the user has been removed', { userId: updatedUser.id, nonce: updatedUser.nonce });
// };

// /**
//  *
//  * @param {string} signedMessage message content signed
//  * @param {string} signature signature hash
//  * @param {string} address wallet address
//  * @returns whether the signature corresponds to the message
//  */
// const isValidSignaturePolkadot = (signedMessage: string, signature: string, address: string) => {
//     const publicKey = utilCrypto.decodeAddress(address);
//     const hexPublicKey = util.u8aToHex(publicKey);
//     return utilCrypto.signatureVerify(signedMessage, signature, hexPublicKey).isValid;
// };

export { confirmSignMessage };
