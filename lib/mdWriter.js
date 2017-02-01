/**
 * Created by shaoyin.zj on 17/1/8.
 */
var fs = require('fs');

//write md to file
function mdWriter(program, mdContent){
    fs.writeFile(program.destination, mdContent, function(err) {
        if (err) {
            throw err;
        }
        console.log('MD File Saved.');
    });
}

module.exports = mdWriter;