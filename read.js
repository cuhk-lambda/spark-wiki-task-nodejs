const fs = require('fs');
const parser = require('./parse_content')
const WIKINAME = process.argv.length > 2 ? process.argv[2] : "jvwiki"

let fileStream = fs.createReadStream(`${WIKINAME}.xml`);
let outputStream = fs.createWriteStream(`${WIKINAME}.dist.json`)

fileStream.once('error', (err) => {
    console.error(err);
});

// File is done being read
fileStream.once('end', () => {
    outputStream.write(JSON.stringify(result))
    console.log("End")
    console.log("Total count: " + count)
});

fileStream.on('data', (chunk) => {
    proc(chunk.toString())
});

var inPageChunk = false;
var ignoreRegion = false;
var currentBuffer = "";
var count = 0;
var oldstr = "        "
var result = {}

function proc(text) {
    text = oldstr + text
    for (let i = 8; i < text.length; i++) {

        if (inPageChunk
            // && 
            // !ignoreRegion
        ) {
            currentBuffer += text[i];
        }

        if (text[i] === ">") {
            if (inPageChunk) {
                if (text.substring(i - 6, i + 1) === "</page>") {
                    inPageChunk = false;
                    let ret = parser.parse("<page>" + currentBuffer)
                    if (ret) result[ret[0]] = ret[1]
                    currentBuffer = ""
                    count++;
                } else if (text.substring(i - 5, i + 1) === "<page>") {
                    console.log("ERR")
                    process.exit(1)
                }
            } else {
                if (text.substring(i - 5, i + 1) === "<page>") {
                    inPageChunk = true;
                }
            }
        }
    }
    oldstr = text.substring(text.length - 8, text.length + 1)
}