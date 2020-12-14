/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { FUNDING } from '@paypal/sdk-constants/src/funding';

import { payWithNonce } from '../api';

import type { PaymentFlow, PaymentFlowInstance } from './types';

function setupNonce() {
// pass
}

function isNonceEligible({ props }) : boolean {
    // eslint-disable-next-line no-console
    console.log('props', props);

    // eslint-disable-next-line no-warning-comments
    /* TODO??:  dont think this should come from args. this needs to read from wallet
    * TODO??: need to make sure branded and token ID are set by smartWallet
    * TODO: this can use optional chaining
    * TODO: check wallet has a nonce we can charge. Is this the way to check this?
     */

    const { wallet } = props;
    // eslint-disable-next-line no-console
    console.log(wallet);
    //
    // if (wallet.card.instruments.length === 0) {
    //     return false;
    // }
    //
    // if (!wallet) {
    //     return false;
    // }

    // eslint-disable-next-line no-warning-comments
    // TODO: check if this throws error if no fundingSourceNonce is passed and remove after smartwallet SPB updates.
    return true;


}


function isNoncePaymentEligible({ props, payment }) : boolean {
    // eslint-disable-next-line no-console
    console.log('payment props', payment, props);
    //
    // const { wallet } = props;
    // const { fundingSource } = payment;
    //
    //
    // // eslint-disable-next-line no-warning-comments
    // // TODO: check if we need to loop between instruments or if we can just pick the first instrument
    // // const { tokenID, branded } = wallet.card.instruments[0];
    // // if (fundingSource !== FUNDING.CARD) {
    // //     return false;
    // // }
    // // if (!branded) {
    // //     return false;
    // // }
    // //
    // // if (!tokenID) {
    // //     return false;
    // // }


    return true;
}

function initNonce({ props }) : PaymentFlowInstance {
    const { createOrder, fundingPaymentNonce, clientID } = props;

    // eslint-disable-next-line no-warning-comments
    // TODO: uncomment this after smartwallet SPB updates and use optional chaining.
    // const fundingSourceNonce = wallet.card.instruments[i].tokenID

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


function startPaymentWithNonce(orderID, nonce, clientID) : void {
    try {
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
