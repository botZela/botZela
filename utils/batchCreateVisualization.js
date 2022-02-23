function batchCreateVisualization(listFormat, prefix = "") {
  let middlePrefix = prefix + "├── ";
  let lastPrefix = prefix + "└── ";
  let parentsPrefix = prefix + "│    ";
  let newLine = "\n";
  let output = "";
  n = listFormat.length - 1;
  for (let element of listFormat) {
    let branchPrefix, prefix;
    if (n != 0) {
      branchPrefix = middlePrefix;
      prefix = parentsPrefix;
    } else {
      branchPrefix = lastPrefix;
      prefix = "     ";
    }
    if (element[1].toLowerCase() === "category") {
      output += newLine + branchPrefix + element[0];
      try {
        output += batchCreateVisualization(element[2], prefix);
      } catch (e) {
        null;
      }
    } else if (element[1].toLowerCase() === "channel") {
      if (element[2] === "text")
        output += newLine + branchPrefix + "🔊 " + element[0];
    }
    n -= 1;
  }
  console.log(output);
  return output;
}

module.exports = {
  batchCreateVisualization,
};
