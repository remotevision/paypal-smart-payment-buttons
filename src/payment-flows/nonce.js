/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import { payWithNonce } from '../api';

import type { PaymentFlow, PaymentFlowInstance } from './types';

function setupNonce() {
// pass
}

function isNonceEligible({ props }) : boolean {
    const { fundingPaymentNonce } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: check if this throws error if no fundingpaymentnonce is passed.
    if (!fundingPaymentNonce) {
        return false;
    }

    return true;
}

function isNoncePaymentEligible({ props }) : boolean {
    const { fundingPaymentNonce } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: check if this throws error if no fundingpaymentnonce is passed.
    if (!fundingPaymentNonce || !(fundingPaymentNonce.length > 0)) {
        return false;
    }

    return true;
}

function initNonce({ props }) : PaymentFlowInstance {
    const { createOrder, fundingPaymentNonce, clientID } = props;

    const start = () => {
        return createOrder().then(orderID => {
            // eslint-disable-next-line no-use-before-define
            return startPaymentWithNonce(orderID, fundingPaymentNonce, clientID);
        });
    };

    return {
        start,
        close: () => ZalgoPromise.resolve()
    };

}

// eslint-disable-next-line flowtype/no-primitive-constructor-types
function startPaymentWithNonce(orderID, fundingPaymentNonce, clientID) : String {

    return payWithNonce({ token: orderID, nonce: fundingPaymentNonce, clientID });
}

export const nonce : PaymentFlow = {
    name:              'nonce',
    setup:             setupNonce,
    isEligible:        isNonceEligible,
    isPaymentEligible: isNoncePaymentEligible,
    init:              initNonce,
    inline:            true
};
