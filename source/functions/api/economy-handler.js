const { User } = require('../../models/user'); // SQLite User model

// Get User Balances
async function getUserAmount(discordId) {
    try {
        const user = await User.findOne({ where: { discordId } });
        if (!user) throw new Error('User not found.');
        return { cash: user.cash, bank: user.bank };
    } catch (err) {
        console.error(`Error fetching user balance for Discord ID ${discordId}: ${err.message}`);
        return { cash: 0, bank: 0 };  // Return default 0 if there's an error
    }
}

// Deduct from Cash
async function deductUserAmountCash(discordId, amount) {
    try {
        const user = await User.findOne({ where: { discordId } });
        if (!user) return { success: false, message: 'User not found.' };
        if (user.cash < amount) return { success: false, message: 'Insufficient cash balance.' };

        user.cash -= amount;
        await user.save();
        return { success: true, message: `${amount} deducted from cash.` };
    } catch (err) {
        console.error(`Error deducting cash for Discord ID ${discordId}: ${err.message}`);
        return { success: false, message: 'Error deducting cash.' };
    }
}

// Deduct from Bank
async function deductUserAmountBank(discordId, amount) {
    try {
        const user = await User.findOne({ where: { discordId } });
        if (!user) return { success: false, message: 'User not found.' };
        if (user.bank < amount) return { success: false, message: 'Insufficient bank balance.' };

        user.bank -= amount;
        await user.save();
        return { success: true, message: `${amount} deducted from bank.` };
    } catch (err) {
        console.error(`Error deducting bank balance for Discord ID ${discordId}: ${err.message}`);
        return { success: false, message: 'Error deducting bank balance.' };
    }
}

// Add to Bank
async function addUserAmountBank(discordId, amount) {
    try {
        const user = await User.findOne({ where: { discordId } });
        if (!user) return { success: false, message: 'User not found.' };

        user.bank += amount;
        await user.save();
        return { success: true, message: `${amount} added to bank.` };
    } catch (err) {
        console.error(`Error adding bank balance for Discord ID ${discordId}: ${err.message}`);
        return { success: false, message: 'Error adding bank balance.' };
    }
}

module.exports = {
    getUserAmount,
    deductUserAmountCash,
    deductUserAmountBank,
    addUserAmountBank
};
