const { WebpayPlus } = require('transbank-sdk');
const asyncHandler = require('../utils/async_handler');

exports.create = asyncHandler(async function (request, response, next) {
    try {
        const buyOrder = 'O-' + Math.floor(Math.random() * 10000) + 1;
        const sessionId = 'S-' + Math.floor(Math.random() * 10000) + 1;
        const amount = request.body.amount;
        const returnUrl = request.protocol + "://" + request.get("host") + "/payment-confirmation";

        console.log('Initiating transaction with:', { buyOrder, sessionId, amount, returnUrl });

        const createResponse = await new WebpayPlus.Transaction().create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );

        const { token, url } = createResponse;

        console.log('Transaction created:', { token, url });

        response.status(200).json({
            token,
            url,
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
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
            return response.redirect(`/payment-confirmation?token_ws=${token}`);
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