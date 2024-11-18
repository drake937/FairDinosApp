const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const config = require('../cfg/config.json');

// FTP connection details from the config
const serverIp = config.serverInfo.server;
const ftpLocation = config.serverInfo.ftpLocation; // The path relative to the FTP root
const ftpPort = config.serverInfo.port;
const ftpUsername = config.serverInfo.username;
const ftpPassword = config.serverInfo.password;

const ftpClient = new ftp.Client();

// Establish the FTP connection (only if it's not already open)
const serverConnection = async () => {
    if (!ftpClient.closed) return true;

    try {
        ftpClient.ftp.ipFamily = 4;
        await ftpClient.access({
            host: serverIp,
            port: ftpPort,
            user: ftpUsername,
            password: ftpPassword
        });
        return true;
    } catch (err) {
        console.error(`Error connecting to the FTP server: ${err}`);
        return false;
    }
}

// Delete local file after processing
const deleteLocalFile = async (fileId) => {
    console.log("Deleting local files . . .");
    fs.unlink(`./${fileId}.json`, (err) => {
        if (err) console.error(`Error deleting local file: ${err}`);
    });
}

// Download the dino file (specific Steam ID)
const downloadFile = async (steamId) => {
    console.log(`Downloading file for Steam ID ${steamId}...`);
    try {
        if (!await serverConnection()) return "Failed to connect to the server.";
        
        // Correct path based on FTP server structure
        const remotePath = path.join(ftpLocation, `${steamId}.json`);
        await ftpClient.downloadTo(`${steamId}.json`, remotePath);

        ftpClient.close();
        return "Ok"; // Successfully downloaded
    } catch (err) {
        console.error(`Error while downloading file: ${err.stack}`);
        ftpClient.close();
        return "Something went wrong while downloading the file. Please try again.";
    }
}

// Grow edit operation (increase growth stats in the file)
const growEdit = async (dinoName, steamId) => {
    console.log(`Editing file to grow Dino...`);
    try {
        var data = fs.readFileSync(`${steamId}.json`, 'utf-8');
        var contents = JSON.parse(data);
        var height;

        // Validate if the current dino matches the requested one
        if (!contents.CharacterClass.toString().toLowerCase().includes(dinoName.toLowerCase())) {
            deleteLocalFile(steamId);
            return `Unable to grow ${dinoName} as your current dino is not this species.`;
        }

        // Check if the dino is already fully grown
        if (contents.CharacterClass.toString().toLowerCase().includes("adults") && parseFloat(contents.Growth) === 1) {
            deleteLocalFile(steamId);
            return "Dino is already fully grown.";
        }

        // Set height for growth
        height = dinoName.toLowerCase() === "spino" ? 200 : 100;
        contents.CharacterClass = dinoName;
        contents.Growth = "1.0";
        contents.Hunger = "9999";
        contents.Thirst = "9999";
        contents.Stamina = "9999";
        contents.Health = "15000";

        // Adjust location for growth
        var locationParts = contents.Location_Isle_V3.split("Z=", 2);
        locationParts[1] = parseFloat(locationParts[1]);
        locationParts[1] += height;
        locationParts[0] += "Z=";
        locationParts[1] = locationParts[1].toString();

        // Update location
        contents.Location_Isle_V3 = locationParts.join("");

        // Save the changes to the file
        fs.writeFileSync(`${steamId}.json`, JSON.stringify(contents, null, 4));
        return "Ok"; // Successfully edited
    } catch (err) {
        console.error(`Error editing file: ${err.stack}`);
        return "Something went wrong while growing your dino. Please try again.";
    }
}

// Inject edit operation (set the character to specific dino, with gender and stats)
const injectEdit = async (dinoName, dinoGender, steamId) => {
    console.log(`Injecting dino info...`);
    try {
        var data = fs.readFileSync(`${steamId}.json`, 'utf-8');
        var contents = JSON.parse(data);
        var height;

        // Set gender and character class
        contents.bGender = dinoGender.toLowerCase().startsWith("m") ? false : true;
        contents.CharacterClass = dinoName;
        contents.Growth = "1.0";
        contents.Hunger = "9999";
        contents.Thirst = "9999";
        contents.Stamina = "9999";
        contents.Health = "15000";

        // Adjust location for dino
        height = dinoName.toLowerCase() === "spino" ? 200 : 100;
        var locationParts = contents.Location_Isle_V3.split("Z=", 2);
        locationParts[1] = parseFloat(locationParts[1]);
        locationParts[1] += height;
        locationParts[0] += "Z=";
        locationParts[1] = locationParts[1].toString();
        contents.Location_Isle_V3 = locationParts.join("");

        // Save the edited file
        fs.writeFileSync(`${steamId}.json`, JSON.stringify(contents, null, 4));
        return "Ok"; // Successfully injected
    } catch (err) {
        console.error(`Error injecting dino data: ${err.stack}`);
        return "Something went wrong while injecting your dino. Please try again.";
    }
}

// Upload the edited file back to the FTP server
const uploadFile = async (steamId) => {
    console.log(`Uploading file for Steam ID ${steamId}...`);
    try {
        if (!await serverConnection()) return "Failed to connect to the server.";
        
        const localPath = path.join(__dirname, `${steamId}.json`);
        const remotePath = path.join(ftpLocation, `${steamId}.json`);
        const status = await ftpClient.uploadFrom(localPath, remotePath);

        let retryCount = 0;
        while (status.code !== 226 && retryCount < 2) {
            retryCount++;
            status = await ftpClient.uploadFrom(localPath, remotePath);
        }

        if (status.code !== 226) {
            console.log(`Upload failed with status code: ${status.code}`);
            deleteLocalFile(steamId);
            ftpClient.close();
            return "Failed to upload the file. Try again later.";
        }

        deleteLocalFile(steamId); // Clean up local file after upload
        ftpClient.close();
        return "File upload successful!";
    } catch (err) {
        console.error(`Error uploading file: ${err.stack}`);
        ftpClient.close();
        return "Something went wrong while uploading the file. Please try again.";
    }
}

// Export functions
module.exports = { downloadFile, growEdit, injectEdit, uploadFile };
