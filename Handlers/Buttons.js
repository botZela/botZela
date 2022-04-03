const { Client } = require("discord.js");

/**
 * @param {Client} client 
 * @param {*} PG 
 * @param {*} Ascii 
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Buttons Handler");
    const buttonsFolder = await PG(`${process.cwd()}/buttons/**/*.js`);
    
    for (let file of buttonsFolder) {
        const buttonFile = require(file);
        if (!buttonFile.id) continue;

        client.buttons.set(buttonFile.id, buttonFile);
        Table.addRow(buttonFile.id, "🔷 LOADED");
    }
    console.log(Table.toString());

}