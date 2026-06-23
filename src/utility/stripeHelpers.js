export const isPayoutReady = (user = {}) => {
    if (user.stripeChargesEnabled === true && user.stripeDetailsSubmitted === true) {
        return true;
    }
    if (user.stripeChargesEnabled === false || user.stripeDetailsSubmitted === false) {
        return false;
    }
    return Boolean(user.stripeAccountId);
};

export const getPayoutStatusLabel = (user = {}) => (
    isPayoutReady(user) ? 'Payouts enabled' : 'Complete Stripe setup to request payouts'
);
