const fs = require('fs');
const resolve = require('path').resolve;
const fileName = resolve(`${process.cwd()}/data/data.json`);

function saveData(data) {
    fs.writeFile(fileName, JSON.stringify(data, null, 4), function writeJSON(err) {
        if (err) return console.error(err);
    });
}

module.exports = {
    saveData,
};