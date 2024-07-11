const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

describe('GET /products', () => {
    afterAll(async () => {
        await pool.end();
    });

    test('should respond with a 200 status code', async () => {
        pool.query.mockResolvedValue({
            rows: [
                { id: 1, name: 'Martillo', description: 'Herramienta para clavar y desclavar.', price: 5000 },
                { id: 2, name: 'Destornillador', description: 'Herramienta para apretar o alojar tornillos.', price: 4000 }
            ]
        });

        const response = await request(app).get('/products').send();
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, name: 'Martillo', description: 'Herramienta para clavar y desclavar.', price: 5000 },
            { id: 2, name: 'Destornillador', description: 'Herramienta para apretar o alojar tornillos.', price: 4000 }
        ]);
    });
});
