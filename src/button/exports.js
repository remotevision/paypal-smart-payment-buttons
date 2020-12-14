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

                    // Check if button disabled (synchronous validation case)
                    // Invoke onClick and check if click rejected (asynchronous validation case)
                    if (!isEnabled()) {
                        // eslint-disable-next-line no-warning-comments
                        // TODO: we need to improve this
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


