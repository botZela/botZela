const { GSpreadSheet } = require("../../otherModules/GSpreadSheet/gsp");
const { createEmbed } = require("../createEmbed");
const linksModel = require("../../Models/guildLinks");

async function checkSpreadsheet(client, message, link) {
    const { guild } = message;
    
    try {
        let testSheet = await GSpreadSheet.createFromUrl(
            link,
            "./credentials/google_account.json",
            0
        );
        if (testSheet.check()) {
            const wsData = await linksModel.findOne({guildId: guild.id});
            if (wsData){
                wsData.spreadsheet = link;
                await wsData.save();
            } else {
                await linksModel.create({
                    guildId: guild.id,
                    guildName: guild.name,
                    spreadsheet: link,
                });
            }
            let embed = createEmbed(
                "Setup Spreadsheet's link",
                `${client.user.tag} has connected successfully to the SpreadSheet`
            );
            await message.channel.send({ embeds: [embed] });
            console.log(`[INFO] ${client.user.tag} has connected successfully to the SpreadSheet of guild ${guild.name}.\n${link}`);
            return;
        } else {
            let embed = createEmbed(
                "Setup Spreadsheet's link",
                `${client.user.tag} has connected successfully to the SpreadSheet, but spreadsheet's columns do not match with ours:\n["Timestamp", "First Name", "Last Name", "Email", "Phone Number", "Discord Username", "ID Discord"]`
            );
            await message.channel.send({ embeds: [embed] });
            return;
        }
    } catch (e) {
        console.log(`[INFO] Can't access the url of guild ${guild.name}.`);
        let gspBotMail = "rolebot@woven-justice-335518.iam.gserviceaccount.com";
        let embed1 = createEmbed("Setup Spreadsheet's link", "**Can't access the url**");
        let embed2 = createEmbed(
            "Setup Spreadsheet's link",
            `**After Sharing your SpreadSheet with this account :\n\n__${gspBotMail}__**\n\nReuse the command.\`/setup link spreadsheet <spreadsheet_link>\``,
        );
        await message.channel.send({ embeds: [embed1, embed2] });
    }

}

module.exports = {
    checkSpreadsheet,
};