import { TokenPayload } from './../src/types/TokenPayload';
import { beforeEach, describe, expect, test} from '@jest/globals';
import { User } from '../src/models/user.model'
import { generateRefreshToken, generateToken, validateRefreshToken, validateToken } from '../src/services/jwt.services';
import { plainToInstance } from 'class-transformer';
import Role from '../src/types/Role';

jest.mock('../src/models/user.model', () => {
	return jest.fn()
});

beforeEach(() => {
    jest.resetAllMocks();
});

const jane = {
	id: 1,
    firstName: "Jane",
    lastName: "Doe",
    username:"Username",
    email: "mail@test.dev",
    walletAddress: "5F1JU",
	roles: [Role.Member, Role.Moderator],
	nbReferred: [],
};

const user: User = plainToInstance(User, jane);

describe('JWT test', () => {
    test('validateToken : the user has the same information after token generation', () => {
        const token: string = generateToken(user);
        const decodedToken = validateToken(token) as TokenPayload;

        expect(token.length > 10).toBeTruthy();
        expect(!!decodedToken).toBeTruthy();

		expect(decodedToken.userId).toEqual(user.id);
		expect(decodedToken.wallet).toEqual(user.walletAddress);
		expect(decodedToken.roles).toEqual(user.getRoles);
    })

	test('validateToken -> changed informations user', () => {
        const token: string = generateToken(user);
        const decodedToken = validateToken(token) as TokenPayload;

		expect(decodedToken.userId).not.toEqual(2);
		expect(decodedToken.wallet).not.toEqual("5F1JUq");
		expect(decodedToken.roles).not.toEqual([]);
    })

    test('validateToken -> token modified', () => {
        const token: string = generateToken(user);
        expect(() => { validateToken(token.replace('U','V')); }).toThrow();
    })
})

describe('refresh JWT test', () => {
    test('generateRefreshToken -> the user has a token and a refresh token', () => {
        const token: string = generateToken(user);
        const decodedToken = validateToken(token) as TokenPayload;
        const refreshToken: string = generateRefreshToken(user);
        const decodedrefreshToken = validateRefreshToken(refreshToken) as TokenPayload;

        expect(token.length > 10 && refreshToken.length > 10).toBeTruthy();
        expect(!!decodedToken).toBeTruthy();
        expect(!!decodedrefreshToken).toBeTruthy();

		expect(decodedToken.userId).toEqual(decodedrefreshToken.userId);
		expect(decodedToken.username).toEqual(decodedrefreshToken.username);
    })

	test('generateRefreshToken -> changed informations user', () => {
        const token: string = generateToken(user);
        const decodedToken = validateToken(token) as TokenPayload;

		expect(decodedToken.userId).not.toEqual(2);
		expect(decodedToken.wallet).not.toEqual("5F1JUq");
		expect(decodedToken.roles).not.toEqual([]);
    })

    test('validateToken -> token modified', () => {
        const token: string = generateToken(user);
        expect(() => { validateToken(token.replace('U','V')); }).toThrow();
    })
})

// describe('Error refreshToken', () => {
//     test('refreshToken -> Error 498', () => {
        
//     })
// })