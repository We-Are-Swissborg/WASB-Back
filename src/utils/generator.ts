import crypto from 'node:crypto';

/**
 * Generate a random code of {length} characters
 * @param {number} [length=5] Random code length
 * @returns {string} random code
 */
const generateRandomCode = (length: number = 5): string => {
    let code = '';
    const letterArray = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];

    while (code.length < length) {
        const randomNumber = Math.floor(Math.random() * 10);
        const randomForLetter = Math.floor(Math.random() * 26);
        const letterOrNumber = Math.floor(Math.random() * 2);

        if (letterOrNumber === 0) code += letterArray[randomForLetter];
        if (letterOrNumber === 1) code += randomNumber;
    }
    return code;
};

/**
 * Generate a random nonce of {length} characters
 * @param {number} [length=32] Random nonce length
 * @returns {string} random nonce
 */
const generateRandomNonce = (length: number = 32): string => {
    return crypto.randomBytes(length / 2).toString('hex');
};

export { generateRandomCode, generateRandomNonce };
