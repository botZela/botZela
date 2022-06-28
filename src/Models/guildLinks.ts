const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    guildId : String,
    guildName : String,
    spreadsheet: String,
    form: String,
});

module.exports = mongoose.model("guild-links", Schema);