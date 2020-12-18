/* @flow */

import { FUNDING } from '@paypal/sdk-constants/src/funding';

import { payWithNonce } from '../api';
import { promiseNoop } from '../lib';

import type { PaymentFlow, PaymentFlowInstance } from './types';

function setupNonce() {
// pass
}

function isNonceEligible({ props }) : boolean {

    /*
    * TODO: this can use optional chaining
    * TODO: not sure if wallet comes from props or payment?. wallet comes from props
     */

    const { wallet } = props;
    // eslint-disable-next-line no-console
    console.log('wallet', wallet);


    if (!wallet) {

        return false;
    }

    if (wallet.card.instruments.length === 0 || !wallet.card.instruments[0].tokenID) {
        return false;
    }

    return true;


}


function isNoncePaymentEligible({ props, payment }) : boolean {
    // eslint-disable-next-line no-console
    console.log('payment props', payment, props);

    const { wallet } = props;
    const { fundingSource } = payment;

    // eslint-disable-next-line no-warning-comments
    // TODO: check if we need to loop between instruments or if we can just pick the first instrument
    const { tokenID, branded } = wallet.card.instruments[0];
    if (fundingSource !== FUNDING.CARD) {
        return false;
    }
    if (!branded) {
        return false;
    }

    if (!tokenID) {
        return false;
    }


    return true;
}

function initNonce({ props }) : PaymentFlowInstance {
    const { createOrder, clientID, wallet } = props;
    let { paymentMethodNonce } = props;

    // eslint-disable-next-line no-console
    console.log({ paymentMethodNonce });

    // eslint-disable-next-line no-warning-comments
    // TODO: remove check when reading from wallet
    if (!paymentMethodNonce)  {
        paymentMethodNonce = wallet.card.instruments[0].tokenID;
    }

    const start = () => {
        // eslint-disable-next-line no-console
        console.log('start payment with nonce');
        return createOrder().then(orderID => {
            // eslint-disable-next-line no-console
            console.log('orderID in nonce', orderID);
            // eslint-disable-next-line no-use-before-define
            return startPaymentWithNonce(orderID, paymentMethodNonce, clientID);
        });
    };

    return {
        start,
        close: promiseNoop
    };

}


function startPaymentWithNonce(orderID, nonce, clientID) : void {
    try {
        // eslint-disable-next-line no-console
        console.log(orderID, nonce, clientID);
        payWithNonce({ orderID, nonce, clientID });
    } catch (error) {
        // eslint-disable-next-line no-warning-comments
        // TODO: test this. SPB should call merchant's onError. move to constant
        error.code = 'PAY_WITH_DIFFERENT_CARD';
        throw error;
    }
}

export const nonce : PaymentFlow = {
    name:              'nonce',
    setup:             setupNonce,
    isEligible:        isNonceEligible,
    isPaymentEligible: isNoncePaymentEligible,
    init:              initNonce,
    inline:            true
};
