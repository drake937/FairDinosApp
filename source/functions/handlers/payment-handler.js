const { getUserAmount, deductUserAmountCash, deductUserAmountBank } = require('../api/economy-handler');

const makePayment = async (price, userId) => {
    if (parseInt(price) === 0) return true;

    try {
        const { bank, cash } = await getUserAmount(userId); // Fetch user balance

        if (cash >= price) {
            return await deductUserAmountCash(userId, price); // Deduct from cash if sufficient
        } else if (bank >= price) {
            return await deductUserAmountBank(userId, price); // Deduct from bank if sufficient
        }

        return false; // Insufficient funds
    } catch (err) {
        console.error(`Error making payment for user ${userId}: ${err.message}`);
        return false; // On any error, fail payment
    }
};

module.exports = { makePayment };
