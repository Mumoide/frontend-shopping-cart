const actualPg = jest.requireActual('pg');

class MockPool {
    constructor() {
        this.connect = jest.fn().mockResolvedValue(this);
        this.end = jest.fn().mockResolvedValue();
        this.query = jest.fn().mockImplementation((query, values) => {
            // console.log('Query:', query);
            // console.log('Values:', values);

            if (query.includes('SELECT c.cart_id , p.price*ci.quantity as price')) {
                return Promise.resolve({ rows: [{ sum: '1000' }] });
            }
            if (query.includes('SELECT discount FROM discounts WHERE id = $1')) {
                return Promise.resolve({ rows: [{ discount: '0.1' }] });
            }
            if (query.includes('SELECT user_id FROM carts WHERE cart_id = $1')) {
                return Promise.resolve({ rows: [{ user_id: 'user-123' }] });
            }
            if (query.includes('INSERT INTO orders')) {
                return Promise.resolve({ rows: [{ order_id: 'order-123' }] });
            }
            if (query.includes('SELECT product_id, quantity FROM cart_items')) {
                return Promise.resolve({ rows: [{ product_id: 'product-123', quantity: 1 }] });
            }
            if (query.includes('SELECT price FROM products WHERE product_id = $1')) {
                return Promise.resolve({ rows: [{ price: 1000 }] });
            }
            return Promise.resolve({ rows: [] });
        });
    }
}

module.exports = { ...actualPg, Pool: MockPool };
