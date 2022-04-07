const { createCategory } = require("../Channels/createCategory");
const { createChannel } = require("../Channels/createChannel");
const { createOverwrites } = require("./createOverwrites");


async function createDictStructure(client, guild, format, overwrites = null, category = null) {
    let name, rolesList, overwritesList, channels, channel, channelArg, type, categoryDict;
    keys = Object.keys(format);
    if (keys[0].toLowerCase() === "category") {
        categoryDict = format[keys[0]];
        try {
            let tempArray = categoryDict[0].split(",").map(e => e.trim());
            name = tempArray[0];
            rolesList = tempArray.slice(1);
            overwritesList = createOverwrites(client, guild, rolesList);
        } catch (e) {
            null;
        }
        category = await createCategory(client, guild, name, overwritesList);
        try {
            channels = Object.values(categoryDict[1])[0];
            for (channel of channels) {
                await createDictStructure(client, guild, channel, overwritesList, category);
            }
        } catch (e) {
            null;
        }
    } else if (keys[0].toLowerCase() === "channel") {
        channelArg = format[keys[0]];
        try {
            tempArray = channelArg.split(",").map(e => e.trim());
            name = tempArray[0];
            type = tempArray[1];
            rolesList = tempArray.slice(2);
            overwritesList = createOverwrites(client, guild, rolesList);
        } catch (e) {
            console.log(`[INFO] roles was not set for the channel ${name} in guild ${guild.name}`);
        }
        await createChannel(client, guild, name, type, overwritesList, category)
    }
}

module.exports = {
    createDictStructure,
}