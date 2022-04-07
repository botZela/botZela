const { MessageEmbed, Message } = require("discord.js");
const { batchCreate } = require("./batchCreate");
const { batchVisualize } = require("./batchVisualize");
const { convertYaml } = require("./convertYaml");
const { createEmbed } = require("../createEmbed");

async function buildServer(client, message) {
    console.log(`[INFO] Building ${message.guild.name} Server `);
    let structure =
        `- category: 
        - categoryName,role1,role2
        - channels :
            - channel : channelName1,voice
            - channel : channelName2,text,role1
            - channel : channelName3,voice
            - channel : channelName4,stage`;
    let filter = (m) => {
        return m.author.id == message.user.id;
    };
    while (true) {
        let embed = createEmbed("Please enter your server structure.\n**Example :**", `\`\`\`${structure}\`\`\`` + "\n**Cancel**: to stop the command.");
        await message.channel.send({ embeds: [embed] });
        try {
            let collected = await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ["time"] })
            let msg;
            msg = collected.first().content;
            if (msg.toLowerCase() === "cancel") {
                console.log(`[INFO] Build Server command was canceled in server ${message.guild.name}`);
                let embed = createEmbed("Build Server command was canceled");
                await message.channel.send({ embeds: [embed] });
                break;
            }
            let channelFormat = convertYaml(msg);
            console.log('[INFO] Structure given');
            console.log('------\n' + msg + '\n------');
            if (!channelFormat) {
                console.log('[INFO] Bad structure given !!');
                let embed = createEmbed("Bad structure given !!");
                await message.channel.send({ embeds: [embed] });
                continue;
            }
            let visualization = await batchVisualize(message.guild, channelFormat);
            let embed = createEmbed(
                "Build Visualization",
                `Please confim your structure: \n\`\`\` ${visualization}\`\`\`\n ** YES / NO ** `
            );
            await message.channel.send({ embeds: [embed] });
            console.log(`[INFO] Structure of ${message.guild.name} Server \n------\n${visualization}\n------`);
            try {
                let collected = await message.channel.awaitMessages({
                    filter: filter,
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                })

                if (collected.first().content.toLowerCase() === "yes") {
                    await batchCreate(client, message.guild, channelFormat);
                    embed = createEmbed("Sructure Created Succesfully");
                    await message.channel.send({ embeds: [embed] });
                    console.log(`[INFO] ${message.guild.name} Server structure was created successfully`);
                    break;
                }
            } catch (e) {
                embed = createEmbed("Bot timed Out!!!");
                await message.channel.send({ embeds: [embed] });
                console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
                break;
            };
        } catch (e) {
            let embed = createEmbed("Bot timed Out!!!");
            await message.channel.send({ embeds: [embed] });
            console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
            return;
        };
    }
}

module.exports = {
    buildServer,
};