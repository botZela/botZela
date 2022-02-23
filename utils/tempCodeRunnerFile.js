const {
    greetings
} = require("./greetings.js");
console.log(greetings("ahmed"));
const data = require("../data/data.json");
data["hello world"] = "test";
console.log(data["hello world"]);

const { saveData } = require("./saveData.js");
saveData();

console.log(WORKSHEETS_URL);