import nacl from 'tweetnacl';

function verifySolanaSignature({
    publicKey,
    message,
    signature,
}: {
    publicKey: Uint8Array;
    message: Uint8Array;
    signature: Uint8Array;
}): boolean {
    return nacl.sign.detached.verify(message, signature, publicKey);
}

test('Vérifie la signature Solana', () => {
    // 1. Génère une clé de test
    const keyPair = nacl.sign.keyPair();

    // 2. Message à signer
    const message = new TextEncoder().encode("Sign in to WASB\nNonce: test-nonce-123");

    // 3. Signature
    const signature = nacl.sign.detached(message, keyPair.secretKey);

    // 4. Teste la vérif OK
    expect(
        verifySolanaSignature({
            publicKey: keyPair.publicKey,
            message,
            signature,
        })
    ).toBe(true);

    // 5. Teste la vérif KO
    const fakeSignature = nacl.sign.detached(message, nacl.sign.keyPair().secretKey);
    expect(
        verifySolanaSignature({
            publicKey: keyPair.publicKey,
            message,
            signature: fakeSignature,
        })
    ).toBe(false);
});
