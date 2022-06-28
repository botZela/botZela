const { AsciiTable3 } = require("ascii-table3");
const { Events } = require("../Validation/EventNames");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 * @param {*} PG
 * @param {AsciiTable3} Ascii
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Events Loaded");
            //.setJustify();

    let eventFiles = await PG(`${__dirname}/../Events/**/*.js`);
    if (!eventFiles.length) return;

    for (const file of eventFiles) {
        const event = require(file);
        if (!Events.includes(event.name) || !event.name) {
            await Table.addRow(
                `${event.name || "MISSING"}`,
                `⛔ Event name is either invalid or missing: ${file.split("/").at(-2)}/${file.split("/").at(-1)}`
            );
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
        await Table.addRow(event.name, "🟢 SUCCESSFUL");
    }

    Table.sortColumn(1);
    console.log(Table.toString());
};
