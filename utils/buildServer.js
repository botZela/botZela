const { MessageEmbed, Message } = require("discord.js");
const { batchCreate } = require("./batchCreate");
const { batchVisualize } = require("./batchVisualize");
const { convertYaml } = require("./convertYaml");
const { createEmbed } = require("./createEmbed");

async function buildServer(client,message){
    console.log("Building a server");
    const filter = (m) => (m.author === message.author);
    while(true){
        let embed = createEmbed('Please enter your server structure.')
            await message.channel.send({embeds:[embed]});
            let msg;
            await message.channel.awaitMessages({filter: filter,max :1,time: 3000,errors:['time']}).then(async collected => {
                msg = collected.content;
                console.log(msg);
                let channelFormat = convertYaml(msg);
                if(!channelFormat){
                    let embed = createEmbed("Can't create this structure");
                    await message.channel.send({embeds:[embed]});
                    //continue;
                }
                let visualization = await batchVisualize(message.guild,channelFormat);
                let embed = createEmbed("Build Visualization",`Please confim your structure :\n\`\`\`${visualization}\`\`\`\n **YES/NO**`)
                await message.channel.send({embeds:[embed]});
                msg = await message.channel.awaitMessages({filter:filter,max :1,time: 3000,errors:['time']}).then(async collected => {
                    if (msg.content.toLowerCase() === "yes"){
                        await batchCreate(client,message.guild,channelFormat);
                        embed = createEmbed("Sructure Created Succesfully");
                        await message.channel.send({embeds:[embed]});
                        //break;
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
            return;
        }
    }


module.exports = {
    buildServer,
}