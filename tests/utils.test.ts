import { describe, expect, test } from "@jest/globals";
import { generateRandomCode } from '../src/utils/generator';

describe('genrerate random code', () => {
  const regex = /^[A-Z0-9]+$/;

  test('generate code of length 100', () => {
    const code = generateRandomCode(100);

    expect(code).toHaveLength(100);
    expect(code).toMatch(regex);
  })
  test('generate code of length 10', () => {
    const code = generateRandomCode(Number('10'));

    expect(code).toHaveLength(10);
    expect(code).toMatch(regex);
  })
})
