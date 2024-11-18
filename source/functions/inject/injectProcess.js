const { downloadFile, injectEdit, uploadFile } = require('../ftp');
const { checkBalance, makePayment } = require('../handlers/payment-handler');

const injectProcess = async (request) => {
    try {
        if (request.length < 5) throw new Error("Invalid request parameters.");

        request.shift();
        const [dinoName, dinoGender, dinoPrice, steamId, message] = request;

        if (!await checkBalance(dinoPrice, message.author.id)) {
            return message.reply(`You do not have enough points for this dino.`);
        }

        let response;

        response = await downloadFile(steamId);
        if (!responseCheck(response)) {
            return message.reply(`Error while checking the server. Please try again.`);
        }

        response = await injectEdit(dinoName, dinoGender, steamId);
        if (!responseCheck(response)) {
            return message.reply(`Error while modifying your dino. Please try again.`);
        }

        response = await uploadFile(steamId);
        if (!responseCheck(response)) {
            return message.reply(`Error connecting to the server. Please try again.`);
        }

        if (!await makePayment(dinoPrice, message.author.id)) {
            console.error(`Failed to deduct ${dinoPrice} from ${message.author.username} (${message.author.id})`);
        }

        return message.reply(`Your dino was grown successfully.`);
    } catch (error) {
        console.error("Error in injectProcess:", error);
        return message.reply(`An unexpected error occurred. Please contact support.`);
    }
}

const responseCheck = (response) => {
    if (response !== "Ok") {
        console.error("Response check failed:", response);
        return false;
    }
    return true;
}

module.exports = { injectProcess };
