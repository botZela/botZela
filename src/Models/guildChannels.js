const mongoose = require('mongoose');

/**
 * Channels Structure
 * - channelName : channelId;
 */

const Schema = new mongoose.Schema({
    guildId : String,
    guildName : String,
    channels: Map,
});

module.exports = mongoose.model("guild-channels", Schema);