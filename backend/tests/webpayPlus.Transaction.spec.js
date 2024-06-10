const request = require('supertest');
const app = require('../src/app');
const { WebpayPlus } = require('transbank-sdk');

// Suppress console.error during tests to avoid cluttering the output
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});


// Mock the WebpayPlus SDK
jest.mock('transbank-sdk', () => {
    const createMock = jest.fn().mockResolvedValue({
        token: 'mocked-token',
        url: 'https://mocked.url',
    });
    return {
        WebpayPlus: {
            configureForTesting: jest.fn(),
            Transaction: jest.fn().mockImplementation(() => ({
                create: createMock,
            })),
        },
    };
});

const createMock = WebpayPlus.Transaction().create;

// Mock the conditionalJWT middleware
jest.mock('../src/middleware/conditionalJWT', () => (req, res, next) => {
    if (req.body.isUserLogged) {
        req.headers['authorization'] = 'Bearer mockToken';
    }
    next();
});

// Mock the verifyJWT middleware
jest.mock('../src/middleware/verifyJWT', () => {
    const jwt = require('jsonwebtoken');
    jwt.verify = jest.fn((token, secret, callback) => {
        if (token === 'mockToken') {
            callback(null, { userId: 'mockUserId' });
        } else {
            callback(new Error('Invalid token'));
        }
    });
    return (req, res, next) => next();
});

describe('POST /create_transaction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a transaction successfully', async () => {
        createMock.mockResolvedValueOnce({
            token: 'mocked-token',
            url: 'https://mocked.url',
        });

        const response = await request(app)
            .post('/create_transaction')
            .send({ cartId: 'cart-123', amount: 1000, isUserLogged: true });

        console.log('Mock Calls:', createMock.mock.calls);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            token: 'mocked-token',
            url: 'https://mocked.url',
        });

        expect(createMock).toHaveBeenCalledWith(
            expect.any(String), // definitiveOrderId
            expect.any(String), // sessionId
            expect.any(Number), // newTotal
            expect.any(String)  // returnUrl
        );
    });

    test('should return an error if transaction creation fails', async () => {
        createMock.mockRejectedValueOnce(new Error('Transaction failed'));

        const response = await request(app)
            .post('/create_transaction')
            .send({ cartId: 'cart-123', amount: 1000, isUserLogged: true });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Transaction failed', stack: expect.any(String) });

        console.log('Mock Calls:', createMock.mock.calls);
    });
});
