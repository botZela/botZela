function loadData() {

    console.log("[INFO] LOADING DATA")

    const data = require("../data/data.json");

    ROLES = data["ROLES"];

    PRV_ROLES = data["PRV_ROLES"];

    ADMINS = data["ADMINS"];

    WORKSHEETS_URL = data["WORKSHEETS_URL"];

    CHANNELS = data["CHANNELS"];

    SUPPORTED_GUILDS = data["SUPPORTED_GUILDS"];

    console.log("[INFO] DATA LOADED SUCCESSFULLY");
}

module.exports = {
    loadData,
}