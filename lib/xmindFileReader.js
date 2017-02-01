/**
 * Created by shaoyin.zj on 17/1/8.
 */
const xmind = require('xmind');

//read xml workbook from file
function xmindFileReader(program){
    let workbook = xmind.open(program.source);
    return workbook;
}

module.exports = xmindFileReader;