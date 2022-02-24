const { MessageEmbed, Message } = require("discord.js");
const { batchCreate } = require("./batchCreate");
const { batchVisualize } = require("./batchVisualize");
const { convertYaml } = require("./convertYaml");
const { createEmbed } = require("./createEmbed");

async function buildServer(client,message){
    console.log("Building a server");
    while(true){
        let embed = createEmbed('Please enter your server structure.')
        await message.channel.send({embeds:[embed]});
        let filter = (m) => {
            return m.author.id == message.user.id;
        }
        await message.channel.awaitMessages({filter: filter,max :1,time: 3000,errors:['time']}).then(async (collected) => {
            console.log(1);
            let msg;
            msg = collected.first().content;
            console.log(msg);
            let channelFormat = convertYaml(msg);
            if(!channelFormat){
                let embed = createEmbed("Please verify your structure!!!");
                await message.channel.send({embeds:[embed]});
                return;
            }
            console.log(2);
            let visualization = await batchVisualize(message.guild,channelFormat);
            let embed = createEmbed("Build Visualization",`Please confim your structure :\n\`\`\`${visualization}\`\`\`\n **YES/NO**`)
            await message.channel.send({embeds:[embed]});
            await message.channel.awaitMessages({filter:filter,max :1,time: 3000,errors:['time']}).then(async (collected) => {
                if (collected.first().content.toLowerCase() === "yes"){
                    await batchCreate(client,message.guild,channelFormat);
                    embed = createEmbed("Sructure Created Succesfully");
                    await message.channel.send({embeds:[embed]});
                    return;
            }}).catch(async (e)=>{
                console.log(`Can't access the url Please Try again \n ${e}`);
                embed = createEmbed("Can't create this sructure");
                await message.channel.send({embeds:[embed]});
            })
        }).catch(async (e) => {
            let embed = createEmbed("Bot timed Out!!!"+e);
            await message.channel.send({embeds:[embed]});
            return;
        });
/*         let filter1 = (m) => {
            return m.author.id == message.user.id;
        }
        message.channel.send(`Are you sure to delete all data? \`YES\` / \`NO\``).then(() => {
        message.channel.awaitMessages({filter :filter1,
            max: 1,
            time: 3000,
            errors: ['time']
            })
            .then((message) => {
            message = message.first()
            console.log(message);
            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                message.channel.send(`Deleted`)
            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                message.channel.send(`Terminated`)
            } else {
                message.channel.send(`Terminated: Invalid Response`)
            }
            })
            .catch((collected) => {
                message.channel.send('Timeout');
            });
        }) */
        return;
    }
    }


module.exports = {
    buildServer,
}