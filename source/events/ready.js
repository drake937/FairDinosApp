const chalk = require("chalk")
const config = require("../cfg/config.json")
module.exports = (client) => {
    console.log(chalk.magenta(`Bot Made by EnderSven \nPrefix is ${config.prefix}`));
}
