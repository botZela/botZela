const mongoose = require('mongoose');

/**
 * Roles Structure
 * - roleName : roleId;
 */

const Schema = new mongoose.Schema({
    guildId : String,
    guildName : String,
    roles: Map,
});

module.exports = mongoose.model("guild-roles", Schema);