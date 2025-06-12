import { Request, Response } from 'express';
import { authWallet } from '../src/controllers/security.web3.controller';
import { logger } from '../src/middlewares/logger.middleware';
import { verifyAndUseNonce } from '../src/cache/nonceUtils';
import nacl from 'tweetnacl';

// security.web3.controller.test.ts

// Mocks
jest.mock('../middlewares/logger.middleware');
jest.mock('../cache/nonceUtils');

describe('authWallet', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject = {};

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse;
      }),
      send: jest.fn().mockReturnThis(),
    };

    // Setup default valid test data
    const keyPair = nacl.sign.keyPair();
    const message = new TextEncoder().encode("Test message");
    const signature = nacl.sign.detached(message, keyPair.secretKey);
    
    // Convert publicKey to number array
    const publicKeyArray = Array.from(keyPair.publicKey);
    const account = publicKeyArray.reduce((acc, val, idx) => {
      acc[idx] = val;
      return acc;
    }, {});

    mockRequest = {
      body: {
        account: account,
        nonce: 'valid-nonce',
        output: {
          signedMessage: Array.from(message),
          signature: Array.from(signature)
        }
      }
    };

    // Default nonce verification
    (verifyAndUseNonce as jest.Mock).mockReturnValue(true);
  });

  test('should authenticate with valid signature', async () => {
    await authWallet(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseObject).toHaveProperty('token', 'Bien joué');
  });

  test('should reject invalid nonce', async () => {
    (verifyAndUseNonce as jest.Mock).mockReturnValue(false);
    
    await authWallet(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject).toHaveProperty('error', 'Invalid or expired nonce');
  });

  test('should reject invalid signature', async () => {
    // Generate different keypair for invalid signature
    const fakeKeyPair = nacl.sign.keyPair();
    const message = new TextEncoder().encode("Test message");
    const invalidSignature = nacl.sign.detached(message, fakeKeyPair.secretKey);
    
    mockRequest.body.output.signature = Array.from(invalidSignature);
    
    await authWallet(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject).toHaveProperty('error', 'Signature invalide');
  });

  test('should handle malformed request data', async () => {
    mockRequest.body = {};
    
    await authWallet(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});