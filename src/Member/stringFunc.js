
function titleCase(str){
    let str1 = str.toLowerCase();
    return str1[0].toUpperCase() + str1.slice(1);
}

module.exports = {
    titleCase,
}
