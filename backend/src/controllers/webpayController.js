const { WebpayPlus } = require('transbank-sdk');
const asyncHandler = require('../utils/async_handler');
const pool = require("../db");

exports.create = asyncHandler(async function (request, response, next) {
    try {
        const { cartId, amount, isUserLogged } = request.body;
        console.log('body ', request.body)
        const validatePrices = async ({ cartId, amount }) => {
            const result = parseInt(
                (
                    await pool.query(
                        `WITH sc AS (
                            SELECT c.cart_id , p.price*ci.quantity as price
                            FROM carts c 
                            JOIN cart_items ci
                            ON ci.cart_id  = c.cart_id 
                            JOIN products p 
                            ON ci.product_id  = p.product_id
                            WHERE c.cart_id  = $1
                            AND ci.active = 1
                                    ) 
                        SELECT SUM(sc.price)
                        FROM sc`,
                        [cartId]
                    )
                ).rows[0].sum
            );
            console.log('result ', result)
            if (amount == result) {
                return true;
            }
            return false;
        };

        if (!(await validatePrices({ cartId, amount }))) {
            return response.status(400).json({ error: "Precios no validos" });
        }

        const applyDiscounts = async ({ isUserLogged, amount, discount }) => {
            if (isUserLogged) {
                const result = await pool.query(
                    `SELECT discount FROM discounts WHERE id = $1;`,
                    [discount]
                );
                const discountValue = parseFloat(result.rows[0].discount);
                console.log('discountValue ', discountValue);
                return amount * (1 - discountValue);
            }
            return amount;
        };

        const newTotal = await applyDiscounts({
            isUserLogged,
            amount,
            discount: "discount_user_logged_in",
        });

        const createOrder = async (cartId, total_price) => {
            const userResult = await pool.query(
                'SELECT user_id FROM carts WHERE cart_id = $1',
                [cartId]
            );
            const userId = userResult.rows[0].user_id;

            const orderResult = await pool.query(
                'INSERT INTO orders (user_id, status, total_price) VALUES ($1, $2, $3) RETURNING order_id',
                [userId, 'Waiting', total_price]
            );
            const orderId = orderResult.rows[0].order_id;

            const cartItemsResult = await pool.query(
                'SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND active = 1',
                [cartId]
            );

            for (const item of cartItemsResult.rows) {
                const productResult = await pool.query(
                    'SELECT price FROM products WHERE product_id = $1',
                    [item.product_id]
                );
                const priceAtTimeOfOrder = productResult.rows[0].price;

                await pool.query(
                    'INSERT INTO order_details (order_id, product_id, quantity, price_at_time_of_order) VALUES ($1, $2, $3, $4)',
                    [orderId, item.product_id, item.quantity, priceAtTimeOfOrder]
                );
            }

            return orderId;
        };

        const orderId = await createOrder(cartId, newTotal);
        console.log('Order created with ID: ', orderId);

        const buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1;
        const sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
        const returnUrl = "http://localhost:3000/payment-confirmation";

        console.log("Initiating transaction with:", {
            buyOrder,
            sessionId,
            newTotal,
            returnUrl,
        });

        const createResponse = await new WebpayPlus.Transaction().create(
            buyOrder,
            sessionId,
            newTotal,
            returnUrl
        );

        const { token, url } = createResponse;

        console.log("Transaction created:", { token, url });

        response.status(200).json({
            token,
            url,
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        response.status(500).json({ error: error.message, stack: error.stack });
    }
});

exports.commit = asyncHandler(async function (request, response, next) {
    console.log("Commit endpoint hit");
    const params = request.method === 'GET' ? request.query : request.body;
    console.log("Params received:", params);

    const token = params.token_ws;
    const tbkToken = params.TBK_TOKEN;
    const tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
    const tbkIdSesion = params.TBK_ID_SESION;

    console.log("token_ws:", token);
    console.log("TBK_TOKEN:", tbkToken);
    console.log("TBK_ORDEN_COMPRA:", tbkOrdenCompra);
    console.log("TBK_ID_SESION:", tbkIdSesion);

    let step = null;
    let stepDescription = null;
    let viewData = {
        token,
        tbkToken,
        tbkOrdenCompra,
        tbkIdSesion
    };

    if (token && !tbkToken) { //Flujo 1
        try {
            const commitResponse = await new WebpayPlus.Transaction().commit(token);
            viewData = {
                token,
                commitResponse,
            };
            step = "Confirmar Transacción";
            stepDescription = "En este paso tenemos que confirmar la transacción con el objetivo de avisar a " +
                "Transbank que hemos recibido la transacción ha sido recibida exitosamente. En caso de que " +
                "no se confirme la transacción, ésta será reversada.";

            console.log('Transaction committed:', commitResponse);

            // Redirect to frontend confirmation page with token
        } catch (error) {
            console.error('Error committing transaction:', error);
            return response.status(500).json({ error: error.message, stack: error.stack });
        }
    } else if (!token && !tbkToken) { //Flujo 2
        step = "El pago fue anulado por tiempo de espera.";
        stepDescription = "En este paso luego de anulación por tiempo de espera (+10 minutos) no es necesario realizar la confirmación ";
    } else if (!token && tbkToken) { //Flujo 3
        step = "El pago fue anulado por el usuario.";
        stepDescription = "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
    } else if (token && tbkToken) { //Flujo 4
        step = "El pago es inválido.";
        stepDescription = "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
    }

    return response.status(400).json({
        step,
        stepDescription,
        viewData,
    });
});

exports.status = asyncHandler(async function (request, response, next) {
    try {
        const { token } = request.body;

        console.log('Checking status for token:', token);

        const statusResponse = await new WebpayPlus.Transaction().status(token);

        console.log('Transaction status:', statusResponse);

        response.status(200).json({
            token,
            statusResponse,
        });
    } catch (error) {
        console.error('Error checking transaction status:', error);
        response.status(500).json({ error: error.message, stack: error.stack });
    }
});

exports.refund = asyncHandler(async function (request, response, next) {
    try {
        const { token, amount } = request.body;

        console.log('Refunding transaction with:', { token, amount });

        const refundResponse = await new WebpayPlus.Transaction().refund(token, amount);

        console.log('Transaction refunded:', refundResponse);

        response.status(200).json({
            token,
            amount,
            refundResponse,
        });
    } catch (error) {
        console.error('Error refunding transaction:', error);
        response.status(500).json({ error: error.message, stack: error.stack });
    }
});