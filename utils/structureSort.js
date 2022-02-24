function structureSort(tab) {
  let n, temp;
  n = tab.length;
  for (let i = 0; i < n; i++) {
    if (tab[i][1].toLowerCase() === "category") {
      try {
        structureSort(tab[i][2]);
      } catch (e) {
        null;
      }
    }
    for (let s = 0; s < n; s++) {
      for (let j = 0; j < n - s - 1; j++) {
        if (
          tab[j][1].toLowerCase() === "category" &&
          tab[j + 1][1].toLowerCase() === "channel"
        ) {
          temp = tab[j];
          tab[j] = tab[j + 1];
          tab[j + 1] = temp;
        } else if (
          tab[j][1].toLowerCase() === "channel" &&
          tab[j + 1][1].toLowerCase() === "channel"
        ) {
          if (
            tab[j][2].toLowerCase() == "voice" &&
            tab[j + 1][2].toLowerCase() === "text"
          ) {
            temp = tab[j];
            tab[j] = tab[j + 1];
            tab[j + 1] = temp;
          }
        }
      }
    }
  }
}/* 
t = [['name2', 'category',[
  [ 'name', 'channel', 'voice' ],
  [ 'name', 'channel', 'text' ],
  [ 'name', 'channel', 'voice' ],
  [ 'name', 'channel', 'text' ]
]]];
structureSort(t);
console.log(t); */
module.exports = {
  structureSort,
};
