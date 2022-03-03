const { MessageEmbed, Message } = require("discord.js");
const { batchCreate } = require("./batchCreate");
const { batchVisualize } = require("./batchVisualize");
const { convertYaml } = require("./convertYaml");
const { createEmbed } = require("./createEmbed");

async function buildServer(client, message) {
    console.log("[INFO] Building A Server");
    let filter = (m) => {
        return m.author.id == message.user.id;
    };
    while (true) {
        let embed = createEmbed("Please enter your server structure.");
        await message.channel.send({ embeds: [embed] });
        try {
            let collected = await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ["time"] })
            let msg;
            msg = collected.first().content;
            let channelFormat = convertYaml(msg);
            console.log('[INFO] Structure given');
            console.log(channelFormat);
            if (!channelFormat) {
                let embed = createEmbed("Please verify your structure !!!");
                await message.channel.send({ embeds: [embed] });
                continue;
            }
            let visualization = await batchVisualize(message.guild, channelFormat);
            let embed = createEmbed(
                "Build Visualization",
                `Please confim your structure :\n\`\`\`${visualization}\`\`\`\n **YES/NO**`
            );
            await message.channel.send({ embeds: [embed] });
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
                    break;
                }
            } catch (e) {
                embed = createEmbed("Bot timed Out!!!");
                await message.channel.send({ embeds: [embed] });
                break;
            };
        } catch (e) {
            let embed = createEmbed("Bot timed Out!!!");
            await message.channel.send({ embeds: [embed] });
            return;
        };
    }
}

module.exports = {
    buildServer,
};