/* @flow */

module.exports = {
    'extends': require.resolve('grumbler-scripts/config/.eslintrc-browser'),

    'rules': {
        'react/display-name': 'off',
        'prefer-regex-literals': 'off',
        'require-atomic-updates': 'off',
        'react/require-default-props': 'off',
        'max-lines': [ 'error', 600 ],
    },

    'globals': {
        '__SMART_BUTTONS__': true,
        'paypal': true
    }
};