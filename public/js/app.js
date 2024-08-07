'use strict';

// saveOrders = require("../../controllers/usersController")

window.paypal
    .Buttons({
        style: {
            shape: "pill",
            layout: "vertical",
            color: "gold",
            label: "paypal",
        },
        message: {
            amount: 1,
        },
        async createOrder() {
            try {
                const res = await fetch("/api/getCart", {
                    method: "GET"
                });

                const userCart = await res.json();
                // console.log(userCart);

                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // use the "body" param to optionally pass additional order information
                    // like product ids and quantities
                    body: JSON.stringify({
                        cart: userCart.cart
                    }),
                });

                const orderData = await response.json();

                if (orderData.id) {
                    return orderData.id;
                }
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            } catch (error) {
                console.error(error);
                // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
            }
        },
        async onApprove(data, actions) {
            // const response = await fetch('/users/saveOrders', {
            //     method: "POST",
            // });

            return actions.order.capture().then((details) => {
                alert("Transaction completed by " + details.payer.name.given_name)

                // window.location.href = "/users/saveOrders";
                // Get the form
                const form = document.getElementById('orderForm');

                const paypalCheckbox = document.getElementById('Paypal-1');
                if (paypalCheckbox) {
                    paypalCheckbox.checked = true;
                }

                // Submit the form
                form.submit();
            })
            try {
                const response = await fetch(`/api/orders/${data.orderID}/capture`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const orderData = await response.json();
                // Three cases to handle:
                //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                //   (2) Other non-recoverable errors -> Show a failure message
                //   (3) Successful transaction -> Show confirmation or thank you message

                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                    // recoverable state, per
                    // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                    return actions.restart();
                } else if (errorDetail) {
                    // (2) Other non-recoverable errors -> Show a failure message
                    throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                } else if (!orderData.purchase_units) {
                    throw new Error(JSON.stringify(orderData));
                } else {
                    // (3) Successful transaction -> Show confirmation or thank you message
                    // Or go to another URL:  actions.redirect('thank_you.html');
                    console.log("Payment successfully");
                    const transaction =
                        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                    resultMessage(
                        `Transaction ${transaction.status}: ${transaction.id}<br>
          <br>See console for all available details`
                    );
                    console.log(
                        "Capture result",
                        orderData,
                        JSON.stringify(orderData, null, 2)
                    );
                }
            } catch (error) {
                console.error(error);
                resultMessage(
                    `Sorry, your transaction could not be processed...<br><br>${error}`
                );
            }
        },
    })
    .render("#paypal-button-container");