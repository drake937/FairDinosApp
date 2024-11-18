const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inject')
        .setDescription('Injects the specified dinosaur')
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
            option.setName('dinosaur')
                .setDescription('Your dinosuar will be replaced with: ')
                .setRequired(true)
                .addChoices({
                    name: 'Acrocanthosaurus',
                    value: 'Acro'
                })
                .addChoices({
                    name: 'Albertosaurus',
                    value: 'Albert'
                })
                .addChoices({
                    name: 'Ankylosaurus',
                    value: 'Anky'
                })
                .addChoices({
                    name: 'Austroraptor',
                    value: 'Austro'
                })
                .addChoices({
                    name: 'Avaceratops',
                    value: 'Ava'
                })
                .addChoices({
                    name: 'Baryonyx',
                    value: 'Bary'
                })
                .addChoices({
                    name: 'Camarasaurus',
                    value: 'Camara'
                })
                .addChoices({
                    name: 'Herrerasaurus',
                    value: 'Herrera'
                })
                .addChoices({
                    name: 'Orodromeus',
                    value: 'Oro'
                })
                .addChoices({
                    name: 'Psittacosaurus',
                    value: 'Taco'
                })
                .addChoices({
                    name: 'Shantungosaurus',
                    value: 'Shant'
                })
                .addChoices({
                    name: 'Spinosaurus',
                    value: 'Spino'
                })
                .addChoices({
                    name: 'Therizinosaurus',
                    value: 'Theri'
                })
                .addChoices({
                    name: 'Velociraptor',
                    value: 'Velo'
                })
        )
        .addStringOption(option =>
            option.setName('gender')
                .setDescription('Preferred gender male/female.')
                .setRequired(true)
                .addChoices({
                    name: 'Male',
                    value: 'Male'
                })
                .addChoices({
                    name: 'Female',
                    value: 'Female'
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
        const gender = interaction.options.getString('gender');
        const user = interaction.user.username;

        if(isSafeLogged == 'yes'){
            console.log("Injecting..");
        }
        else if (isSafeLogged == 'no') {
            await interaction.reply({content:`${user}, safelog before you inject as a ${dinosaurName}.`, ephemeral:true}); 
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
                if (gender == 'male')
                    data.bGender = false;
                else 
                    data.bGender = true;            
                console.log(dinosaurName);
                console.log(steamId);
                data.CharacterClass = dinosaurName;
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
        
        await interaction.reply({ content: `${user}, you injected as a ${gender} ${dinosaurName}.`, ephemeral: true});
        console.log(dinosaurName);
    }
};
