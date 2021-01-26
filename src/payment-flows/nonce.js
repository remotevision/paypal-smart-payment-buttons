/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { payWithNonce } from '../api';

import type { PaymentFlow, PaymentFlowInstance } from './types';

function setupNonce() {
// pass
}

function isNonceEligible({ props }) : boolean {
    const { paymentMethodNonce } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: check if this throws error if no paymentMethodNonce is passed.
    if (!paymentMethodNonce) {
        return false;
    }

    return true;
}

function isNoncePaymentEligible({ props }) : boolean {
    const { paymentMethodNonce } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: check if this throws error if no paymentMethodNonce is passed.
    if (!paymentMethodNonce || !(paymentMethodNonce.length > 0)) {
        return false;
    }

    return true;
}

function initNonce({ props }) : PaymentFlowInstance {
    const { createOrder, paymentMethodNonce, clientID } = props;

    const start = () => {
        return createOrder().then(orderID => {
            // eslint-disable-next-line no-use-before-define
            return startPaymentWithNonce(orderID, paymentMethodNonce, clientID);
        });
    };

    return {
        start,
        close: () => ZalgoPromise.resolve()
    };

}

// eslint-disable-next-line flowtype/no-primitive-constructor-types
function startPaymentWithNonce(orderID, paymentMethodNonce, clientID) : String {

    return payWithNonce({ token: orderID, nonce: paymentMethodNonce, clientID });
}

export const nonce : PaymentFlow = {
    name:              'nonce',
    setup:             setupNonce,
    isEligible:        isNonceEligible,
    isPaymentEligible: isNoncePaymentEligible,
    init:              initNonce,
    inline:            true
};
