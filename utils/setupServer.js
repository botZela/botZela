const { GSpreadSheet } = require("../GSpreadSheet/gsp");
const { createEmbed } = require("./createEmbed");
const data = require("../data/data.json");
const { saveData } = require("./saveData");

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
                    data["WORKSHEETS_URL"][`${message.guild.id}`] = sheetUrl;
                    saveData();
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