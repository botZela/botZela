const request = require("request-promise-native");
const cheerio = require("cheerio");
const fs = require("fs");

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
    console.log("Writing downloaded PDF file to " + outputFilename + "...");
    fs.writeFileSync(outputFilename, pdfBuffer);
}

async function getArticle(doi) {
    try{
        const html = await request(`https://sci-hub.hkvisa.net/${doi}`)
        const $ = cheerio.load(html);
        const url =
            "https:" +
            $("#article embed")
                .attr("src")
                .replace("#navpanes=0&view=FitH", "");
        console.log(url);
        // URL of the image
        const article = url.split("/").at(-1);
        // Path at which image will get downloaded
        const filePath = `${__dirname}/downloads/${article}`;
        downloadPDF(url, filePath);
        return article;    
    }catch(error){
        return 0;
    }
}

module.exports = {
    getArticle,
}
