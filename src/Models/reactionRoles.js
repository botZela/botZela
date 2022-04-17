const mongoose = require('mongoose');

/**
 * Roles Structure
 * - roleId: string;
 * - roleDescription: string;
 * - roleEmoji: string;
 */

const Schema = new mongoose.Schema({
    title: String,
    guildId : String,
    messageId: String, 
    roles: Array,
});

module.exports = mongoose.model("reaction-roles", Schema);