var parser = require('fast-xml-parser');
var he = require('he');
const parseWikiText = require('./parse_wiki').parseWikiText
const checkYes = require('./utils').checkYes
var totalCount = 0;

var options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, {
        isAttributeValue: true
    }), //default is a=>a
    tagValueProcessor: a => he.decode(a) //default is a=>a
};

// if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)

// }
function parse(pageXML) {
    let jsonObj = parser.parse(pageXML, options);
    let page = jsonObj.page;
    let title = String(page.title);

    if (checkYes(title)) {
        totalCount += 1;
        if (totalCount % 1000 === 0) {
            console.log("Current: " + totalCount)
        }
        return [title, parseWikiText(page.revision.text)]
    }
    return false
}

module.exports = {
    parse
}