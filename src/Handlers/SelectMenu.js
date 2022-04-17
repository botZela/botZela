const { AsciiTable3 } = require("ascii-table3");
const { Client,Collection } = require("discord.js");

/**
 * @param {Client} client
 * @param {*} PG
 * @param {AsciiTable3} Ascii
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Selct Menu Handler");

    const selectMenuFolder = await PG(`${process.cwd()}/src/SelectMenu/**/*.js`);
    if (!selectMenuFolder.length) return;

    for (let file of selectMenuFolder) {
        const selectMenu = require(file);
        if (!selectMenu.id) {
            await Table.addRow(
                `${file.split("/").at(-1).slice(0,-3)}`,
                `⛔ Select Menu ID is missing: ${file.split("/").at(-2)}/${file.split("/").at(-1)}`
            );
            continue;
        }
        if (selectMenu.cooldown) {
            // client.buttonsCooldown.set(buttonFile.id, new Collection());
        }

        client.selectMenu.set(selectMenu.id, selectMenu);
        Table.addRow(selectMenu.id, "🔷 LOADED");
    }
    Table.sortColumn(1);
    console.log(Table.toString());
};
