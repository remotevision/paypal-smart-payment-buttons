/* @flow */

import type {PaymentFlow, PaymentFlowInstance} from './types';
import { payWithNonce } from '../api';
import {ZalgoPromise} from "zalgo-promise/src";

function setupNonce() {
//pass
}

function isNonceEligible({ props }) : boolean {
    const {fundingPaymentNonce} = props;

    //TODO: check if this throws error if no fundingpaymentnonce is passed.
    if (!fundingPaymentNonce) {
        return false;
    }

    return true;
}

function isNoncePaymentEligible({ props }) : boolean {
    const {fundingPaymentNonce} = props;

    //TODO: check if this throws error if no fundingpaymentnonce is passed.
    if(!fundingPaymentNonce || !(fundingPaymentNonce.length > 0)) {
        return false;
    }

    return true;
}

function initNonce({props, components, payment, serviceData, config}) : PaymentFlowInstance {
    console.log('props at HONEY', props);
    console.log('payment at HONEY', payment);

    const {createOrder, fundingPaymentNonce, clientID } = props;

    const start = () => {
        return createOrder().then( orderID => {
            return startPaymentWithNonce(orderID,fundingPaymentNonce, clientID );
        })
    }

    return {
        start,
        close: () => ZalgoPromise.resolve()
    }

}

function startPaymentWithNonce(orderID, fundingPaymentNonce, clientID) : String {

    const result = payWithNonce({ token: orderID, nonce: fundingPaymentNonce, clientID });
    console.log('result from startPaymentWithnonce', result);
    return result;
}

export const nonce : PaymentFlow = {
    name:              'nonce',
    setup:             setupNonce,
    isEligible:        isNonceEligible,
    isPaymentEligible: isNoncePaymentEligible,
    init:              initNonce,
    inline:            true
};
