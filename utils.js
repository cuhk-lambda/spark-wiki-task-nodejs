function checkYes(title) {
    return !title.includes(":") && !title.includes("{")
}

module.exports = {
    checkYes
}