/* @flow */


import { ZalgoPromise } from 'zalgo-promise/src';

import type { ButtonProps } from './props';

type ExportsProps = {|
props : ButtonProps,
    isEnabled : () => boolean
|};


export function setupExports({ props, isEnabled } : ExportsProps)  {
    const { createOrder, onApprove, onError, onCancel } = props;
    const { onClick, fundingSource } = props;
    window.exports = {
        name:           'smart-payment-buttons',
        paymentSession: () => {
            return {
                getAvailableFundingSources: () => fundingSource,
                createOrder:                () => {

                    if (!isEnabled()) {
                        throw new Error('Error occurred. Button not enabled.');
                    }

                    return ZalgoPromise.hash({
                        valid: onClick ? onClick({ fundingSource }) : true
                    }).then(({ valid }) => {
                        if (!valid) {
                            throw new Error('Error occurred during async validation');
                        } else {
                            return createOrder();
                        }
                    });


                },
                onApprove,
                onCancel,
                onError
            };
        }
    };
    
}


