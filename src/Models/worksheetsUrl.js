const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    guildId : String,
    guildName : String,
    url: String,
});

module.exports = mongoose.model("guild-worksheets", Schema);