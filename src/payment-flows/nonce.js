/* @flow */

import { FUNDING } from '@paypal/sdk-constants/src/funding';

import { payWithNonce } from '../api';
import { getLogger, promiseNoop } from '../lib';

import type { PaymentFlow, PaymentFlowInstance } from './types';

function setupNonce() {
// pass
}

function isNonceEligible({ props, serviceData }) : boolean {
    const { paymentMethodNonce } = props;
    // eslint-disable-next-line no-console
    console.log('nonce eligibility check', paymentMethodNonce);

    const { wallet } = serviceData;

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

function isNoncePaymentEligible({ props, payment, serviceData }) : boolean {

    const { branded } = props;
    const { wallet } = serviceData;

    const { fundingSource } = payment;

    // eslint-disable-next-line no-console
    console.log('nonce payment eligibility check', branded, wallet, fundingSource);

    // eslint-disable-next-line no-warning-comments
    // TODO: check if we need to loop between instruments or if we can just pick the first instrument
    // $FlowFixMe
    const { tokenID } = wallet.card.instruments[0];

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
    const { createOrder, clientID, wallet, branded } = props;
    let { paymentMethodNonce } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: remove check when reading from wallet
    if (!paymentMethodNonce)  {
        paymentMethodNonce = wallet.card.instruments[0].tokenID;
    }

    const start = () => {
        getLogger().info('start payment with nonce', { paymentMethodNonce });
        return createOrder().then(orderID => {
            // $FlowFixMe
            getLogger().info('orderID in nonce', orderID);
            // eslint-disable-next-line no-use-before-define
            return startPaymentWithNonce(orderID, paymentMethodNonce, clientID, branded);
        });
    };

    return {
        start,
        close: promiseNoop
    };
}


function startPaymentWithNonce(orderID, paymentMethodNonce, clientID, branded) : void {
    try {
        // $FlowFixMe
        getLogger().info(orderID, paymentMethodNonce, clientID, branded);
        // $FlowFixMe
        payWithNonce({ orderID, paymentMethodNonce, clientID, branded });
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
