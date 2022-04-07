const { AsciiTable3 } = require("ascii-table3");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 * @param {*} PG
 * @param {AsciiTable3} Ascii
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Buttons Handled");
    //.setJustify();

    const buttonsFolder = await PG(`${process.cwd()}/src/Buttons/**/*.js`);
    if (!buttonsFolder.length) return;

    for (let file of buttonsFolder) {
        const buttonFile = require(file);
        if (!buttonFile.id) {
            await Table.addRow(
                `${file.split("/").at(-1).slice(0,-3)}`,
                `⛔ Button ID is missing: ${file.split("/").at(-2)}/${file.split("/").at(-1)}`
            );
            continue;
        }

        client.buttons.set(buttonFile.id, buttonFile);
        Table.addRow(buttonFile.id, "🔷 LOADED");
    }
    Table.sortColumn(1);
    console.log(Table.toString());
};
