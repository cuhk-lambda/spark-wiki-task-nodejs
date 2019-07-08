const checkYes = require('./utils').checkYes

function parseWikiText(text) {
    inQuote = 0;
    ignoreLater = false
    currentBuffer = ""
    currentList = []
    for (i of text) {
        if (i === "[") {
            inQuote++;
        } else if (i === "]") {
            if (inQuote > 0) inQuote--;
            if (inQuote === 0) {
                if ( checkYes(currentBuffer) )
                currentList.push(currentBuffer)
                currentBuffer = ""
                ignoreLater = false
            }
        } else if (i === "|") {
            if (!ignoreLater && inQuote === 2) {
                ignoreLater = true
            }
        } else {
            if (!ignoreLater && inQuote === 2) {
                currentBuffer += i;
            }
        }
    }
    return currentList
}

module.exports = {
    parseWikiText
}