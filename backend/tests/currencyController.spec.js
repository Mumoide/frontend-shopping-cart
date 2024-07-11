const request = require('supertest');
const app = require('../src/app');

// Suppress console.error during tests to avoid cluttering the output
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    console.error.mockRestore();
});

describe('GET /dollar-price', () => {
    afterEach(() => {
        fetch.resetMocks();
    });

    test('should respond with dollar price data', async () => {
        const mockResponseData = {
            Dolares: [
                { Fecha: "2024-01-01", Valor: "800.00" }
            ]
        };

        fetch.mockResponseOnce(JSON.stringify(mockResponseData));

        const response = await request(app).get('/dollar-price').send();
        // console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResponseData);
    });

    test('should handle fetch errors', async () => {
        fetch.mockReject(new Error("Fetch failed"));

        const response = await request(app).get('/dollar-price').send();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Server error fetching dollar price." });
    });
});
