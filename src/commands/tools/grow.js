const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grow')
        .setDescription('Grows your current dinosaur.')
        .addStringOption(option =>
            option.setName('safelogged')
                .setDescription('Are you safe-logged?')
                .setRequired(true)
                .addChoices({
                    name: 'Yes',
                    value: 'yes'
                })
                .addChoices({
                    name: 'No',
                    value: 'no'
                })
        )
        .addStringOption(option =>
            option.setName('steamid')
                .setDescription('Enter your Steam ID')
                .setRequired(true)
        ),

    async execute(interaction) {
        const isSafeLogged = interaction.options.getString('safelogged');
        const dinosaurName = interaction.options.getString('dinosaur');
        const steamId = interaction.options.getString('steamid');
        const user = interaction.user.username;
        var dinoClass;
        
        if(isSafeLogged == 'yes'){
            console.log("Growing..");
        }
        else if (isSafeLogged == 'no') {
            await interaction.reply({ content:`${user}, safelog before you grow your dinosaur.`, ephemeral: true}); 
        }
        


        function jsonReader(filePath, cb) {
            fs.readFile(filePath, 'utf-8', (err, fileData) => {
                if(err) {
                    return cb && cb (err);
                }
                try {
                    const object = JSON.parse(fileData);
                    return cb && cb(null, object);
                } catch (err) {
                    return cb && cb(err);
                }
            });
        }

        jsonReader('C:/temp/isle/TheIsle/Saved/Databases/Survival/Players/' + steamId + '.json', (err, data) => {

            if (err) {
                console.log(err);

            } else {
                
                console.log(data.CharacterClass);

                switch(data.CharacterClass){
                    case "DiabloJuvS":
                        data.CharacterClass = "DiabloAdultS"
                        break;            
                    case "DryoJuvS":
                        data.CharacterClass = "DryoAdultS"
                        break; 
                    case "GalliJuvS":
                        data.CharacterClass = "GalliAdultS"
                        break;
                    case "MaiaJuvS":
                        data.CharacterClass = "MaiaAdultS"     
                        break;
                    case "PachyJuvS":
                        data.CharacterClass = "PachyAdultS"
                        break;
                    case "ParaJuvS":
                        data.CharacterClass = "ParaAdultS"
                        break;
                    case "TrikeJuvS":
                        data.CharacterClass = "TrikeSubS"
                        break;
                    case "TrikeSubS":
                        data.CharacterClass = "TrikeAdultS"
                        break;
                    case "AlloJuvS":
                        data.CharacterClass = "AlloAdultS"
                        break;
                    case "CarnoJuvS":
                        data.CharacterClass = "CarnoAdultS"
                        break;
                    case "CeratoJuvS":
                        data.CharacterClass = "CeratoAdultS"
                        break;
                    case "DiloJuvS":
                        data.CharacterClass = "DiloAdultS"
                        break;
                    case "GigaJuvS":
                        data.CharacterClass = "GigaSubS"
                        break;
                    case "GigaSubS":
                        data.CharacterClass = "GigaAdultS"
                        break;
                    case "SuchoJuvS":
                        data.CharacterClass = "SuchoAdultS"
                        break;
                    case "RexJuvS":
                        data.CharacterClass = "RexSubS"
                        break;
                    case "RexSubS":
                        data.CharacterClass = "RexAdultS"
                        break;
                    case "UtahJuvS":
                        data.CharacterClass = "UtahAdultS"
                        break;
                    case "AcroJuv":
                        data.CharacterClass = "Acro"
                        break;
                    case "AlbertJuv":
                        data.CharacterClass = "Albert"
                        break;
                    case "AnkyJuv":
                        data.CharacterClass = "Anky"
                        break;
                    case "AustroJuv":
                        data.CharacterClass = "Austro"
                        break;
                    case "BaryJuv":
                        data.CharacterClass = "Bary"
                        break;
                    case "CamaraJuv":
                        data.CharacterClass = "Camara"
                        break;
                    case "HerreraJuv":
                        data.CharacterClass = "Herrera"
                        break;
                    case "ShantJuv":
                        data.CharacterClass = "Shant"
                        break;
                    case "SpinoJuv":
                        data.CharacterClass = "Spino"
                        break;
                    case "TheriJuv":
                        data.CharacterClass = "Theri"
                        break;
                    default:
                        console.log("Error with growing non-survival dino.");
                        break;                   
                }

                console.log(user);
                console.log(steamId);
                dinoClass = data.CharacterClass;
                data.Growth = '1.0';
                data.Hunger = '99999';
                data.Thirst = '99999';
                data.Stamina = '99999';
                data.Health = '99999';
                data.BleedingRate = '0'; 
                data.Oxygen = '99999';
                const oldYPos = data.Location_Isle_V3;
                console.log(oldYPos);
                fs.writeFile('C:/temp/isle/TheIsle/Saved/Databases/Survival/Players/' + steamId + '.json', JSON.stringify(data, null, 2), err => {
                    if (err){
                        console.log(err);
                    } 
                });
            }
        });
        
        await interaction.reply({ content: `${user} your dinosaur has been grown.`, ephemeral: true});
        console.log(dinoClass);
    }
};
