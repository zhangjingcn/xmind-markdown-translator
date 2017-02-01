const xmindFileReader = require('./lib/xmindFileReader');
const xmindToMd = require('./lib/xmindToMd');
const mdWriter = require('./lib/mdWriter');
const attachmentWriter = require('./lib/attachmentWriter');
const command = require('./lib/command');

//获取命令行参数
const program = command();

//获取workbook
var workbook = xmindFileReader(program);

//转化成md格式
var mdContent = xmindToMd(workbook, program);

//输出保存到文件中
mdWriter(program, mdContent);

//输出attatchments
attachmentWriter(program);

