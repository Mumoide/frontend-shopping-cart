const API_URL = 'http://localhost:3000/api/webpay';

const createTransaction = async (buyOrder, sessionId, amount, returnUrl) => {
    const response = await fetch(`${API_URL}/create_transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            buyOrder,
            sessionId,
            amount,
            returnUrl
        })
    });

    if (!response.ok) {
        throw new Error('Error creating transaction');
    }

    return response.json();
};

const commitTransaction = async (token) => {
    const response = await fetch(`${API_URL}/commit_transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    if (!response.ok) {
        throw new Error('Error committing transaction');
    }

    return response.json();
};

export { createTransaction, commitTransaction };
