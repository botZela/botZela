const fs = require('fs');
const fileName = '../data/data.json';
const { loadData } = require("./loadData.js")

function saveData() {
    const file = require(fileName);
    fs.writeFile(fileName, JSON.stringify(file, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
        //console.log(JSON.stringify(file, null, 4));
        //console.log('writing to ' + fileName);
    });
    loadData();
}

module.exports = {
    saveData,
};