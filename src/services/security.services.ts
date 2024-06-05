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
	logger.info('generateNonce', {walletAddress :walletAddress});

	const nonce = crypto.randomBytes(32).toString("hex");

	// Set the expiry of the nonce to 1 hour
	const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

	const user = await getUserByWallet(walletAddress);

	const	[newUser, created] = await User.upsert({
			id: user?.id,
			walletAddress: walletAddress,
			nonce: nonce,
			expiresIn: expires,
		});

	logger.info('new user or new connection ? ', {created :created});

	return newUser;
}

/**
 *
 * @param walletAddress
 * @param signedMessageHash
 * @returns
 */
const confirmSignMessage = async (walletAddress: string, signedMessageHash: string): Promise<IUser> => {
	logger.info('confirmSignMessage', {walletAddress :walletAddress, signedMessageHash: signedMessageHash});

	const nonce = await getUserNonce(walletAddress);
	try
	{
		if(!nonce)
			throw new Error(`L'authentification n'est plus valide pour cette adresse`);

		logger.info('nonce retrieve', nonce.nonce);

		const message = `Confirm your authentication to our community #WeAreSwissborg \nNONCE : ${nonce.nonce}`;

		const isValid = isValidSignaturePolkadot(
			message,
			signedMessageHash,
			walletAddress
		);

		if(!isValid)
			throw new Error('Une erreur lors de la validation de la signature');
	}
	catch(e) {
		logger.error('Error : isValidSignaturePolkadot ', e);
		throw e;
	}

	logger.info('return user info', nonce);
	return nonce;
}

const isValidSignaturePolkadot = (signedMessage: string, signature: string, address: string) => {
	const publicKey = utilCrypto.decodeAddress(address);
	const hexPublicKey = util.u8aToHex(publicKey);
	return utilCrypto.signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

export { generateNonce, confirmSignMessage }
