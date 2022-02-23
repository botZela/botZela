const { MessageEmbed, Message } = require("discord.js");
const { batchCreate } = require("./batchCreate");
const { batchVisualize } = require("./batchVisualize");
const { convertYaml } = require("./convertYaml");

async function buildServer(client,message){
    console.log("Building a server");
    const filter = (m) => (m.author === message.author);
    while(true){
        let embed = new MessageEmbed()
            .setTitle('Please enter your server structure.')
            await message.channel.send(embed = embed);
        try{
            let msg = await message.channel.waitMessages(filter,{max :1,time: 60_000,errors:['timeOutError']});
            msg = msg.content;
            let channelFormat = convertYaml(msg);
            if(!channelFormat){
                let embed = new MessageEmbed()
                    .setTitle("Can't create this structure");
                await message.channel.send(embed = embed);
                continue;
            }
            let visualization = await batchVisualize(message.guild,channelFormat);
            let embed = new MessageEmbed()
                .setTitle("Build Visualization")
                .setDescription(`Please confim your structure :\n\`\`\`${visualization}\`\`\`\n **YES/NO**`)
            await message.channel.send(embed=embed);
            msg = await message.channel.waitMessages(filter,{max :1,time: 60_000,errors:['timeOutError']});
            if (msg.content.toLowerCase() === "yes"){
                await batchCreate(client,message.guild,channelFormat);
                embed = new MessageEmbed()
                    .setTitle("Sructure Created Succesfully");
                await message.channel.send(embed=embed);
                break;
            }
        } catch(e){
            if (e="timeOutError"){
                embed = new MessageEmbed()
                    .setTitle("Bot timed Out!!!");
                await message.channel.send(embed=embed);
            }
            else{
                console.log(`Can't access the url Please Try again \n ${e}`);
                embed = new MessageEmbed()
                    .setTitle("Can't create this sructure");
                await message.channel.send(embed = embed);
            }
            return;
        }
    }
}