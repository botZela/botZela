const { WebhookClient } = require("discord.js");
const { GSpreadSheet } = require("../GSpreadSheet/gsp");
const { createEmbed } = require("./createEmbed");
const data = require("../data/data.json");
const { saveData } = require("./saveData");

async function setupServer(client, message) {
    let gspBotMail = "rolebot@woven-justice-335518.iam.gserviceaccount.com";

    function filter(m) {
        return m.author.id == message.user.id;
    }
    let msg = "";
    while (msg != "done") {
        let embed = createEmbed(
            "Setup Server",
            `Please Share your SpreadSheet with this account :\n\n__${gspBotMail}__\n\nNOTE: Please send __\"done\"__ if fished.`
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
        } catch (e) {
            let embed = createEmbed("Bot timed Out !!!");
            await message.channel.send({ embeds: [embed] });
            return;
        }
    }
    let embed = createEmbed("Setup Server", "Please enter your sheet link");
    await message.channel.send({ embeds: [embed] });
    while (true) {
        try {
            let collected = await message.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: 60000,
                errors: ["time"],
            });
            let sheetUrl = collected.first().content;
            let testSheet = GSpreadSheet.createFromUrl(
                sheetUrl,
                "./credentials/google_account.json",
                0
            );
            try {
                if ((await testSheet).check()) {
                    data["WORKSHEETS_URL"][`${message.guild.id}`] = sheetUrl;
                    saveData();
                    let embed = createEmbed(
                        "Setup Server",
                        `${client.user.tag} has connected successfully to the SpreadSheet`
                    );
                    await message.channel.send({ embeds: [embed] });
                    break;
                }
            } catch (e) {
                console.log("Can't access the url Please Try again" + e);
                let embed = createEmbed("Setup Server", "Can't access the url");
                await message.channel.send({ embeds: [embed] });
            }
        } catch (e) {
            let embed = createEmbed("Bot timed Out !!!");
            await message.channel.send({ embeds: [embed] });
            break;
        }
        /* await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] }).then(async(collected) => {
                let sheetUrl = collected.first().content;
                let testSheet = GSpreadSheet.createFromUrl(sheetUrl, '../credentials/google_account.json', 0);
                try {
                    if ((await testSheet).check()) {
                        data["WORKSHEETS_URL"][`${message.guild.id}`] = sheetUrl;
                        saveData();
                        let embed = createEmbed("Setup Server", `${client.tag} has connected successfully to the SpreadSheet`);
                        await message.channel.send({ embed: [embed] });
                        break;
                    }
                } catch (e) {
                    console.log("Can't access the url Please Try again" + e);
                    let embed = createEmbed("Setup Server", "Can't access the url");
                    await message.channel.send({ embed: [embed] });
                }
            }).catch(async(e) => {
                let embed = createEmbed("Bot timed Out!!!" + e);
                await message.channel.send({ embeds: [embed] });
                break;
            }); */
    }
}

module.exports = {
    setupServer,
};