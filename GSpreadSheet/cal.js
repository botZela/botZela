// Convert a number 0 ... 25 to alphabets A ... Z 
const num2alpha = (number) => {
    // let code = "A".charCodeAt(0) - 1 + number;
    let code = "A".charCodeAt(0) + number;
    return String.fromCharCode(code);
}
const dec2alpha = (number) => {
    number -= 1;
    let out = [];
    let base = 26
    let r = number % base;
    out.push(num2alpha(r));
    while (parseInt(number/ base) >  0){
        number = parseInt((number - base) / base);
        let r = number % base;
        out.push(num2alpha(r));
    }
    return out.reverse().join('');
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255 
    } : null;
}

module.exports = {
    dec2alpha,
    hexToRgb,
}
