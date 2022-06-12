const { GSpreadSheet } = require("../../otherModules/GSpreadSheet/gsp");
const { createEmbed } = require("../createEmbed");
const linksModel = require("../../Models/guildLinks");

async function setupServer(client, message) {
    console.log(`[INFO] Setup for guild ${message.guild.name}`);
    let gspBotMail = "rolebot@woven-justice-335518.iam.gserviceaccount.com";

    function filter(m) {
        return m.author.id == message.user.id;
    }
    let msg = "";
    while (msg != "done") {
        let embed = createEmbed(
            "Setup Server",
            `**Please Share your SpreadSheet with this account :**\n\n**__${gspBotMail}__**\n\nSend **\"done\"** if fished.\nSend **\"cancel\"** to stop command.`
        );
        await message.channel.send({ embeds: [embed] });
        try {
            let collected = await message.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: 60000,
                errors: ["time"],
            });
            msg = collected.first().content.toLowerCase();
            if (msg.toLowerCase() === "cancel") {
                console.log(`[INFO] Setup Server command was canceled in server ${message.guild.name}`);
                let embed = createEmbed("Setup Server command was canceled");
                await message.channel.send({ embeds: [embed] });
                return;
            }
        } catch (e) {
            let embed = createEmbed("Bot timed Out !!");
            console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
            await message.channel.send({ embeds: [embed] });
            return;
        }
    }
    while (true) {
        let embed = createEmbed("Setup Server", "**Please enter your sheet link**\n\nSend **\"cancel\"** to stop command.");
        await message.channel.send({ embeds: [embed] });
        try {
            let collected = await message.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: 60000,
                errors: ["time"],
            });
            let sheetUrl = collected.first().content;
            if (sheetUrl.toLowerCase() === "cancel") {
                console.log(`[INFO] Setup Server command was canceled in server ${message.guild.name}`);
                let embed = createEmbed("Setup Server command was canceled");
                await message.channel.send({ embeds: [embed] });
                return;
            }
            console.log(`[INFO] SpreadSheet URL of guild ${message.guild.name}.\n${sheetUrl}`);
            let testSheet = GSpreadSheet.createFromUrl(
                sheetUrl,
                "./credentials/google_account.json",
                0
            );
            try {
                if ((await testSheet).check()) {
                    const wsData = await linksModel.findOne({guildId: message.guild.id});
                    if (wsData){
                        wsData.url = sheetUrl;
                        await wsData.save();
                    } else {
                        await linksModel.create({
                            guildId: message.guild.id,
                            guildName: message.guild.name,
                            url: sheetUrl,
                        });
                    }
                    let embed = createEmbed(
                        "Setup Server",
                        `${client.user.tag} has connected successfully to the SpreadSheet`
                    );
                    await message.channel.send({ embeds: [embed] });
                    console.log(`[INFO] ${client.user.tag} has connected successfully to the SpreadSheet of guild ${message.guild.name}.`);
                    break;
                }
            } catch (e) {
                let embed = createEmbed("Setup Server", "**Can't access the url**");
                await message.channel.send({ embeds: [embed] });
                console.log(`[INFO] Can't access the url of guild ${message.guild.name}.`);
            }
        } catch (e) {
            let embed = createEmbed("Bot timed Out !!!");
            console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
            await message.channel.send({ embeds: [embed] });
            break;
        }
    }
}

module.exports = {
    setupServer,
};