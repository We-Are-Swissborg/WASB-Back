import { describe, expect, test } from "@jest/globals";
import { generateRandomCode, generateRandomNonce } from '../src/utils/generator';

describe('genrerate random code', () => {
  const regex = /^[A-Z0-9]+$/;

  test('generate code of length', () => {
    let code = generateRandomCode(100);

    expect(code).toHaveLength(100);
    expect(code).toMatch(regex);

    code = generateRandomCode(Number('10'));

    expect(code).toHaveLength(10);
    expect(code).toMatch(regex);

    code = generateRandomCode();

    expect(code).toHaveLength(5);
    expect(code).toMatch(regex);
  })
  test('generate nonce of length', () => {
    let  code = generateRandomNonce(Number('10'));
    expect(code).toHaveLength(10);

    code = generateRandomNonce(100);
    expect(code).toHaveLength(100);

    code = generateRandomNonce();
    expect(code).toHaveLength(32);
  })
})
