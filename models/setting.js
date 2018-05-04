var fs = require('mz/fs');
var path = require('path');

module.exports = function () {
    try {
        var info = JSON.parse(fs.readFileSync(path.join(__dirname, '../', '/config/info.json')));
        return info;
    } catch (e) {
        console.log(e.message);
    }
}